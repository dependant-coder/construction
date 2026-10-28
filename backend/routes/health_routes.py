"""
Health routes — /api/v1/health endpoint.
"""

from flask import Blueprint
from controllers.health_controller import health_controller

health_bp = Blueprint("health", __name__, url_prefix="/api/v1/health")


@health_bp.route("", methods=["GET"])
def health_check():
    """GET /api/v1/health — Health check status."""
    return health_controller.check_health()
