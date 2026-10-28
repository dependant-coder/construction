"""
Backend server entry point.
Run with: python backend/run.py
"""

from config import config
from app import create_app

app = create_app()

if __name__ == "__main__":
    print("=" * 60)
    print(f"[START] ConstruVision Flask Backend running on http://{config.HOST}:{config.PORT}")
    print(f"        Health Check: http://localhost:{config.PORT}/api/v1/health")
    print(f"        Sessions API: http://localhost:{config.PORT}/api/v1/sessions")
    print("=" * 60)

    app.run(
        host=config.HOST,
        port=config.PORT,
        debug=config.DEBUG,
        use_reloader=False
    )
