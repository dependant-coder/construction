"""
Session controller — parses HTTP requests and delegates to SessionService.
Uses base_controller helpers for standardized response formatting.
"""

import logging
from flask import request
from services.session_service import session_service
from controllers.base_controller import (
    success_response,
    created_response,
    paginated_response,
    error_response,
    handle_controller_error
)

logger = logging.getLogger(__name__)


class SessionController:
    """Controller for flight session endpoints."""

    def __init__(self):
        self.service = session_service

    def list(self):
        """GET /api/v1/sessions — List sessions with optional filters."""
        try:
            date = request.args.get("date")
            status = request.args.get("status")
            page = int(request.args.get("page", 1))
            limit = int(request.args.get("limit", 20))

            sessions, total = self.service.list_sessions(
                date=date, status=status, page=page, limit=limit
            )
            return paginated_response(sessions, page=page, limit=limit, total=total)
        except Exception as e:
            return handle_controller_error(e, "SessionController.list")

    def get_by_id(self, session_id: str):
        """GET /api/v1/sessions/<session_id> — Get session by ID."""
        try:
            session = self.service.get_session(session_id)
            if not session:
                return error_response("Flight session not found", code="NOT_FOUND", status_code=404)
            return success_response(session)
        except Exception as e:
            return handle_controller_error(e, "SessionController.get_by_id")

    def get_active(self):
        """GET /api/v1/sessions/active — Get currently active flight session."""
        try:
            session = self.service.get_active_session()
            if not session:
                return success_response(None, message="No active flight session")
            return success_response(session)
        except Exception as e:
            return handle_controller_error(e, "SessionController.get_active")

    def create(self):
        """POST /api/v1/sessions — Create a new flight session."""
        try:
            data = request.get_json(silent=True) or {}
            session = self.service.create_session(
                name=data.get("name"),
                date=data.get("date"),
                start_time=data.get("start_time"),
                notes=data.get("notes"),
                camera_id=data.get("camera_id")
            )
            return created_response(session, message="Flight session created successfully")
        except Exception as e:
            return handle_controller_error(e, "SessionController.create")

    def update(self, session_id: str):
        """PATCH /api/v1/sessions/<session_id> — Update session metadata."""
        try:
            data = request.get_json(silent=True) or {}
            updated = self.service.update_session(session_id, data)
            if not updated:
                return error_response("Flight session not found", code="NOT_FOUND", status_code=404)
            return success_response(updated, message="Flight session updated")
        except Exception as e:
            return handle_controller_error(e, "SessionController.update")

    def complete(self, session_id: str):
        """POST /api/v1/sessions/<session_id>/complete — Mark session as completed."""
        try:
            completed = self.service.complete_session(session_id)
            if not completed:
                return error_response("Flight session not found", code="NOT_FOUND", status_code=404)
            return success_response(completed, message="Flight session marked as completed")
        except Exception as e:
            return handle_controller_error(e, "SessionController.complete")


# Singleton instance
session_controller = SessionController()
