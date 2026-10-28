"""
KPI service — computes aggregated KPIs for flight sessions and dates.
"""

import uuid
import logging
from models.database import get_db
from repositories.kpi_repo import kpi_repo
from repositories.session_repo import session_repo
from utils.time_utils import today_date_str

logger = logging.getLogger(__name__)


class KPIService:
    """Business logic for KPI calculations."""

    def __init__(self):
        self.repo = kpi_repo

    def compute_session_kpi(self, session_id: str) -> dict | None:
        """Compute aggregated KPI statistics for a given flight session."""
        session = session_repo.find_by_id(session_id)
        if not session:
            return None

        db = get_db()
        stats = db.execute(
            """SELECT 
                COUNT(*) as total_frames,
                COALESCE(AVG(people_count), 0.0) as avg_people,
                COALESCE(MAX(people_count), 0) as max_people,
                COALESCE(MIN(people_count), 0) as min_people,
                COALESCE(SUM(ppe_compliant), 0) as sum_compliant,
                COALESCE(SUM(ppe_violations), 0) as sum_violations,
                COALESCE(SUM(people_count), 0) as total_people_detected,
                COALESCE(AVG(inference_ms), 0.0) as avg_inf_ms
               FROM detections WHERE session_id = ?""",
            (session_id,)
        ).fetchone()

        total_people = stats["total_people_detected"]
        compliant = stats["sum_compliant"]
        compliance_pct = round((compliant / total_people * 100.0), 1) if total_people > 0 else 100.0

        kpi_data = {
            "id": str(uuid.uuid4()),
            "session_id": session_id,
            "date": session["date"],
            "avg_people_count": round(stats["avg_people"], 1),
            "max_people_count": stats["max_people"],
            "min_people_count": stats["min_people"],
            "ppe_compliance_pct": compliance_pct,
            "total_detections": stats["total_frames"],
            "total_violations": stats["sum_violations"],
            "total_frames": stats["total_frames"],
            "avg_inference_ms": round(stats["avg_inf_ms"], 2)
        }

        return self.repo.upsert_session_kpi(kpi_data)

    def get_kpis(self, session_id: str = None, date: str = None) -> dict:
        """Get KPIs for a specific session or aggregated daily stats for a date."""
        if session_id:
            # Recompute latest session KPI
            kpi = self.compute_session_kpi(session_id)
            return {"type": "session", "kpi": kpi}

        target_date = date or today_date_str()
        
        # Get active session if any
        active_session = session_repo.find_active()
        if active_session:
            self.compute_session_kpi(active_session["id"])

        daily_agg = self.repo.get_daily_aggregate(target_date)
        session_kpis = self.repo.find_by_date(target_date)

        return {
            "type": "daily_summary",
            "date": target_date,
            "aggregate": daily_agg,
            "sessions": session_kpis
        }


# Singleton instance
kpi_service = KPIService()
