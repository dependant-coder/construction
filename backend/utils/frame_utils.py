"""
Frame processing utilities — JPEG encoding, resizing, timestamp overlays, and drawing AI bounding boxes.
"""

import cv2
import numpy as np
from datetime import datetime
from config import config


def encode_jpeg(frame: np.ndarray, quality: int = None) -> bytes | None:
    """Encode an OpenCV BGR frame array into JPEG byte array."""
    if frame is None:
        return None
    q = quality or config.STREAM_JPEG_QUALITY
    encode_params = [int(cv2.IMWRITE_JPEG_QUALITY), q]
    success, buffer = cv2.imencode('.jpg', frame, encode_params)
    if not success:
        return None
    return buffer.tobytes()


# Alias for video_service import
encode_frame_to_jpeg = encode_jpeg


def draw_timestamp_overlay(frame: np.ndarray, text_prefix: str = "LIVE FEED") -> np.ndarray:
    """Draw timestamp and status overlay on the top-left of the frame."""
    if frame is None:
        return frame
    
    annotated = frame.copy()
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    overlay_text = f"{text_prefix} | {now_str}"

    # Text style settings
    font = cv2.FONT_HERSHEY_SIMPLEX
    scale = 0.5
    thickness = 1
    text_color = (255, 255, 255)
    bg_color = (0, 0, 0)

    (text_w, text_h), baseline = cv2.getTextSize(overlay_text, font, scale, thickness)
    
    # Semi-transparent background box
    cv2.rectangle(annotated, (10, 10), (20 + text_w, 20 + text_h + baseline), bg_color, -1)
    cv2.putText(annotated, overlay_text, (15, 15 + text_h), font, scale, text_color, thickness, cv2.LINE_AA)

    return annotated


def generate_fallback_frame(width: int = 1920, height: int = 1080, message: str = "HDMI Capture Card Initializing...") -> np.ndarray:
    """Generate a synthetic test pattern frame when no physical camera is attached."""
    frame = np.zeros((height, width, 3), dtype=np.uint8)
    
    # Dark slate background gradient effect
    frame[:, :] = (30, 25, 20)

    # Grid pattern lines
    grid_size = 80
    for x in range(0, width, grid_size):
        cv2.line(frame, (x, 0), (x, height), (45, 40, 35), 1)
    for y in range(0, height, grid_size):
        cv2.line(frame, (0, y), (width, y), (45, 40, 35), 1)

    # Text styling
    font = cv2.FONT_HERSHEY_SIMPLEX
    
    # Title
    title = "ConstruVision - Live Drone Feed"
    (tw, th), _ = cv2.getTextSize(title, font, 1.2, 2)
    cv2.putText(frame, title, ((width - tw) // 2, height // 2 - 40), font, 1.2, (255, 255, 255), 2, cv2.LINE_AA)

    # Subtitle / message
    (mw, mh), _ = cv2.getTextSize(message, font, 0.8, 2)
    cv2.putText(frame, message, ((width - mw) // 2, height // 2 + 20), font, 0.8, (0, 200, 255), 2, cv2.LINE_AA)

    # Live indicator dot and timestamp
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
    time_text = f"SYS TIME: {now_str} | HDMI-1 [READY]"
    (sw, sh), _ = cv2.getTextSize(time_text, font, 0.6, 1)
    cv2.putText(frame, time_text, ((width - sw) // 2, height // 2 + 70), font, 0.6, (180, 180, 180), 1, cv2.LINE_AA)

    return frame
