"""
Detection controller — handles HTTP requests for AI detections, PPE observations, and snapshot captures.
"""

import os
import logging
from flask import request, send_file
from services.detection_service import detection_service
from controllers.base_controller import (
    success_response,
    created_response,
    paginated_response,
    error_response,
    handle_controller_error
)

logger = logging.getLogger(__name__)


from services.inference_service import inference_service


class DetectionController:
    """Controller for AI detections and PPE observations."""

    def __init__(self):
        self.service = detection_service

    def get_mode(self):
        """GET /api/v1/detections/mode — Get current AI inference mode status."""
        try:
            status = inference_service.get_mode_status()
            return success_response(status)
        except Exception as e:
            return handle_controller_error(e, "DetectionController.get_mode")

    def set_mode(self):
        """POST /api/v1/detections/mode — Toggle between Real ML and Mock ML mode."""
        try:
            data = request.get_json(force=True, silent=True) or {}
            use_simulated = data.get("use_simulated")
            if use_simulated is None:
                use_simulated = True
            else:
                use_simulated = bool(use_simulated)
            inference_service.set_use_simulated(use_simulated)
            status = inference_service.get_mode_status()
            return success_response(status, message=f"AI mode set to {'Mock / Simulated ML' if use_simulated else 'Real PyTorch YOLO ML'}")
        except Exception as e:
            return handle_controller_error(e, "DetectionController.set_mode")

    def get_latest(self):
        """GET /api/v1/detections/latest — Get latest detection result."""
        try:
            session_id = request.args.get("session_id")
            result = self.service.get_latest_detection(session_id=session_id)
            return success_response(result)
        except Exception as e:
            return handle_controller_error(e, "DetectionController.get_latest")

    def list_detections(self):
        """GET /api/v1/detections — List historical detections."""
        try:
            session_id = request.args.get("session_id")
            page = int(request.args.get("page", 1))
            limit = int(request.args.get("limit", 20))

            detections, total = self.service.list_detections(
                session_id=session_id, page=page, limit=limit
            )
            return paginated_response(detections, page=page, limit=limit, total=total)
        except Exception as e:
            return handle_controller_error(e, "DetectionController.list_detections")

    def capture_snapshot(self):
        """POST /api/v1/detections/snapshot — Capture snapshot frame now."""
        try:
            data = request.get_json(silent=True) or {}
            snapshot = self.service.capture_manual_snapshot(
                session_id=data.get("session_id"),
                notes=data.get("notes")
            )
            return created_response(snapshot, message="Snapshot captured successfully")
        except RuntimeError as e:
            return error_response(str(e), code="SERVICE_UNAVAILABLE", status_code=503)
        except Exception as e:
            return handle_controller_error(e, "DetectionController.capture_snapshot")

    def list_ppe_observations(self):
        """GET /api/v1/ppe-observations — List PPE violation observations."""
        try:
            session_id = request.args.get("session_id")
            resolved_param = request.args.get("resolved")
            resolved = None
            if resolved_param is not None:
                resolved = resolved_param.lower() in ("true", "1")

            page = int(request.args.get("page", 1))
            limit = int(request.args.get("limit", 20))

            obs, total = self.service.list_ppe_observations(
                session_id=session_id, resolved=resolved, page=page, limit=limit
            )
            return paginated_response(obs, page=page, limit=limit, total=total)
        except Exception as e:
            return handle_controller_error(e, "DetectionController.list_ppe_observations")

    def resolve_ppe_observation(self, obs_id: str):
        """POST /api/v1/ppe-observations/<obs_id>/resolve — Mark violation resolved."""
        try:
            data = request.get_json(silent=True) or {}
            resolved_by = data.get("resolved_by", "safety_officer")
            updated = self.service.resolve_ppe_observation(obs_id, resolved_by=resolved_by)
            if not updated:
                return error_response("PPE observation not found", code="NOT_FOUND", status_code=404)
            return success_response(updated, message="PPE observation marked as resolved")
        except Exception as e:
            return handle_controller_error(e, "DetectionController.resolve_ppe_observation")


# Singleton instance
detection_controller = DetectionController()
