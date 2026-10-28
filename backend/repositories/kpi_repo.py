"""
KPI repository — SQLite CRUD operations for session_kpis table.
"""

import logging
from models.database import get_db
from utils.time_utils import now_iso

logger = logging.getLogger(__name__)


class KPIRepository:
    """Data access layer for session KPI metrics."""

    def upsert_session_kpi(self, data: dict) -> dict:
        """Insert or update aggregated KPIs for a flight session."""
        db = get_db()
        now = now_iso()
        db.execute(
            """INSERT INTO session_kpis 
               (id, session_id, date, avg_people_count, max_people_count, min_people_count,
                ppe_compliance_pct, total_detections, total_violations, total_frames, avg_inference_ms, computed_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
               ON CONFLICT(session_id) DO UPDATE SET
                avg_people_count = excluded.avg_people_count,
                max_people_count = excluded.max_people_count,
                min_people_count = excluded.min_people_count,
                ppe_compliance_pct = excluded.ppe_compliance_pct,
                total_detections = excluded.total_detections,
                total_violations = excluded.total_violations,
                total_frames = excluded.total_frames,
                avg_inference_ms = excluded.avg_inference_ms,
                computed_at = excluded.computed_at""",
            (
                data["id"],
                data["session_id"],
                data["date"],
                data.get("avg_people_count", 0.0),
                data.get("max_people_count", 0),
                data.get("min_people_count", 0),
                data.get("ppe_compliance_pct", 0.0),
                data.get("total_detections", 0),
                data.get("total_violations", 0),
                data.get("total_frames", 0),
                data.get("avg_inference_ms", 0.0),
                now
            )
        )
        db.commit()
        return self.find_by_session_id(data["session_id"])

    def find_by_session_id(self, session_id: str) -> dict | None:
        db = get_db()
        return db.execute("SELECT * FROM session_kpis WHERE session_id = ?", (session_id,)).fetchone()

    def find_by_date(self, date: str) -> list[dict]:
        db = get_db()
        return db.execute("SELECT * FROM session_kpis WHERE date = ?", (date,)).fetchall()

    def get_daily_aggregate(self, date: str) -> dict:
        """Calculate overall aggregated metrics across all flight sessions for a given date."""
        db = get_db()
        row = db.execute(
            """SELECT 
                COUNT(DISTINCT session_id) as total_sessions,
                COALESCE(AVG(avg_people_count), 0.0) as avg_people_count,
                COALESCE(MAX(max_people_count), 0) as max_people_count,
                COALESCE(AVG(ppe_compliance_pct), 0.0) as avg_ppe_compliance_pct,
                COALESCE(SUM(total_detections), 0) as total_detections,
                COALESCE(SUM(total_violations), 0) as total_violations
               FROM session_kpis WHERE date = ?""",
            (date,)
        ).fetchone()
        return row or {}


# Singleton instance
kpi_repo = KPIRepository()
