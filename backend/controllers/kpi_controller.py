"""
KPI controller — handles HTTP requests for session and daily analytics.
"""

import logging
from flask import request
from services.kpi_service import kpi_service
from controllers.base_controller import success_response, handle_controller_error

logger = logging.getLogger(__name__)


class KPIController:
    """Controller for KPI analytics endpoints."""

    def __init__(self):
        self.service = kpi_service

    def get_kpis(self):
        """GET /api/v1/kpis — Get KPIs filtered by session_id or date."""
        try:
            session_id = request.args.get("session_id")
            date = request.args.get("date")

            result = self.service.get_kpis(session_id=session_id, date=date)
            return success_response(result)
        except Exception as e:
            return handle_controller_error(e, "KPIController.get_kpis")


# Singleton instance
kpi_controller = KPIController()
