"""
Stream routes — /api/v1/stream/* endpoints.
"""

from flask import Blueprint
from controllers.stream_controller import stream_controller

stream_bp = Blueprint("stream", __name__, url_prefix="/api/v1/stream")


@stream_bp.route("/live", methods=["GET"])
def live_stream():
    """GET /api/v1/stream/live — Raw MJPEG live stream."""
    return stream_controller.get_live_stream()


@stream_bp.route("/annotated", methods=["GET"])
def annotated_stream():
    """GET /api/v1/stream/annotated — AI-annotated MJPEG stream."""
    return stream_controller.get_annotated_stream()


@stream_bp.route("/status", methods=["GET"])
def stream_status():
    """GET /api/v1/stream/status — Capture status, resolution, and FPS."""
    return stream_controller.get_status()
