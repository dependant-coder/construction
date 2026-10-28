"""
Recording controller — parses HTTP requests and delegates to RecordingService.
Supports start/stop, listing, metadata fetch, MP4 download, and deletion.
"""

import os
import logging
from flask import request, send_file
from services.recording_service import recording_service
from controllers.base_controller import (
    success_response,
    created_response,
    paginated_response,
    error_response,
    handle_controller_error
)

logger = logging.getLogger(__name__)


class RecordingController:
    """Controller for video recording endpoints."""

    def __init__(self):
        self.service = recording_service

    def start(self):
        """POST /api/v1/recordings/start — Start recording live stream."""
        try:
            data = request.get_json(silent=True) or {}
            session_id = data.get("session_id")
            recording = self.service.start_recording(session_id=session_id)
            return created_response(recording, message="Video recording started")
        except RuntimeError as e:
            return error_response(str(e), code="CONFLICT", status_code=409)
        except Exception as e:
            return handle_controller_error(e, "RecordingController.start")

    def stop(self):
        """POST /api/v1/recordings/stop — Stop active video recording."""
        try:
            recording = self.service.stop_recording()
            if not recording:
                return error_response("No active video recording to stop", code="NOT_FOUND", status_code=404)
            return success_response(recording, message="Video recording completed and saved")
        except Exception as e:
            return handle_controller_error(e, "RecordingController.stop")

    def get_active(self):
        """GET /api/v1/recordings/active — Get current active recording status."""
        try:
            recording = self.service.get_active_recording()
            return success_response(recording)
        except Exception as e:
            return handle_controller_error(e, "RecordingController.get_active")

    def list(self):
        """GET /api/v1/recordings — List all recorded videos."""
        try:
            session_id = request.args.get("session_id")
            page = int(request.args.get("page", 1))
            limit = int(request.args.get("limit", 20))

            recordings, total = self.service.list_recordings(
                session_id=session_id, page=page, limit=limit
            )
            return paginated_response(recordings, page=page, limit=limit, total=total)
        except Exception as e:
            return handle_controller_error(e, "RecordingController.list")

    def get_by_id(self, recording_id: str):
        """GET /api/v1/recordings/<recording_id> — Get recording metadata."""
        try:
            recording = self.service.get_recording(recording_id)
            if not recording:
                return error_response("Recording not found", code="NOT_FOUND", status_code=404)
            return success_response(recording)
        except Exception as e:
            return handle_controller_error(e, "RecordingController.get_by_id")

    def download(self, recording_id: str):
        """GET /api/v1/recordings/<recording_id>/download — Download MP4 file."""
        try:
            recording = self.service.get_recording(recording_id)
            if not recording or not recording.get("file_path"):
                return error_response("Recording file not found", code="NOT_FOUND", status_code=404)

            file_path = recording["file_path"]
            if not os.path.exists(file_path):
                return error_response("Recording file missing on disk", code="NOT_FOUND", status_code=404)

            return send_file(
                file_path,
                mimetype="video/mp4",
                as_attachment=True,
                download_name=os.path.basename(file_path)
            )
        except Exception as e:
            return handle_controller_error(e, "RecordingController.download")

    def delete(self, recording_id: str):
        """DELETE /api/v1/recordings/<recording_id> — Delete recording file and metadata."""
        try:
            deleted = self.service.delete_recording(recording_id)
            if not deleted:
                return error_response("Recording not found", code="NOT_FOUND", status_code=404)
            return success_response(None, message="Recording deleted successfully")
        except Exception as e:
            return handle_controller_error(e, "RecordingController.delete")


# Singleton instance
recording_controller = RecordingController()
