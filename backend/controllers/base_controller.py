"""
Base controller with standardized response helpers.
All controllers should use these methods for consistent API responses.
"""

import logging
from flask import jsonify
from utils.time_utils import now_iso

logger = logging.getLogger(__name__)


def success_response(data, status_code=200, message=None):
    """Return a standardized success JSON response."""
    response = {
        "success": True,
        "data": data,
        "timestamp": now_iso()
    }
    if message:
        response["message"] = message
    return jsonify(response), status_code


def created_response(data, message=None):
    """Return a 201 Created response."""
    return success_response(data, status_code=201, message=message)


def paginated_response(data, page, limit, total):
    """Return a paginated list response."""
    return jsonify({
        "success": True,
        "data": data,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "totalPages": max(1, -(-total // limit))  # Ceiling division
        },
        "timestamp": now_iso()
    }), 200


def error_response(message, code="ERROR", status_code=400, details=None):
    """Return a standardized error JSON response."""
    response = {
        "success": False,
        "error": {
            "code": code,
            "message": message
        }
    }
    if details:
        response["error"]["details"] = details
    return jsonify(response), status_code


def handle_controller_error(error, operation_name):
    """Log and return a standardized error for unexpected exceptions in controllers."""
    logger.error(f"Error in {operation_name}: {error}", exc_info=True)
    return error_response(
        message="An internal error occurred",
        code="INTERNAL_ERROR",
        status_code=500
    )
