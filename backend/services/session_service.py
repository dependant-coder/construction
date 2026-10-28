"""
Flight session service — business logic for managing drone flight sessions.
Handles session creation, naming, lifecycle transitions, and validation.
"""

import uuid
import logging
from datetime import datetime
from repositories.session_repo import session_repo
from utils.time_utils import today_date_str, current_time_str, now_iso

logger = logging.getLogger(__name__)


class SessionService:
    """Business logic for flight sessions."""

    def __init__(self):
        self.repo = session_repo

    def list_sessions(self, date: str = None, status: str = None,
                      page: int = 1, limit: int = 20) -> tuple[list[dict], int]:
        """List sessions with optional filters and pagination."""
        return self.repo.find_all(date=date, status=status, page=page, limit=limit)

    def get_session(self, session_id: str) -> dict | None:
        """Get a single session by ID."""
        return self.repo.find_by_id(session_id)

    def get_active_session(self) -> dict | None:
        """Get the currently active session, if any."""
        return self.repo.find_active()

    def create_session(self, name: str = None, date: str = None,
                       start_time: str = None, notes: str = None,
                       camera_id: str = None) -> dict:
        """
        Create a new flight session.
        Auto-generates name if not provided (e.g. 'Flight #3 — 04 Sep 2026, 10:30 AM').
        Deactivates any currently active session first.
        """
        # Default date and time to now
        session_date = date or today_date_str()
        session_start = start_time or current_time_str()

        # Auto-generate name if not provided
        if not name:
            count = self.repo.count_today(session_date)
            flight_number = count + 1
            formatted_date = datetime.strptime(session_date, "%Y-%m-%d").strftime("%d %b %Y")
            try:
                formatted_time = datetime.strptime(session_start, "%H:%M:%S").strftime("%I:%M %p")
            except ValueError:
                formatted_time = session_start
            name = f"Flight #{flight_number} — {formatted_date}, {formatted_time}"

        # Deactivate any currently active session
        active = self.repo.find_active()
        if active:
            logger.info(f"Auto-completing previous active session: {active['id']}")
            self.repo.complete(active["id"])

        session_data = {
            "id": str(uuid.uuid4()),
            "name": name,
            "date": session_date,
            "start_time": session_start,
            "status": "active",
            "notes": notes,
            "camera_id": camera_id
        }

        created = self.repo.create(session_data)
        logger.info(f"Created new flight session: {created['id']} — {created['name']}")
        return created

    def update_session(self, session_id: str, updates: dict) -> dict | None:
        """Update a session's mutable fields (name, notes, camera_id)."""
        session = self.repo.find_by_id(session_id)
        if not session:
            return None

        # Only allow updating specific fields through this method
        safe_updates = {}
        for field in ["name", "notes", "camera_id"]:
            if field in updates:
                safe_updates[field] = updates[field]

        if not safe_updates:
            return session

        return self.repo.update(session_id, safe_updates)

    def complete_session(self, session_id: str) -> dict | None:
        """
        Mark a session as completed. Sets end_time to now.
        Only 'active' or 'created' sessions can be completed.
        """
        session = self.repo.find_by_id(session_id)
        if not session:
            return None

        if session["status"] == "completed":
            logger.warning(f"Session {session_id} is already completed")
            return session

        completed = self.repo.complete(session_id, end_time=current_time_str())
        logger.info(f"Completed session: {session_id}")
        return completed

    def increment_counter(self, session_id: str, counter: str, amount: int = 1):
        """Increment a session counter (total_detections, total_recordings, total_snapshots)."""
        session = self.repo.find_by_id(session_id)
        if session and counter in ("total_detections", "total_recordings", "total_snapshots"):
            current = session.get(counter, 0) or 0
            self.repo.update(session_id, {counter: current + amount})


# Singleton instance
session_service = SessionService()
