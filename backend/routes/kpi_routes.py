"""
KPI routes — /api/v1/kpis endpoints.
"""

from flask import Blueprint
from controllers.kpi_controller import kpi_controller

kpi_bp = Blueprint("kpis", __name__, url_prefix="/api/v1/kpis")


@kpi_bp.route("", methods=["GET"], strict_slashes=False)
@kpi_bp.route("/", methods=["GET"], strict_slashes=False)
def get_kpis():
    """GET /api/v1/kpis — Get KPI analytics."""
    return kpi_controller.get_kpis()
