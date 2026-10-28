"""
SQLite database schema definitions.
All CREATE TABLE statements live here for single-source-of-truth.
"""

SCHEMA_SQL = """
-- Registered video sources (HDMI capture cards, USB cameras, IP cameras)
CREATE TABLE IF NOT EXISTS cameras (
    id              TEXT PRIMARY KEY,
    device_index    INTEGER NOT NULL DEFAULT 0,
    name            TEXT NOT NULL,
    short_name      TEXT,
    source_type     TEXT NOT NULL DEFAULT 'hdmi_capture',
    location        TEXT,
    coordinates     TEXT,
    resolution_w    INTEGER DEFAULT 1920,
    resolution_h    INTEGER DEFAULT 1080,
    fps             INTEGER DEFAULT 30,
    status          TEXT NOT NULL DEFAULT 'offline',
    created_at      TEXT NOT NULL,
    updated_at      TEXT NOT NULL
);

-- Flight sessions — the core organizing unit
-- Each drone flight creates one session; all data is scoped to a session
CREATE TABLE IF NOT EXISTS flight_sessions (
    id              TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    date            TEXT NOT NULL,
    start_time      TEXT NOT NULL,
    end_time        TEXT,
    status          TEXT NOT NULL DEFAULT 'created',
    notes           TEXT,
    camera_id       TEXT,
    total_detections    INTEGER DEFAULT 0,
    total_recordings    INTEGER DEFAULT 0,
    total_snapshots     INTEGER DEFAULT 0,
    created_at      TEXT NOT NULL,
    updated_at      TEXT NOT NULL,
    FOREIGN KEY (camera_id) REFERENCES cameras(id)
);

-- Per-frame AI detection results
CREATE TABLE IF NOT EXISTS detections (
    id              TEXT PRIMARY KEY,
    session_id      TEXT NOT NULL,
    camera_id       TEXT,
    timestamp       TEXT NOT NULL,
    people_count    INTEGER DEFAULT 0,
    ppe_compliant   INTEGER DEFAULT 0,
    ppe_violations  INTEGER DEFAULT 0,
    bbox_data       TEXT,
    confidence_avg  REAL DEFAULT 0.0,
    inference_ms    REAL DEFAULT 0.0,
    frame_number    INTEGER DEFAULT 0,
    created_at      TEXT NOT NULL,
    FOREIGN KEY (session_id) REFERENCES flight_sessions(id),
    FOREIGN KEY (camera_id) REFERENCES cameras(id)
);

-- Saved annotated frame snapshots
CREATE TABLE IF NOT EXISTS detection_snapshots (
    id              TEXT PRIMARY KEY,
    session_id      TEXT NOT NULL,
    detection_id    TEXT,
    file_path       TEXT NOT NULL,
    file_size_bytes INTEGER DEFAULT 0,
    timestamp       TEXT NOT NULL,
    notes           TEXT,
    created_at      TEXT NOT NULL,
    FOREIGN KEY (session_id) REFERENCES flight_sessions(id),
    FOREIGN KEY (detection_id) REFERENCES detections(id)
);

-- Video recording sessions
CREATE TABLE IF NOT EXISTS recordings (
    id              TEXT PRIMARY KEY,
    session_id      TEXT NOT NULL,
    camera_id       TEXT,
    file_path       TEXT NOT NULL,
    start_time      TEXT NOT NULL,
    end_time        TEXT,
    duration_sec    REAL DEFAULT 0.0,
    file_size_bytes INTEGER DEFAULT 0,
    resolution      TEXT,
    fps             INTEGER DEFAULT 30,
    status          TEXT NOT NULL DEFAULT 'recording',
    created_at      TEXT NOT NULL,
    updated_at      TEXT NOT NULL,
    FOREIGN KEY (session_id) REFERENCES flight_sessions(id),
    FOREIGN KEY (camera_id) REFERENCES cameras(id)
);

-- Individual PPE violation events
CREATE TABLE IF NOT EXISTS ppe_observations (
    id              TEXT PRIMARY KEY,
    session_id      TEXT NOT NULL,
    detection_id    TEXT,
    violation_type  TEXT NOT NULL,
    severity        TEXT NOT NULL DEFAULT 'low',
    location_note   TEXT,
    snapshot_path   TEXT,
    resolved        INTEGER DEFAULT 0,
    resolved_at     TEXT,
    resolved_by     TEXT,
    timestamp       TEXT NOT NULL,
    created_at      TEXT NOT NULL,
    FOREIGN KEY (session_id) REFERENCES flight_sessions(id),
    FOREIGN KEY (detection_id) REFERENCES detections(id)
);

-- Per-session aggregated KPIs (computed periodically or on session completion)
CREATE TABLE IF NOT EXISTS session_kpis (
    id              TEXT PRIMARY KEY,
    session_id      TEXT NOT NULL UNIQUE,
    date            TEXT NOT NULL,
    avg_people_count    REAL DEFAULT 0.0,
    max_people_count    INTEGER DEFAULT 0,
    min_people_count    INTEGER DEFAULT 0,
    ppe_compliance_pct  REAL DEFAULT 0.0,
    total_detections    INTEGER DEFAULT 0,
    total_violations    INTEGER DEFAULT 0,
    total_frames        INTEGER DEFAULT 0,
    avg_inference_ms    REAL DEFAULT 0.0,
    computed_at     TEXT NOT NULL,
    FOREIGN KEY (session_id) REFERENCES flight_sessions(id)
);

-- Create indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_flight_sessions_date ON flight_sessions(date);
CREATE INDEX IF NOT EXISTS idx_flight_sessions_status ON flight_sessions(status);
CREATE INDEX IF NOT EXISTS idx_detections_session ON detections(session_id);
CREATE INDEX IF NOT EXISTS idx_detections_timestamp ON detections(timestamp);
CREATE INDEX IF NOT EXISTS idx_recordings_session ON recordings(session_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_session ON detection_snapshots(session_id);
CREATE INDEX IF NOT EXISTS idx_ppe_session ON ppe_observations(session_id);
CREATE INDEX IF NOT EXISTS idx_kpis_date ON session_kpis(date);
"""
