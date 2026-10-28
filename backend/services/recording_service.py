"""
Recording service — manages MP4 video recording lifecycle from the live video stream.
Encodes background frames to MP4 using OpenCV VideoWriter.
"""

import os
import cv2
import time
import uuid
import threading
import logging
from config import config
from services.video_service import video_service
from services.session_service import session_service
from repositories.recording_repo import recording_repo
from utils.time_utils import now_iso, current_time_str

logger = logging.getLogger(__name__)


class RecordingService:
    """Service managing MP4 video recording sessions."""

    def __init__(self):
        self.repo = recording_repo
        self._writer: cv2.VideoWriter | None = None
        self._is_recording = False
        self._current_recording_id: str | None = None
        self._current_file_path: str | None = None
        self._start_timestamp: float | None = None
        self._lock = threading.Lock()
        self._thread: threading.Thread | None = None
        self._frame_count = 0

    def start_recording(self, session_id: str = None) -> dict:
        """
        Start recording the live video stream to MP4 file.
        Associates recording with active session or specified session_id.
        """
        with self._lock:
            if self._is_recording:
                active_rec = self.repo.find_by_id(self._current_recording_id)
                if active_rec:
                    return active_rec
                raise RuntimeError("Recording is already in progress")

            # Determine flight session
            if not session_id:
                active_session = session_service.get_active_session()
                if not active_session:
                    # Auto-create active session if none exists
                    active_session = session_service.create_session(notes="Auto-created for recording")
                session_id = active_session["id"]

            rec_id = str(uuid.uuid4())
            filename = f"rec_{session_id[:8]}_{int(time.time())}.mp4"
            file_path = os.path.join(config.RECORDINGS_DIR, filename)

            # Setup VideoWriter
            fourcc = cv2.VideoWriter_fourcc(*config.RECORDING_CODEC)
            fps = config.RECORDING_FPS
            size = (config.CAPTURE_WIDTH, config.CAPTURE_HEIGHT)

            self._writer = cv2.VideoWriter(file_path, fourcc, fps, size)
            if not self._writer.isOpened():
                # Fallback codec if mp4v fails
                fourcc_alt = cv2.VideoWriter_fourcc(*'XVID')
                self._writer = cv2.VideoWriter(file_path, fourcc_alt, fps, size)

            if not self._writer.isOpened():
                raise RuntimeError("Failed to initialize OpenCV VideoWriter for MP4 recording")

            self._is_recording = True
            self._current_recording_id = rec_id
            self._current_file_path = file_path
            self._start_timestamp = time.time()
            self._frame_count = 0

            # DB Record
            db_entry = self.repo.create({
                "id": rec_id,
                "session_id": session_id,
                "file_path": file_path,
                "start_time": now_iso(),
                "status": "recording",
                "resolution": f"{config.CAPTURE_WIDTH}x{config.CAPTURE_HEIGHT}",
                "fps": config.RECORDING_FPS
            })

            # Start writer thread
            self._thread = threading.Thread(target=self._recording_loop, daemon=True)
            self._thread.start()

            # Increment session recording counter
            session_service.increment_counter(session_id, "total_recordings")

            logger.info(f"Started video recording: {rec_id} -> {file_path}")
            return db_entry

    def _recording_loop(self):
        """Background thread writing video frames to disk."""
        target_delay = 1.0 / config.RECORDING_FPS

        while self._is_recording:
            start_time = time.time()

            frame = video_service.get_current_frame()
            if frame is not None and self._writer is not None:
                # Ensure frame size matches writer configuration
                if (frame.shape[1], frame.shape[0]) != (config.CAPTURE_WIDTH, config.CAPTURE_HEIGHT):
                    frame = cv2.resize(frame, (config.CAPTURE_WIDTH, config.CAPTURE_HEIGHT))
                self._writer.write(frame)
                self._frame_count += 1

            elapsed = time.time() - start_time
            sleep_time = max(0.001, target_delay - elapsed)
            time.sleep(sleep_time)

    def stop_recording(self) -> dict | None:
        """Stop the active video recording session and finalize metadata."""
        with self._lock:
            if not self._is_recording or not self._current_recording_id:
                return None

            self._is_recording = False
            if self._thread and self._thread.is_alive():
                self._thread.join(timeout=2.0)

            if self._writer:
                self._writer.release()
                self._writer = None

            duration_sec = round(time.time() - self._start_timestamp, 2) if self._start_timestamp else 0.0
            file_size = os.path.getsize(self._current_file_path) if os.path.exists(self._current_file_path) else 0

            updated = self.repo.update(self._current_recording_id, {
                "end_time": now_iso(),
                "duration_sec": duration_sec,
                "file_size_bytes": file_size,
                "status": "completed"
            })

            logger.info(f"Stopped video recording {self._current_recording_id}: duration={duration_sec}s, size={file_size} bytes")

            self._current_recording_id = None
            self._current_file_path = None
            self._start_timestamp = None
            return updated

    def get_active_recording(self) -> dict | None:
        """Get details of current recording if active."""
        if not self._is_recording or not self._current_recording_id:
            return None
        return self.repo.find_by_id(self._current_recording_id)

    def list_recordings(self, session_id: str = None, page: int = 1, limit: int = 20) -> tuple[list[dict], int]:
        """List recordings with optional session filter."""
        return self.repo.find_all(session_id=session_id, page=page, limit=limit)

    def get_recording(self, recording_id: str) -> dict | None:
        """Get recording details by ID."""
        return self.repo.find_by_id(recording_id)

    def delete_recording(self, recording_id: str) -> bool:
        """Delete recording file and DB record."""
        rec = self.repo.find_by_id(recording_id)
        if not rec:
            return False

        # Delete file from disk if present
        if rec.get("file_path") and os.path.exists(rec["file_path"]):
            try:
                os.remove(rec["file_path"])
                logger.info(f"Deleted recording file: {rec['file_path']}")
            except Exception as e:
                logger.error(f"Failed to delete recording file {rec['file_path']}: {e}")

        return self.repo.delete(recording_id)


# Singleton instance
recording_service = RecordingService()
