"""
SQLite database connection and initialization.
Uses a thread-safe connection manager with busy_timeout to prevent 'database is locked' errors.
"""

import sqlite3
import threading
import logging
from config import config
from models.schemas import SCHEMA_SQL

logger = logging.getLogger(__name__)

_connection: sqlite3.Connection | None = None
_db_lock = threading.RLock()


def dict_factory(cursor: sqlite3.Cursor, row: tuple) -> dict:
    """Convert SQLite rows to dictionaries."""
    columns = [col[0] for col in cursor.description]
    return dict(zip(columns, row))


def get_db() -> sqlite3.Connection:
    """Get the SQLite database connection with busy timeout and thread safety."""
    global _connection
    if _connection is None:
        with _db_lock:
            if _connection is None:
                _connection = sqlite3.connect(
                    config.DATABASE_PATH,
                    timeout=30.0,  # Wait up to 30s if DB is busy instead of throwing locking error
                    check_same_thread=False
                )
                _connection.row_factory = dict_factory
                _connection.execute("PRAGMA journal_mode=WAL")
                _connection.execute("PRAGMA busy_timeout = 30000")
                _connection.execute("PRAGMA foreign_keys=ON")
                logger.info(f"SQLite database connected: {config.DATABASE_PATH}")
    return _connection


def init_db():
    """Initialize database tables from schema definitions."""
    with _db_lock:
        db = get_db()
        db.executescript(SCHEMA_SQL)
        db.commit()
        logger.info("Database tables initialized successfully")


def close_db():
    """Close the database connection."""
    global _connection
    with _db_lock:
        if _connection is not None:
            _connection.close()
            _connection = None
            logger.info("Database connection closed")
