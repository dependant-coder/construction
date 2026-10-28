"""
Timestamp and date formatting utilities.
"""

from datetime import datetime, timezone


def now_iso() -> str:
    """Return current UTC time as ISO 8601 string."""
    return datetime.now(timezone.utc).isoformat()


def now_local_iso() -> str:
    """Return current local time as ISO 8601 string."""
    return datetime.now().isoformat()


def today_date_str() -> str:
    """Return today's date as YYYY-MM-DD string."""
    return datetime.now().strftime("%Y-%m-%d")


def current_time_str() -> str:
    """Return current time as HH:MM:SS string."""
    return datetime.now().strftime("%H:%M:%S")


def format_duration(seconds: float) -> str:
    """Format duration in seconds to human-readable string like '05:23'."""
    mins = int(seconds // 60)
    secs = int(seconds % 60)
    return f"{mins:02d}:{secs:02d}"
