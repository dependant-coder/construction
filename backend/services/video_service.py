"""
Video Service — manages OpenCV HDMI video capture card reading and MJPEG stream encoding.
Features 1-frame buffer for low streaming latency, synthetic test card fallback, and memory-efficient frame reuse.
"""

import cv2
import time
import threading
import numpy as np
import logging
from config import config
from utils.frame_utils import generate_fallback_frame, encode_frame_to_jpeg, draw_timestamp_overlay

logger = logging.getLogger(__name__)


class VideoService:
    """Thread-safe HDMI Video Capture card manager and stream generator."""

    def __init__(self):
        self._capture: cv2.VideoCapture | None = None
        self._is_running = False
        self._thread: threading.Thread | None = None
        self._lock = threading.Lock()

        self._current_frame: np.ndarray | None = None
        self._annotated_frame: np.ndarray | None = None
        self._cached_fallback_frame: np.ndarray | None = None
        
        self._using_fallback = True
        self._actual_fps = 0.0
        self._fps_counter = 0
        self._last_fps_check = time.time()
        self._frame_count = 0

    def start(self):
        """Start the background video capture thread."""
        if self._is_running:
            return
        self._is_running = True
        self._thread = threading.Thread(target=self._capture_loop, daemon=True)
        self._thread.start()
        logger.info("Video capture background thread started")

    def stop(self):
        """Stop background video capture thread and release hardware resources."""
        self._is_running = False
        if self._thread and self._thread.is_alive():
            self._thread.join(timeout=2.0)
        if self._capture:
            self._capture.release()
            self._capture = None
        logger.info("Video capture hardware released")

    def _get_fallback_frame(self) -> np.ndarray:
        """Cache synthetic fallback frame to avoid continuous memory allocations."""
        if self._cached_fallback_frame is None:
            self._cached_fallback_frame = generate_fallback_frame(
                width=config.CAPTURE_WIDTH,
                height=config.CAPTURE_HEIGHT,
                message="HDMI Input Standby — Capture Card Ready"
            )
        return self._cached_fallback_frame

    def _capture_loop(self):
        """Main loop running in background thread."""
        device_index = config.CAPTURE_DEVICE_INDEX
        logger.info(f"Attempting to open capture device index: {device_index}")

        try:
            import sys
            if sys.platform.startswith("win"):
                self._capture = cv2.VideoCapture(device_index, cv2.CAP_DSHOW)
            else:
                self._capture = cv2.VideoCapture(device_index)
            if self._capture.isOpened():
                try:
                    self._capture.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*'MJPG'))
                except Exception:
                    pass
                self._capture.set(cv2.CAP_PROP_FRAME_WIDTH, config.CAPTURE_WIDTH)
                self._capture.set(cv2.CAP_PROP_FRAME_HEIGHT, config.CAPTURE_HEIGHT)
                self._capture.set(cv2.CAP_PROP_FPS, config.CAPTURE_FPS)
                self._capture.set(cv2.CAP_PROP_BUFFERSIZE, 1)
                self._using_fallback = False
                logger.info(f"HDMI capture device {device_index} opened successfully")
            else:
                logger.warning(f"Could not open hardware capture device {device_index}. Using synthetic video fallback.")
                self._using_fallback = True
        except Exception as e:
            logger.error(f"Error opening capture device: {e}. Using synthetic fallback.")
            self._using_fallback = True

        target_delay = 1.0 / config.CAPTURE_FPS

        while self._is_running:
            start_time = time.time()

            if not self._using_fallback and self._capture and self._capture.isOpened():
                ret, frame = self._capture.read()
                if ret and frame is not None:
                    with self._lock:
                        self._current_frame = frame
                        self._frame_count += 1
                else:
                    fallback = self._get_fallback_frame()
                    with self._lock:
                        self._current_frame = fallback
                        self._frame_count += 1
            else:
                # Use cached synthetic frame
                fallback = self._get_fallback_frame()
                with self._lock:
                    self._current_frame = fallback
                    self._frame_count += 1

            # FPS calculation
            self._fps_counter += 1
            now = time.time()
            if now - self._last_fps_check >= 1.0:
                self._actual_fps = self._fps_counter / (now - self._last_fps_check)
                self._fps_counter = 0
                self._last_fps_check = now

            # Sleep to match target frame rate
            elapsed = time.time() - start_time
            sleep_time = max(0.001, target_delay - elapsed)
            time.sleep(sleep_time)

    def get_current_frame(self) -> np.ndarray | None:
        """Get the latest raw OpenCV BGR frame reference without copying."""
        with self._lock:
            return self._current_frame if self._current_frame is not None else self._get_fallback_frame()

    def set_annotated_frame(self, frame: np.ndarray):
        """Set the latest AI-annotated frame (called by DetectionService)."""
        with self._lock:
            self._annotated_frame = frame

    def get_annotated_frame(self) -> np.ndarray | None:
        """Get the latest AI-annotated frame, or fall back to raw frame with timestamp."""
        with self._lock:
            if self._annotated_frame is not None:
                return self._annotated_frame
            if self._current_frame is not None:
                return self._current_frame
            return self._get_fallback_frame()

    def generate_mjpeg_stream(self, annotated: bool = False):
        """Generator yielding multipart/x-mixed-replace MJPEG bytes for HTTP streaming."""
        target_delay = 1.0 / config.CAPTURE_FPS

        while True:
            start_time = time.time()

            frame = self.get_annotated_frame() if annotated else self.get_current_frame()
            if frame is None:
                frame = self._get_fallback_frame()

            jpeg_bytes = encode_frame_to_jpeg(frame, quality=config.STREAM_JPEG_QUALITY)
            if jpeg_bytes:
                yield (
                    b'--frame\r\n'
                    b'Content-Type: image/jpeg\r\n\r\n' + jpeg_bytes + b'\r\n'
                )

            elapsed = time.time() - start_time
            sleep_time = max(0.005, target_delay - elapsed)
            time.sleep(sleep_time)

    def get_status(self) -> dict:
        """Return video capture diagnostics."""
        with self._lock:
            return {
                "using_fallback": self._using_fallback,
                "device_index": config.CAPTURE_DEVICE_INDEX,
                "target_fps": config.CAPTURE_FPS,
                "actual_fps": round(self._actual_fps, 1),
                "resolution": f"{config.CAPTURE_WIDTH}x{config.CAPTURE_HEIGHT}",
                "total_frames": self._frame_count,
                "is_active": self._is_running and (self._current_frame is not None)
            }


# Singleton instance
video_service = VideoService()
