"""
Global error handler middleware.
Catches all unhandled exceptions and returns a consistent JSON error response.
"""

import logging
import traceback
from flask import jsonify

logger = logging.getLogger(__name__)


def register_error_handlers(app):
    """Register global error handlers on the Flask app."""

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            "success": False,
            "error": {
                "code": "BAD_REQUEST",
                "message": str(error.description) if hasattr(error, 'description') else "Bad request"
            }
        }), 400

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "success": False,
            "error": {
                "code": "NOT_FOUND",
                "message": "The requested resource was not found"
            }
        }), 404

    @app.errorhandler(409)
    def conflict(error):
        return jsonify({
            "success": False,
            "error": {
                "code": "CONFLICT",
                "message": str(error.description) if hasattr(error, 'description') else "Conflict"
            }
        }), 409

    @app.errorhandler(422)
    def validation_error(error):
        return jsonify({
            "success": False,
            "error": {
                "code": "VALIDATION_ERROR",
                "message": str(error.description) if hasattr(error, 'description') else "Validation failed"
            }
        }), 422

    @app.errorhandler(500)
    def internal_error(error):
        logger.error(f"Internal server error: {error}")
        logger.error(traceback.format_exc())
        return jsonify({
            "success": False,
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An internal server error occurred"
            }
        }), 500

    @app.errorhandler(Exception)
    def handle_unexpected_error(error):
        logger.error(f"Unhandled exception: {error}")
        logger.error(traceback.format_exc())
        return jsonify({
            "success": False,
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An unexpected error occurred"
            }
        }), 500
