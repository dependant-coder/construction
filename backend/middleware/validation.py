"""
Input validation helpers for request data.
"""

from functools import wraps
from flask import request, jsonify


def validate_json(*required_fields):
    """
    Decorator that validates the request has JSON body with required fields.
    Usage: @validate_json('name', 'date')
    """
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            data = request.get_json(silent=True)
            if data is None:
                return jsonify({
                    "success": False,
                    "error": {
                        "code": "VALIDATION_ERROR",
                        "message": "Request body must be valid JSON"
                    }
                }), 400

            missing = [field for field in required_fields if field not in data]
            if missing:
                return jsonify({
                    "success": False,
                    "error": {
                        "code": "VALIDATION_ERROR",
                        "message": f"Missing required fields: {', '.join(missing)}"
                    }
                }), 400

            return f(*args, **kwargs)
        return wrapper
    return decorator


def validate_query_params(*required_params):
    """
    Decorator that validates required query parameters are present.
    Usage: @validate_query_params('date')
    """
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            missing = [p for p in required_params if not request.args.get(p)]
            if missing:
                return jsonify({
                    "success": False,
                    "error": {
                        "code": "VALIDATION_ERROR",
                        "message": f"Missing required query parameters: {', '.join(missing)}"
                    }
                }), 400
            return f(*args, **kwargs)
        return wrapper
    return decorator
