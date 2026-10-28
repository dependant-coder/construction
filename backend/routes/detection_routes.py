"""
Detection and PPE observation routes — /api/v1/detections/* and /api/v1/ppe-observations/*
"""

from flask import Blueprint
from controllers.detection_controller import detection_controller

detection_bp = Blueprint("detections", __name__, url_prefix="/api/v1/detections")
ppe_bp = Blueprint("ppe", __name__, url_prefix="/api/v1/ppe-observations")


@detection_bp.route("/mode", methods=["GET"])
def get_ai_mode():
    """GET /api/v1/detections/mode — Get current AI mode."""
    return detection_controller.get_mode()


@detection_bp.route("/mode", methods=["POST"])
def set_ai_mode():
    """POST /api/v1/detections/mode — Set AI mode (Real vs Mock ML)."""
    return detection_controller.set_mode()


@detection_bp.route("/latest", methods=["GET"])
def get_latest_detection():
    """GET /api/v1/detections/latest — Get latest detection."""
    return detection_controller.get_latest()


@detection_bp.route("", methods=["GET"])
def list_detections():
    """GET /api/v1/detections — List detection history."""
    return detection_controller.list_detections()


@detection_bp.route("/snapshot", methods=["POST"])
def capture_snapshot():
    """POST /api/v1/detections/snapshot — Capture manual snapshot."""
    return detection_controller.capture_snapshot()


@ppe_bp.route("", methods=["GET"])
def list_ppe_observations():
    """GET /api/v1/ppe-observations — List PPE violation events."""
    return detection_controller.list_ppe_observations()


@ppe_bp.route("/<obs_id>/resolve", methods=["POST"])
def resolve_ppe_observation(obs_id: str):
    """POST /api/v1/ppe-observations/<obs_id>/resolve — Mark violation resolved."""
    return detection_controller.resolve_ppe_observation(obs_id)
