# ConstruVision Flask Backend — Thermal Drone Inspection API

Production-ready Flask Python backend for real-time HDMI capture card video ingestion, YOLOv8/v11 AI object detection (personnel counting, PPE compliance, road progress), MP4 video recording, and SQLite persistent storage.

---

## Features

- **HDMI Capture Card Integration**: Captures 1080p @ 30 FPS video via OpenCV (`/dev/video0` or device 0) with low-latency 1-frame buffering and synthetic test pattern fallback.
- **MJPEG Live Streaming**: Raw feed (`/api/v1/stream/live`) and AI-annotated feed (`/api/v1/stream/annotated`) with bounding boxes and latency overlays.
- **YOLOv8 / YOLOv11 AI Pipeline**: Real-time personnel counting and PPE detection (helmet/vest compliance) with auto-logging of violation events.
- **Flight Sessions**: Organizes drone flights per day (`Flight #1`, `Flight #2`, etc.). Scopes all detections, recordings, snapshots, and KPIs to flight sessions.
- **Video Recording**: High-definition MP4 recording (`cv2.VideoWriter`) with start/stop/download lifecycle and disk management.
- **SQLite Storage**: 7 relational tables with WAL mode for high-throughput concurrent reading.
- **Layered Architecture**: Strict separation of concerns (Routes → Controllers → Services → Repositories → DB).

---

## Directory Structure

```
backend/
├── app.py                      # Flask app factory & CORS configuration
├── config.py                   # Unified configuration (env vars & defaults)
├── requirements.txt            # Python dependencies
├── run.py                      # Entry point script (python run.py)
├── construvision.db            # SQLite database file (auto-created)
├── routes/                     # Blueprint URL mapping (zero business logic)
│   ├── health_routes.py        # /api/v1/health
│   ├── session_routes.py       # /api/v1/sessions/*
│   ├── stream_routes.py        # /api/v1/stream/*
│   ├── recording_routes.py     # /api/v1/recordings/*
│   ├── detection_routes.py     # /api/v1/detections/* & /api/v1/ppe-observations/*
│   └── kpi_routes.py           # /api/v1/kpis/*
├── controllers/                # Request validation & base controller responses
│   ├── base_controller.py      # Standardized JSON response helpers
│   ├── health_controller.py
│   ├── session_controller.py
│   ├── stream_controller.py
│   ├── recording_controller.py
│   ├── detection_controller.py
│   └── kpi_controller.py
├── services/                   # Core business & AI processing logic
│   ├── video_service.py        # Background thread reading OpenCV capture frames
│   ├── inference_service.py    # YOLOv8/v11 object detection engine
│   ├── detection_service.py    # Bounding box rendering & PPE violation logger
│   ├── recording_service.py    # OpenCV VideoWriter MP4 background thread
│   ├── session_service.py      # Flight session auto-naming & lifecycle
│   └── kpi_service.py          # Session & daily KPI metric aggregator
├── repositories/               # Pure SQLite data access layer
│   ├── session_repo.py
│   ├── recording_repo.py
│   ├── detection_repo.py
│   └── kpi_repo.py
├── models/
│   ├── database.py             # SQLite connection pool & table setup
│   ├── schemas.py              # 7 SQL table schema definitions
│   └── weights/                # Place YOLOv8/v11 .pt model weight files here
├── recordings/                 # Saved MP4 video recording files
└── snapshots/                  # Saved JPEG frame snapshot files
```

---

## Setup & Quickstart

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment (Optional)

Settings can be customized via environment variables:

| Environment Variable | Default | Description |
|----------------------|---------|-------------|
| `FLASK_PORT` | `5000` | Server HTTP port |
| `CAPTURE_DEVICE_INDEX` | `0` | OpenCV VideoCapture index (0 = HDMI Capture Card) |
| `CAPTURE_WIDTH` | `1920` | Frame width |
| `CAPTURE_HEIGHT` | `1080` | Frame height |
| `CAPTURE_FPS` | `30` | Target frame rate |
| `PEOPLE_MODEL_PATH` | `models/weights/yolov8n.pt` | Path to YOLO model weights |

### 3. Add AI Model Weights (Optional)

Place your YOLO model weight files inside `backend/models/weights/`:
- `yolov8n.pt` or `yolov11n.pt` (Personnel counting)
- `ppe_model.pt` (Custom PPE helmet/vest model)

*If weight files are not present, the server runs a simulated detection engine so all APIs, UI streams, and database logging function out-of-the-box.*

### 4. Run Server

```bash
python run.py
```

Server will start on `http://localhost:5000`.

---

## Core API Specification

### 1. Flight Sessions
- `GET /api/v1/sessions` — List all flight sessions (filterable by `?date=YYYY-MM-DD`)
- `POST /api/v1/sessions` — Create a new flight session (auto-names e.g. `Flight #3 — 04 Sep 2026, 10:30 AM`)
- `GET /api/v1/sessions/active` — Get currently active flight session
- `POST /api/v1/sessions/:id/complete` — Mark flight session completed

### 2. Live Video Streams
- `GET /api/v1/stream/live` — Raw MJPEG live stream (1080p @ 30 FPS)
- `GET /api/v1/stream/annotated` — MJPEG live stream with real-time AI bounding box overlays
- `GET /api/v1/stream/status` — Capture card resolution, actual FPS, total frames

### 3. Video Recordings
- `POST /api/v1/recordings/start` — Start MP4 recording (scoped to active flight session)
- `POST /api/v1/recordings/stop` — Stop active recording, save metadata & file size
- `GET /api/v1/recordings` — List recorded videos
- `GET /api/v1/recordings/:id/download` — Download MP4 video file

### 4. AI Detections & PPE Compliance
- `GET /api/v1/detections/latest` — Latest AI detection result (people count, PPE count, latency)
- `POST /api/v1/detections/snapshot` — Capture & save annotated frame JPEG
- `GET /api/v1/ppe-observations` — List auto-logged PPE violation events
- `POST /api/v1/ppe-observations/:id/resolve` — Mark a PPE violation as resolved

### 5. Analytics & KPIs
- `GET /api/v1/kpis` — Session and daily aggregated KPIs (avg personnel count, compliance %, max count)
