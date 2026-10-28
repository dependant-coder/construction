"""
Unified configuration — the single source of truth for all backend settings.
Access via: from config import config
"""

import os
from pathlib import Path


class Config:
    """Application configuration loaded from environment variables with sensible defaults."""

    # --- Paths ---
    BASE_DIR = Path(__file__).parent.resolve()
    DATABASE_PATH = str(BASE_DIR / "construvision.db")
    RECORDINGS_DIR = str(BASE_DIR / "recordings")
    SNAPSHOTS_DIR = str(BASE_DIR / "snapshots")
    MODEL_WEIGHTS_DIR = str(BASE_DIR / "models" / "weights")

    # --- Flask ---
    HOST = os.getenv("FLASK_HOST", "0.0.0.0")
    PORT = int(os.getenv("FLASK_PORT", "5000"))
    DEBUG = os.getenv("FLASK_DEBUG", "true").lower() == "true"
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "construvision-dev-key-change-in-prod")

    # --- CORS ---
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")

    # --- Video Capture ---
    CAPTURE_DEVICE_INDEX = int(os.getenv("CAPTURE_DEVICE_INDEX", "0"))
    CAPTURE_WIDTH = int(os.getenv("CAPTURE_WIDTH", "1920"))
    CAPTURE_HEIGHT = int(os.getenv("CAPTURE_HEIGHT", "1080"))
    CAPTURE_FPS = int(os.getenv("CAPTURE_FPS", "30"))
    STREAM_JPEG_QUALITY = int(os.getenv("STREAM_JPEG_QUALITY", "80"))

    # --- AI Inference ---
    INFERENCE_INTERVAL_FRAMES = int(os.getenv("INFERENCE_INTERVAL_FRAMES", "5"))
    PEOPLE_MODEL_PATH = os.getenv("PEOPLE_MODEL_PATH", str(BASE_DIR / "models" / "weights" / "yolov8n.pt"))
    PPE_MODEL_PATH = os.getenv("PPE_MODEL_PATH", str(BASE_DIR / "models" / "weights" / "ppe_model.pt"))
    CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", "0.5"))
    USE_SIMULATED_AI = os.getenv("USE_SIMULATED_AI", "false").lower() in ("true", "1")

    # --- GPU / CUDA ---
    DEVICE = os.getenv("INFERENCE_DEVICE", "auto")  # "auto", "cpu", "0", "cuda:0"
    USE_HALF_PRECISION = os.getenv("USE_HALF_PRECISION", "true").lower() in ("true", "1")
    GPU_MEMORY_FRACTION = float(os.getenv("GPU_MEMORY_FRACTION", "0.7"))  # Max fraction of VRAM to use

    # --- Recording ---
    RECORDING_CODEC = os.getenv("RECORDING_CODEC", "mp4v")
    RECORDING_FPS = int(os.getenv("RECORDING_FPS", "30"))

    @classmethod
    def ensure_directories(cls):
        """Create required directories if they don't exist."""
        for dir_path in [cls.RECORDINGS_DIR, cls.SNAPSHOTS_DIR, cls.MODEL_WEIGHTS_DIR]:
            os.makedirs(dir_path, exist_ok=True)


config = Config()
