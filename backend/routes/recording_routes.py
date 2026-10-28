"""
Recording routes — /api/v1/recordings/* endpoints.
Routes only route to RecordingController methods.
"""

from flask import Blueprint
from controllers.recording_controller import recording_controller

recording_bp = Blueprint("recordings", __name__, url_prefix="/api/v1/recordings")


@recording_bp.route("", methods=["GET"])
def list_recordings():
    """GET /api/v1/recordings — List recordings."""
    return recording_controller.list()


@recording_bp.route("/active", methods=["GET"])
def get_active_recording():
    """GET /api/v1/recordings/active — Get active recording status."""
    return recording_controller.get_active()


@recording_bp.route("/start", methods=["POST"])
def start_recording():
    """POST /api/v1/recordings/start — Start MP4 recording."""
    return recording_controller.start()


@recording_bp.route("/stop", methods=["POST"])
def stop_recording():
    """POST /api/v1/recordings/stop — Stop active recording."""
    return recording_controller.stop()


@recording_bp.route("/<recording_id>", methods=["GET"])
def get_recording(recording_id: str):
    """GET /api/v1/recordings/<recording_id> — Get recording metadata."""
    return recording_controller.get_by_id(recording_id)


@recording_bp.route("/<recording_id>/download", methods=["GET"])
def download_recording(recording_id: str):
    """GET /api/v1/recordings/<recording_id>/download — Download MP4 file."""
    return recording_controller.download(recording_id)


@recording_bp.route("/<recording_id>", methods=["DELETE"])
def delete_recording(recording_id: str):
    """DELETE /api/v1/recordings/<recording_id> — Delete recording."""
    return recording_controller.delete(recording_id)
