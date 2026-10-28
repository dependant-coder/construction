"""
Detection repository — SQLite CRUD operations for detections, snapshots, and PPE observations.
"""

import json
import logging
from models.database import get_db
from utils.time_utils import now_iso

logger = logging.getLogger(__name__)


class DetectionRepository:
    """Data access layer for AI detections, snapshots, and PPE observations."""

    # --- Detections ---
    def save_detection(self, data: dict) -> dict:
        """Insert a frame detection record into SQLite."""
        db = get_db()
        now = now_iso()
        bbox_json = json.dumps(data.get("bbox_data", []))

        db.execute(
            """INSERT INTO detections 
               (id, session_id, camera_id, timestamp, people_count, ppe_compliant,
                ppe_violations, bbox_data, confidence_avg, inference_ms, frame_number, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                data["id"],
                data["session_id"],
                data.get("camera_id"),
                data.get("timestamp", now),
                data.get("people_count", 0),
                data.get("ppe_compliant", 0),
                data.get("ppe_violations", 0),
                bbox_json,
                data.get("confidence_avg", 0.0),
                data.get("inference_ms", 0.0),
                data.get("frame_number", 0),
                now
            )
        )
        db.commit()
        return self.find_detection_by_id(data["id"])

    def find_detection_by_id(self, detection_id: str) -> dict | None:
        """Find detection record by ID."""
        db = get_db()
        row = db.execute("SELECT * FROM detections WHERE id = ?", (detection_id,)).fetchone()
        if row and row.get("bbox_data"):
            try:
                row["bbox_data"] = json.loads(row["bbox_data"])
            except Exception:
                pass
        return row

    def find_latest_by_session(self, session_id: str) -> dict | None:
        """Get the latest detection result for a given flight session."""
        db = get_db()
        row = db.execute(
            "SELECT * FROM detections WHERE session_id = ? ORDER BY created_at DESC LIMIT 1",
            (session_id,)
        ).fetchone()
        if row and row.get("bbox_data"):
            try:
                row["bbox_data"] = json.loads(row["bbox_data"])
            except Exception:
                pass
        return row

    def find_all_detections(self, session_id: str = None, page: int = 1, limit: int = 20) -> tuple[list[dict], int]:
        """List detections with optional session filter."""
        db = get_db()
        params = []
        where_clause = ""

        if session_id:
            where_clause = "WHERE session_id = ?"
            params.append(session_id)

        count_row = db.execute(
            f"SELECT COUNT(*) as count FROM detections {where_clause}",
            params
        ).fetchone()
        total = count_row["count"]

        offset = (page - 1) * limit
        rows = db.execute(
            f"SELECT * FROM detections {where_clause} ORDER BY created_at DESC LIMIT ? OFFSET ?",
            params + [limit, offset]
        ).fetchall()

        for r in rows:
            if r.get("bbox_data"):
                try:
                    r["bbox_data"] = json.loads(r["bbox_data"])
                except Exception:
                    pass

        return rows, total

    # --- PPE Observations ---
    def save_ppe_observation(self, data: dict) -> dict:
        """Insert a PPE violation event."""
        db = get_db()
        now = now_iso()
        db.execute(
            """INSERT INTO ppe_observations 
               (id, session_id, detection_id, violation_type, severity, location_note,
                snapshot_path, resolved, timestamp, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?)""",
            (
                data["id"],
                data["session_id"],
                data.get("detection_id"),
                data["violation_type"],
                data.get("severity", "medium"),
                data.get("location_note"),
                data.get("snapshot_path"),
                data.get("timestamp", now),
                now
            )
        )
        db.commit()
        return self.find_ppe_observation_by_id(data["id"])

    def find_ppe_observation_by_id(self, obs_id: str) -> dict | None:
        db = get_db()
        return db.execute("SELECT * FROM ppe_observations WHERE id = ?", (obs_id,)).fetchone()

    def find_all_ppe_observations(self, session_id: str = None, resolved: bool = None, page: int = 1, limit: int = 20) -> tuple[list[dict], int]:
        """List PPE observations."""
        db = get_db()
        conditions = []
        params = []

        if session_id:
            conditions.append("session_id = ?")
            params.append(session_id)
        if resolved is not None:
            conditions.append("resolved = ?")
            params.append(1 if resolved else 0)

        where_clause = f"WHERE {' AND '.join(conditions)}" if conditions else ""

        count_row = db.execute(
            f"SELECT COUNT(*) as count FROM ppe_observations {where_clause}",
            params
        ).fetchone()
        total = count_row["count"]

        offset = (page - 1) * limit
        rows = db.execute(
            f"SELECT * FROM ppe_observations {where_clause} ORDER BY created_at DESC LIMIT ? OFFSET ?",
            params + [limit, offset]
        ).fetchall()

        return rows, total

    def resolve_ppe_observation(self, obs_id: str, resolved_by: str = "safety_officer") -> dict | None:
        """Mark a PPE observation event as resolved."""
        db = get_db()
        now = now_iso()
        db.execute(
            "UPDATE ppe_observations SET resolved = 1, resolved_at = ?, resolved_by = ? WHERE id = ?",
            (now, resolved_by, obs_id)
        )
        db.commit()
        return self.find_ppe_observation_by_id(obs_id)

    # --- Snapshots ---
    def save_snapshot(self, data: dict) -> dict:
        """Insert a snapshot record."""
        db = get_db()
        now = now_iso()
        db.execute(
            """INSERT INTO detection_snapshots 
               (id, session_id, detection_id, file_path, file_size_bytes, timestamp, notes, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                data["id"],
                data["session_id"],
                data.get("detection_id"),
                data["file_path"],
                data.get("file_size_bytes", 0),
                data.get("timestamp", now),
                data.get("notes"),
                now
            )
        )
        db.commit()
        return db.execute("SELECT * FROM detection_snapshots WHERE id = ?", (data["id"],)).fetchone()


# Singleton instance
detection_repo = DetectionRepository()
