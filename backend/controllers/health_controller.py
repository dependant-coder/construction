"""
Health controller — handles health check and status reporting.
"""

import os
import cv2
import logging
from config import config
from controllers.base_controller import success_response, handle_controller_error

logger = logging.getLogger(__name__)


class HealthController:
    """Controller for health endpoints."""

    def check_health(self):
        """GET /api/v1/health — Detailed system health check."""
        try:
            # Check capture device accessibility
            cap_status = "unavailable"
            try:
                cap = cv2.VideoCapture(config.CAPTURE_DEVICE_INDEX)
                if cap.isOpened():
                    cap_status = "available"
                    cap.release()
            except Exception as e:
                logger.warning(f"Error testing capture card: {e}")

            # Check model files
            models_status = {
                "people_model": os.path.exists(config.PEOPLE_MODEL_PATH),
                "ppe_model": os.path.exists(config.PPE_MODEL_PATH)
            }

            # Check GPU status
            gpu_status = {"available": False}
            try:
                import torch
                if torch.cuda.is_available():
                    gpu_status = {
                        "available": True,
                        "name": torch.cuda.get_device_name(0),
                        "vram_total_mb": torch.cuda.get_device_properties(0).total_memory // (1024**2),
                        "vram_used_mb": torch.cuda.memory_allocated(0) // (1024**2),
                        "cuda_version": torch.version.cuda,
                        "pytorch_version": torch.__version__
                    }
            except ImportError:
                pass

            data = {
                "status": "healthy",
                "version": "1.0.0",
                "service": "ConstruVision Flask Backend",
                "components": {
                    "database": "connected",
                    "capture_card": cap_status,
                    "models": models_status,
                    "gpu": gpu_status
                },
                "config": {
                    "capture_device": config.CAPTURE_DEVICE_INDEX,
                    "resolution": f"{config.CAPTURE_WIDTH}x{config.CAPTURE_HEIGHT}",
                    "fps": config.CAPTURE_FPS
                }
            }
            return success_response(data)
        except Exception as e:
            return handle_controller_error(e, "HealthController.check_health")


# Singleton instance
health_controller = HealthController()
