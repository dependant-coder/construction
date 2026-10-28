"""
Flask application factory.
Configures CORS, registers blueprints, initializes database, and attaches error handlers.
"""

import logging
from flask import Flask
from flask_cors import CORS

from config import config
from models.database import init_db
from middleware.error_handler import register_error_handlers
from routes.health_routes import health_bp
from routes.session_routes import session_bp
from routes.stream_routes import stream_bp
from routes.recording_routes import recording_bp
from routes.detection_routes import detection_bp, ppe_bp
from routes.kpi_routes import kpi_bp
from services.video_service import video_service
from services.detection_service import detection_service

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)


def create_app() -> Flask:
    """Create and configure the Flask application instance."""
    app = Flask(__name__)

    # Load configuration
    app.config["SECRET_KEY"] = config.SECRET_KEY
    app.config["JSON_SORT_KEYS"] = False

    # Ensure output directories exist
    config.ensure_directories()

    # Initialize SQLite database
    init_db()

    # Start video capture & AI detection background threads
    video_service.start()
    detection_service.start()

    # Configure CORS for React frontend
    CORS(app, resources={r"/api/*": {"origins": config.CORS_ORIGINS}})

    # Register blueprints (routes)
    app.register_blueprint(health_bp)
    app.register_blueprint(session_bp)
    app.register_blueprint(stream_bp)
    app.register_blueprint(recording_bp)
    app.register_blueprint(detection_bp)
    app.register_blueprint(ppe_bp)
    app.register_blueprint(kpi_bp)

    # Register global error handlers
    register_error_handlers(app)

    logger.info("Flask application initialized successfully")
    return app
