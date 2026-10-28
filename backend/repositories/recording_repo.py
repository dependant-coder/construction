"""
Recordings repository — SQLite CRUD operations for recordings table.
"""

import logging
from models.database import get_db
from utils.time_utils import now_iso

logger = logging.getLogger(__name__)


class RecordingRepository:
    """Data access layer for video recordings."""

    def find_all(self, session_id: str = None, page: int = 1, limit: int = 20) -> tuple[list[dict], int]:
        """Find recordings with optional session_id filter."""
        db = get_db()
        params = []
        where_clause = ""

        if session_id:
            where_clause = "WHERE session_id = ?"
            params.append(session_id)

        count_row = db.execute(
            f"SELECT COUNT(*) as count FROM recordings {where_clause}",
            params
        ).fetchone()
        total = count_row["count"]

        offset = (page - 1) * limit
        rows = db.execute(
            f"SELECT * FROM recordings {where_clause} ORDER BY created_at DESC LIMIT ? OFFSET ?",
            params + [limit, offset]
        ).fetchall()

        return rows, total

    def find_by_id(self, recording_id: str) -> dict | None:
        """Find recording by ID."""
        db = get_db()
        return db.execute(
            "SELECT * FROM recordings WHERE id = ?",
            (recording_id,)
        ).fetchone()

    def find_active_recording(self) -> dict | None:
        """Find currently active recording (status = 'recording')."""
        db = get_db()
        return db.execute(
            "SELECT * FROM recordings WHERE status = 'recording' ORDER BY created_at DESC LIMIT 1"
        ).fetchone()

    def create(self, data: dict) -> dict:
        """Create a new recording entry."""
        db = get_db()
        now = now_iso()
        db.execute(
            """INSERT INTO recordings 
               (id, session_id, camera_id, file_path, start_time, end_time,
                duration_sec, file_size_bytes, resolution, fps, status, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                data["id"],
                data["session_id"],
                data.get("camera_id"),
                data["file_path"],
                data["start_time"],
                data.get("end_time"),
                data.get("duration_sec", 0.0),
                data.get("file_size_bytes", 0),
                data.get("resolution", "1920x1080"),
                data.get("fps", 30),
                data.get("status", "recording"),
                now,
                now
            )
        )
        db.commit()
        return self.find_by_id(data["id"])

    def update(self, recording_id: str, updates: dict) -> dict | None:
        """Update a recording entry."""
        db = get_db()
        allowed = {"end_time", "duration_sec", "file_size_bytes", "status"}
        set_clauses = []
        params = []

        for field, val in updates.items():
            if field in allowed:
                set_clauses.append(f"{field} = ?")
                params.append(val)

        if not set_clauses:
            return self.find_by_id(recording_id)

        set_clauses.append("updated_at = ?")
        params.append(now_iso())
        params.append(recording_id)

        db.execute(
            f"UPDATE recordings SET {', '.join(set_clauses)} WHERE id = ?",
            params
        )
        db.commit()
        return self.find_by_id(recording_id)

    def delete(self, recording_id: str) -> bool:
        """Delete a recording entry."""
        db = get_db()
        cursor = db.execute("DELETE FROM recordings WHERE id = ?", (recording_id,))
        db.commit()
        return cursor.rowcount > 0


# Singleton instance
recording_repo = RecordingRepository()
