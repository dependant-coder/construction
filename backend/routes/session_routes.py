"""
Session routes — Express-style route handlers for /api/v1/sessions.
Zero business logic — routes only route to controller methods.
"""

from flask import Blueprint
from controllers.session_controller import session_controller

session_bp = Blueprint("sessions", __name__, url_prefix="/api/v1/sessions")


@session_bp.route("", methods=["GET"])
def list_sessions():
    """GET /api/v1/sessions — List all sessions."""
    return session_controller.list()


@session_bp.route("/active", methods=["GET"])
def get_active_session():
    """GET /api/v1/sessions/active — Get active session."""
    return session_controller.get_active()


@session_bp.route("/<session_id>", methods=["GET"])
def get_session(session_id: str):
    """GET /api/v1/sessions/<session_id> — Get session details."""
    return session_controller.get_by_id(session_id)


@session_bp.route("", methods=["POST"])
def create_session():
    """POST /api/v1/sessions — Create new flight session."""
    return session_controller.create()


@session_bp.route("/<session_id>", methods=["PATCH"])
def update_session(session_id: str):
    """PATCH /api/v1/sessions/<session_id> — Update session."""
    return session_controller.update(session_id)


@session_bp.route("/<session_id>/complete", methods=["POST"])
def complete_session(session_id: str):
    """POST /api/v1/sessions/<session_id>/complete — Mark session completed."""
    return session_controller.complete(session_id)
