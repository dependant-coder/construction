"""
Detection service — orchestrates AI inference, bounding box rendering, database persistence, and snapshot generation.
Runs background processing loop on live frames from VideoService.
"""

import os
import cv2
import time
import uuid
import numpy as np
import threading
import logging
from config import config
from services.video_service import video_service
from services.session_service import session_service
from services.inference_service import inference_service
from repositories.detection_repo import detection_repo
from utils.time_utils import now_iso, current_time_str

logger = logging.getLogger(__name__)


class DetectionService:
    """Service managing real-time AI detection pipeline."""

    def __init__(self):
        self.repo = detection_repo
        self._is_running = False
        self._thread: threading.Thread | None = None
        self._latest_result: dict | None = None
        self._lock = threading.Lock()
        self._frame_counter = 0

    def start(self):
        """Start background AI detection loop."""
        if self._is_running:
            return
        self._is_running = True
        self._thread = threading.Thread(target=self._detection_loop, daemon=True)
        self._thread.start()
        logger.info("AI Detection pipeline background thread started")

    def stop(self):
        """Stop background AI detection loop."""
        self._is_running = False
        if self._thread and self._thread.is_alive():
            self._thread.join(timeout=2.0)
        logger.info("AI Detection pipeline stopped")

    def _detection_loop(self):
        """Main loop: runs YOLO inference every N frames and updates stream overlays."""
        interval = max(1, int(os.getenv("INFERENCE_INTERVAL_FRAMES", "2")))

        while self._is_running:
            try:
                frame = video_service.get_current_frame()
                if frame is not None:
                    self._frame_counter += 1

                    # Run inference every N frames
                    if self._frame_counter % interval == 0:
                        try:
                            import torch
                            if torch.cuda.is_available():
                                torch.cuda.synchronize()
                        except ImportError:
                            pass
                        start_time = time.time()
                        result = inference_service.detect(frame)
                        try:
                            import torch
                            if torch.cuda.is_available():
                                torch.cuda.synchronize()
                        except ImportError:
                            pass
                        inference_ms = round((time.time() - start_time) * 1000, 2)
                        result["inference_ms"] = inference_ms

                        # Render annotated frame with bounding boxes
                        annotated = self._render_annotations(frame, result)
                        video_service.set_annotated_frame(annotated)

                        with self._lock:
                            self._latest_result = result

                        # Save detection record to DB if an active flight session exists
                        active_session = session_service.get_active_session()
                        if active_session:
                            self._persist_detection(active_session["id"], result, frame, annotated)

                        # Periodic VRAM cleanup
                        if self._frame_counter % 1000 == 0:
                            try:
                                import torch
                                if torch.cuda.is_available():
                                    torch.cuda.empty_cache()
                            except ImportError:
                                pass

                time.sleep(0.03)  # ~30 FPS loop rate
            except Exception as e:
                logger.error(f"Error in AI detection loop: {e}", exc_info=True)
                time.sleep(0.1)

    def _render_annotations(self, frame: np.ndarray, result: dict) -> np.ndarray:
        """Draw bounding boxes, labels, and status header on frame."""
        annotated = frame.copy()
        font = cv2.FONT_HERSHEY_SIMPLEX

        # Top banner with summary counts & active AI mode
        people = result.get("people_count", 0)
        compliant = result.get("ppe_compliant", 0)
        violations = result.get("ppe_violations", 0)
        inf_ms = result.get("inference_ms", 0.0)
        is_sim = result.get("is_simulated", True)

        mode_tag = "[MOCK ML]" if is_sim else "[REAL ML .PT]"
        banner_text = f"{mode_tag} PERSONNEL: {people} | COMPLIANT: {compliant} | VIOLATIONS: {violations} | LATENCY: {inf_ms}ms"
        cv2.rectangle(annotated, (0, 0), (frame.shape[1], 40), (20, 20, 20), -1)
        banner_color = (0, 215, 255) if is_sim else (0, 255, 128)
        cv2.putText(annotated, banner_text, (20, 26), font, 0.65, banner_color, 2, cv2.LINE_AA)

        # Draw bounding boxes
        for det in result.get("detections", []):
            bbox = det.get("bbox")
            if not bbox or len(bbox) != 4:
                continue

            x1, y1, x2, y2 = bbox
            status = det.get("status", "compliant")
            conf = det.get("confidence", 0.0)

            # Colors: Green for compliant, Red for PPE violation
            color = (0, 220, 0) if status == "compliant" else (0, 0, 235)
            cv2.rectangle(annotated, (x1, y1), (x2, y2), color, 2)

            # Label box
            label = f"Person {int(conf*100)}%"
            if status == "violation":
                label += " [NO HELMET]"

            (lw, lh), _ = cv2.getTextSize(label, font, 0.5, 1)
            cv2.rectangle(annotated, (x1, y1 - 22), (x1 + lw + 6, y1), color, -1)
            cv2.putText(annotated, label, (x1 + 3, y1 - 6), font, 0.5, (255, 255, 255), 1, cv2.LINE_AA)

        return annotated

    def _persist_detection(self, session_id: str, result: dict, raw_frame: np.ndarray, annotated_frame: np.ndarray):
        """Persist detection record and auto-log PPE violations + snapshots to SQLite."""
        det_id = str(uuid.uuid4())
        
        # Save detection record
        det_record = self.repo.save_detection({
            "id": det_id,
            "session_id": session_id,
            "timestamp": now_iso(),
            "people_count": result.get("people_count", 0),
            "ppe_compliant": result.get("ppe_compliant", 0),
            "ppe_violations": result.get("ppe_violations", 0),
            "bbox_data": result.get("detections", []),
            "confidence_avg": result.get("confidence_avg", 0.0),
            "inference_ms": result.get("inference_ms", 0.0),
            "frame_number": self._frame_counter
        })

        session_service.increment_counter(session_id, "total_detections")

        # Auto-log PPE violations if present
        if result.get("ppe_violations", 0) > 0:
            for det in result.get("detections", []):
                if det.get("status") == "violation":
                    snapshot_path = self._save_snapshot_image(annotated_frame, session_id, det_id)
                    
                    self.repo.save_ppe_observation({
                        "id": str(uuid.uuid4()),
                        "session_id": session_id,
                        "detection_id": det_id,
                        "violation_type": "No Helmet / Missing PPE",
                        "severity": "medium",
                        "location_note": "Drone Live Stream Area",
                        "snapshot_path": snapshot_path,
                        "timestamp": now_iso()
                    })

    def _save_snapshot_image(self, frame: np.ndarray, session_id: str, det_id: str) -> str:
        """Save an annotated JPEG snapshot file to disk."""
        filename = f"snap_{session_id[:8]}_{int(time.time())}.jpg"
        file_path = os.path.join(config.SNAPSHOTS_DIR, filename)
        cv2.imwrite(file_path, frame, [int(cv2.IMWRITE_JPEG_QUALITY), 85])

        file_size = os.path.getsize(file_path) if os.path.exists(file_path) else 0

        self.repo.save_snapshot({
            "id": str(uuid.uuid4()),
            "session_id": session_id,
            "detection_id": det_id,
            "file_path": file_path,
            "file_size_bytes": file_size,
            "timestamp": now_iso(),
            "notes": "Auto-saved on PPE violation"
        })

        session_service.increment_counter(session_id, "total_snapshots")
        return file_path

    def get_latest_detection(self, session_id: str = None) -> dict | None:
        """Get the latest AI detection result."""
        if session_id:
            return self.repo.find_latest_by_session(session_id)
        with self._lock:
            return self._latest_result

    def capture_manual_snapshot(self, session_id: str = None, notes: str = None) -> dict:
        """Capture a manual snapshot on user click."""
        if not session_id:
            active = session_service.get_active_session()
            if not active:
                active = session_service.create_session(notes="Auto-created for snapshot")
            session_id = active["id"]

        frame = video_service.get_annotated_frame()
        if frame is None:
            raise RuntimeError("No live frame available for snapshot")

        det_id = str(uuid.uuid4())
        filename = f"manual_snap_{session_id[:8]}_{int(time.time())}.jpg"
        file_path = os.path.join(config.SNAPSHOTS_DIR, filename)
        cv2.imwrite(file_path, frame, [int(cv2.IMWRITE_JPEG_QUALITY), 90])

        file_size = os.path.getsize(file_path) if os.path.exists(file_path) else 0

        snapshot = self.repo.save_snapshot({
            "id": str(uuid.uuid4()),
            "session_id": session_id,
            "detection_id": det_id,
            "file_path": file_path,
            "file_size_bytes": file_size,
            "timestamp": now_iso(),
            "notes": notes or "Manual user snapshot"
        })

        session_service.increment_counter(session_id, "total_snapshots")
        return snapshot

    def list_detections(self, session_id: str = None, page: int = 1, limit: int = 20) -> tuple[list[dict], int]:
        return self.repo.find_all_detections(session_id=session_id, page=page, limit=limit)

    def list_ppe_observations(self, session_id: str = None, resolved: bool = None, page: int = 1, limit: int = 20) -> tuple[list[dict], int]:
        return self.repo.find_all_ppe_observations(session_id=session_id, resolved=resolved, page=page, limit=limit)

    def resolve_ppe_observation(self, obs_id: str, resolved_by: str = "safety_officer") -> dict | None:
        return self.repo.resolve_ppe_observation(obs_id, resolved_by=resolved_by)


# Singleton instance
detection_service = DetectionService()
