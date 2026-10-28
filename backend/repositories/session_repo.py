"""
Flight sessions repository — SQLite CRUD operations for flight_sessions table.
This is the ONLY place that touches the flight_sessions table directly.
"""

import logging
from models.database import get_db
from utils.time_utils import now_iso

logger = logging.getLogger(__name__)


class SessionRepository:
    """Data access layer for flight sessions."""

    def find_all(self, date: str = None, status: str = None, page: int = 1, limit: int = 20) -> tuple[list[dict], int]:
        """
        Find all sessions, optionally filtered by date and/or status.
        Returns (rows, total_count).
        """
        db = get_db()
        conditions = []
        params = []

        if date:
            conditions.append("date = ?")
            params.append(date)
        if status:
            conditions.append("status = ?")
            params.append(status)

        where_clause = f"WHERE {' AND '.join(conditions)}" if conditions else ""

        # Get total count
        count_row = db.execute(
            f"SELECT COUNT(*) as count FROM flight_sessions {where_clause}",
            params
        ).fetchone()
        total = count_row["count"]

        # Get paginated results
        offset = (page - 1) * limit
        rows = db.execute(
            f"SELECT * FROM flight_sessions {where_clause} ORDER BY created_at DESC LIMIT ? OFFSET ?",
            params + [limit, offset]
        ).fetchall()

        return rows, total

    def find_by_id(self, session_id: str) -> dict | None:
        """Find a session by its ID."""
        db = get_db()
        return db.execute(
            "SELECT * FROM flight_sessions WHERE id = ?",
            (session_id,)
        ).fetchone()

    def find_active(self) -> dict | None:
        """Find the currently active session (status = 'active')."""
        db = get_db()
        return db.execute(
            "SELECT * FROM flight_sessions WHERE status = 'active' ORDER BY created_at DESC LIMIT 1"
        ).fetchone()

    def create(self, session_data: dict) -> dict:
        """Insert a new flight session and return it."""
        db = get_db()
        now = now_iso()
        db.execute(
            """INSERT INTO flight_sessions 
               (id, name, date, start_time, end_time, status, notes, camera_id,
                total_detections, total_recordings, total_snapshots, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, ?, ?)""",
            (
                session_data["id"],
                session_data["name"],
                session_data["date"],
                session_data["start_time"],
                session_data.get("end_time"),
                session_data.get("status", "created"),
                session_data.get("notes"),
                session_data.get("camera_id"),
                now,
                now
            )
        )
        db.commit()
        return self.find_by_id(session_data["id"])

    def update(self, session_id: str, updates: dict) -> dict | None:
        """Update a session with the given fields. Only updates provided fields."""
        db = get_db()

        allowed_fields = {"name", "status", "notes", "end_time", "camera_id",
                          "total_detections", "total_recordings", "total_snapshots"}
        set_clauses = []
        params = []

        for field, value in updates.items():
            if field in allowed_fields:
                set_clauses.append(f"{field} = ?")
                params.append(value)

        if not set_clauses:
            return self.find_by_id(session_id)

        set_clauses.append("updated_at = ?")
        params.append(now_iso())
        params.append(session_id)

        db.execute(
            f"UPDATE flight_sessions SET {', '.join(set_clauses)} WHERE id = ?",
            params
        )
        db.commit()
        return self.find_by_id(session_id)

    def complete(self, session_id: str, end_time: str = None) -> dict | None:
        """Mark a session as completed with an end time."""
        return self.update(session_id, {
            "status": "completed",
            "end_time": end_time or now_iso()
        })

    def count_today(self, date: str) -> int:
        """Count how many sessions exist for a given date (for auto-naming)."""
        db = get_db()
        row = db.execute(
            "SELECT COUNT(*) as count FROM flight_sessions WHERE date = ?",
            (date,)
        ).fetchone()
        return row["count"]

    def delete(self, session_id: str) -> bool:
        """Delete a session by ID. Returns True if a row was deleted."""
        db = get_db()
        cursor = db.execute(
            "DELETE FROM flight_sessions WHERE id = ?",
            (session_id,)
        )
        db.commit()
        return cursor.rowcount > 0


# Singleton instance
session_repo = SessionRepository()
