"""
Stream controller — handles MJPEG live streaming HTTP responses.
"""

import logging
from flask import Response
from services.video_service import video_service
from controllers.base_controller import success_response, handle_controller_error

logger = logging.getLogger(__name__)


class StreamController:
    """Controller for video streaming endpoints."""

    def __init__(self):
        self.service = video_service

    def get_live_stream(self):
        """GET /api/v1/stream/live — Raw MJPEG stream from capture card."""
        try:
            return Response(
                self.service.generate_mjpeg_stream(annotated=False),
                mimetype="multipart/x-mixed-replace; boundary=frame"
            )
        except Exception as e:
            return handle_controller_error(e, "StreamController.get_live_stream")

    def get_annotated_stream(self):
        """GET /api/v1/stream/annotated — MJPEG stream with AI bounding box overlays."""
        try:
            return Response(
                self.service.generate_mjpeg_stream(annotated=True),
                mimetype="multipart/x-mixed-replace; boundary=frame"
            )
        except Exception as e:
            return handle_controller_error(e, "StreamController.get_annotated_stream")

    def get_status(self):
        """GET /api/v1/stream/status — Capture status & resolution information."""
        try:
            status = self.service.get_status()
            return success_response(status)
        except Exception as e:
            return handle_controller_error(e, "StreamController.get_status")


# Singleton instance
stream_controller = StreamController()
