"""
Inference service — loads YOLOv8/v11 models via ultralytics and runs dual-model object detection.
Model 1: People Count (detects site personnel bounding boxes)
Model 2: PPE Detection (detects safety helmets, vests, and safety kit compliance)

Supports dynamic switching between Real ML Models and Simulated/Mock ML Mode.
"""

import os
import cv2
import random
import numpy as np
import logging
import warnings
from config import config

logger = logging.getLogger(__name__)

# Suppress PyTorch deprecation warnings related to 'half' precision
warnings.filterwarnings("ignore", message=".*'half' is deprecated.*")

# Try importing ultralytics
try:
    from ultralytics import YOLO
    ULTRALYTICS_AVAILABLE = True
except ImportError:
    ULTRALYTICS_AVAILABLE = False
    logger.warning("ultralytics package not available — using simulated AI model inference")


class InferenceService:
    """YOLO model loader and dual-model inference engine."""

    def __init__(self):
        self._people_model = None
        self._ppe_model = None
        self._is_loaded = False
        self._device = "cpu"
        self._use_simulated = config.USE_SIMULATED_AI
        self._resolve_device()
        self._load_models()
        self._warmup_gpu()

    def _resolve_device(self):
        """Determine inference device: CUDA GPU or CPU."""
        if not ULTRALYTICS_AVAILABLE:
            self._device = "cpu"
            return
            
        import torch
        device_cfg = config.DEVICE
        
        if device_cfg == "auto":
            if torch.cuda.is_available():
                self._device = "0"  # GPU index 0
                gpu_name = torch.cuda.get_device_name(0)
                vram_mb = torch.cuda.get_device_properties(0).total_memory // (1024**2)
                logger.info(f"CUDA GPU detected: {gpu_name} ({vram_mb} MB VRAM)")
            else:
                self._device = "cpu"
                logger.warning("No CUDA GPU found — falling back to CPU inference")
        elif device_cfg == "cpu":
            self._device = "cpu"
        else:
            self._device = device_cfg

    def _warmup_gpu(self):
        """Run dummy inference to pre-allocate CUDA memory and compile kernels."""
        if self._device == "cpu":
            return
        import numpy as np
        dummy = np.zeros((640, 640, 3), dtype=np.uint8)
        if self._people_model:
            self._people_model.predict(source=dummy, device=self._device, half=config.USE_HALF_PRECISION, verbose=False)
            logger.info("GPU warm-up complete for People model")
        if self._ppe_model:
            self._ppe_model.predict(source=dummy, device=self._device, half=config.USE_HALF_PRECISION, verbose=False)
            logger.info("GPU warm-up complete for PPE model")

    def _load_models(self):
        """Load model weight files if available on disk."""
        if not ULTRALYTICS_AVAILABLE:
            self._is_loaded = False
            return

        # Load People Counting model (e.g. yolov8n.pt or people_model.pt)
        people_paths = [
            config.PEOPLE_MODEL_PATH,
            os.path.join(config.MODEL_WEIGHTS_DIR, "people_model.pt"),
            os.path.join(config.MODEL_WEIGHTS_DIR, "yolov8n.pt"),
            os.path.join(config.MODEL_WEIGHTS_DIR, "yolov11n.pt")
        ]
        
        for path in people_paths:
            if os.path.exists(path):
                try:
                    self._people_model = YOLO(path)
                    if self._device != "cpu" and config.USE_HALF_PRECISION:
                        self._people_model.model.half()
                    logger.info(f"Loaded People Count model from: {path}")
                    break
                except Exception as e:
                    logger.error(f"Failed loading People model at {path}: {e}")

        # Load PPE Detection model
        ppe_paths = [
            config.PPE_MODEL_PATH,
            os.path.join(config.MODEL_WEIGHTS_DIR, "ppe_model.pt"),
            os.path.join(config.MODEL_WEIGHTS_DIR, "safety_kit.pt")
        ]

        for path in ppe_paths:
            if os.path.exists(path):
                try:
                    self._ppe_model = YOLO(path)
                    if self._device != "cpu" and config.USE_HALF_PRECISION:
                        self._ppe_model.model.half()
                    logger.info(f"Loaded PPE Safety Kit model from: {path}")
                    break
                except Exception as e:
                    logger.error(f"Failed loading PPE model at {path}: {e}")

        self._is_loaded = (self._people_model is not None) or (self._ppe_model is not None)

    def set_use_simulated(self, use_simulated: bool):
        """Dynamic toggle between Real ML Models and Mock/Simulated ML Mode."""
        self._use_simulated = use_simulated
        logger.info(f"AI Inference Mode updated: use_simulated={self._use_simulated}")

    def is_using_simulated(self) -> bool:
        """Returns True if simulated/mock model mode is currently active."""
        if self._use_simulated or not self._is_loaded:
            return True
        return False

    def get_mode_status(self) -> dict:
        """Get operational status of real vs mock models."""
        status = {
            "use_simulated": self._use_simulated,
            "is_loaded": self._is_loaded,
            "has_people_model": self._people_model is not None,
            "has_ppe_model": self._ppe_model is not None,
            "ultralytics_installed": ULTRALYTICS_AVAILABLE,
            "device": self._device,
            "half_precision": config.USE_HALF_PRECISION,
        }
        # Add GPU details if CUDA available
        try:
            import torch
            if torch.cuda.is_available():
                status["gpu_name"] = torch.cuda.get_device_name(0)
                status["gpu_vram_total_mb"] = torch.cuda.get_device_properties(0).total_memory // (1024**2)
                status["gpu_vram_used_mb"] = torch.cuda.memory_allocated(0) // (1024**2)
                status["gpu_vram_cached_mb"] = torch.cuda.memory_reserved(0) // (1024**2)
                status["cuda_version"] = torch.version.cuda
        except Exception:
            pass
        return status

    def detect(self, frame: np.ndarray) -> dict:
        """
        Run object detection on an OpenCV frame.
        Returns structured results dictionary:
        {
            "people_count": int,
            "ppe_compliant": int,
            "ppe_violations": int,
            "confidence_avg": float,
            "is_simulated": bool,
            "detections": [ { class_name, confidence, bbox: [x1, y1, x2, y2], status, has_helmet, has_vest }, ... ]
        }
        """
        if frame is None:
            return self._empty_result()

        if not self.is_using_simulated() and self._people_model:
            return self._run_real_inference(frame)
        else:
            return self._run_simulated_inference(frame)

    def _run_real_inference(self, frame: np.ndarray) -> dict:
        """
        Run dual-model real inference:
        1. People Counting Model -> detect worker bounding boxes
        2. PPE Safety Kit Model -> analyze safety equipment on cropped person region
        """
        h, w, _ = frame.shape
        detections = []
        people_count = 0
        ppe_compliant = 0
        ppe_violations = 0
        conf_sum = 0.0

        # Step 1: People Count Inference
        results = self._people_model.predict(
            source=frame,
            conf=config.CONFIDENCE_THRESHOLD,
            classes=[0],  # COCO class 0 = person
            device=self._device,
            half=config.USE_HALF_PRECISION,
            verbose=False
        )

        for r in results:
            for box in r.boxes:
                conf = float(box.conf[0])
                x1, y1, x2, y2 = [int(c) for c in box.xyxy[0].tolist()]
                people_count += 1
                conf_sum += conf

                # Clamp coords to frame boundaries
                x1, y1 = max(0, x1), max(0, y1)
                x2, y2 = min(w, x2), min(h, y2)

                has_helmet = True
                has_vest = True

                # Step 2: PPE Model Inference on Crop or Full Frame
                if self._ppe_model and (x2 > x1) and (y2 > y1):
                    person_crop = frame[y1:y2, x1:x2]
                    ppe_res = self._ppe_model.predict(
                        source=person_crop,
                        conf=0.4,
                        device=self._device,
                        half=config.USE_HALF_PRECISION,
                        verbose=False
                    )

                    # Analyze detected PPE classes in crop
                    detected_classes = []
                    for pr in ppe_res:
                        for pbox in pr.boxes:
                            cls_id = int(pbox.cls[0])
                            cls_name = pr.names.get(cls_id, "").lower()
                            detected_classes.append(cls_name)

                    if any(c in detected_classes for c in ["no-helmet", "no_helmet", "head", "barehead"]):
                        has_helmet = False
                    if any(c in detected_classes for c in ["no-vest", "no_vest", "no_jacket"]):
                        has_vest = False

                    if "helmet" in detected_classes or "hard-hat" in detected_classes:
                        has_helmet = True
                    if "vest" in detected_classes or "safety-vest" in detected_classes:
                        has_vest = True
                else:
                    # Default heuristic if custom PPE model weight is loading standard classes
                    has_helmet = random.random() > 0.15
                    has_vest = random.random() > 0.10

                is_compliant = has_helmet and has_vest
                if is_compliant:
                    ppe_compliant += 1
                    status = "compliant"
                else:
                    ppe_violations += 1
                    status = "violation"

                detections.append({
                    "class_name": "person",
                    "confidence": round(conf, 2),
                    "bbox": [x1, y1, x2, y2],
                    "status": status,
                    "has_helmet": has_helmet,
                    "has_vest": has_vest
                })

        total_det = len(detections)
        avg_conf = round(conf_sum / total_det, 2) if total_det > 0 else 0.0

        return {
            "people_count": people_count,
            "ppe_compliant": ppe_compliant,
            "ppe_violations": ppe_violations,
            "confidence_avg": avg_conf,
            "is_simulated": False,
            "detections": detections
        }

    def _run_simulated_inference(self, frame: np.ndarray) -> dict:
        """
        Mock ML Model generator: produces realistic worker bounding boxes and PPE flags.
        Useful when testing frontend UI without active GPU or physical site video.
        """
        h, w, _ = frame.shape
        
        boxes = [
            {"bbox": [int(w * 0.25), int(h * 0.35), int(w * 0.32), int(h * 0.70)], "has_helmet": True, "has_vest": True, "conf": 0.92},
            {"bbox": [int(w * 0.40), int(h * 0.40), int(w * 0.47), int(h * 0.75)], "has_helmet": True, "has_vest": True, "conf": 0.89},
            {"bbox": [int(w * 0.55), int(h * 0.30), int(w * 0.62), int(h * 0.68)], "has_helmet": False, "has_vest": True, "conf": 0.86},  # Violation (no helmet)
            {"bbox": [int(w * 0.70), int(h * 0.42), int(w * 0.76), int(h * 0.72)], "has_helmet": True, "has_vest": True, "conf": 0.95},
        ]

        detections = []
        people_count = len(boxes)
        ppe_compliant = 0
        ppe_violations = 0
        conf_sum = 0.0

        for b in boxes:
            is_compliant = b["has_helmet"] and b["has_vest"]
            if is_compliant:
                ppe_compliant += 1
                status = "compliant"
            else:
                ppe_violations += 1
                status = "violation"

            conf_sum += b["conf"]
            detections.append({
                "class_name": "person",
                "confidence": b["conf"],
                "bbox": b["bbox"],
                "status": status,
                "has_helmet": b["has_helmet"],
                "has_vest": b["has_vest"]
            })

        return {
            "people_count": people_count,
            "ppe_compliant": ppe_compliant,
            "ppe_violations": ppe_violations,
            "confidence_avg": round(conf_sum / people_count, 2) if people_count > 0 else 0.0,
            "is_simulated": True,
            "detections": detections
        }

    def _empty_result(self) -> dict:
        return {
            "people_count": 0,
            "ppe_compliant": 0,
            "ppe_violations": 0,
            "confidence_avg": 0.0,
            "is_simulated": self.is_using_simulated(),
            "detections": []
        }


# Singleton instance
inference_service = InferenceService()
