# Construction Command & Survey Dashboard — Project Overview

## Executive Summary

**Project Name:** Construction Command & Survey Dashboard  
**Type:** Real-time Highway Construction Monitoring & Survey Intelligence Platform  
**Target Domain:** Large-scale Linear Infrastructure (Expressways / Highways / Corridors)  
**Tech Stack:** React 19 + TypeScript + Vite 6 + Tailwind CSS 4 + Recharts + Leaflet/React-Leaflet + Express.js backend (Node) + Flask AI Backend (Python)  

---

## Purpose

This platform serves as a **centralized command center** for highway construction project stakeholders (Project Directors, Resident Engineers, NHAI Authority Engineers, Safety Officers, Remote Pilots) to monitor, analyze, and document every aspect of a 20 km access-controlled expressway corridor in real-time.

It bridges the gap between **field operations** (earthwork, paving, compaction, structures) and **digital intelligence** (UAV photogrammetry, AI-powered PPE compliance, machine telemetry, PPK geodetic survey) — delivering a single pane of glass for decision-making.

**Core Objectives:**
1. **Real-time Situational Awareness** — Live drone video, machinery telemetry, workforce tracking
2. **Progress Quantification** — Inter-flight photogrammetric delta analysis (Flight #12 vs #11 = +5.8% progress)
3. **Quality Assurance** — Field density tests, compaction compliance, IRI smoothness tracking
4. **Safety & EHS Compliance** — Automated CV-based PPE detection (97.8% compliance), safety observations
5. **Regulatory Documentation** — Auto-generated DPRs (Daily Progress Reports), Flight Dossiers, PPE Audit Reports in NHAI/MoRTH formats
6. **Historical Evidence Archive** — Geotagged orthomosaics, point clouds, thermal surveys, CCTV snapshots

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React 19 + Vite)                   │
├─────────────────────────────────────────────────────────────────┤
│  DashboardView   │  SiteIntelView  │  ProgressView  │ Evidence  │
│  ReportsView     │  AdminView      │  Modals        │  Charts   │
├─────────────────────────────────────────────────────────────────┤
│                    API SERVICE LAYER (TypeScript)               │
│  • REST endpoints for KPIs, Flights, Telemetry, Snapshots       │
│  • Flask AI Backend integration (streaming, recording, PPE)     │
├─────────────────────────────────────────────────────────────────┤
│  BACKEND SERVICES                                               │
│  ┌──────────────────┐    ┌──────────────────────────────────┐  │
│  │ Express.js API   │    │ Flask AI Backend (Python)        │  │
│  │ (Node/TS)        │    │ • YOLOv8/v11 PPE Detection       │  │
│  │ • Project CRUD   │    │ • HDMI Video Capture (30 FPS)    │  │
│  │ • KPI Aggregation│    │ • Video Recording (MP4)          │  │
│  │ • Snapshot Store │    │ • Annotated + Raw Stream Mux     │  │
│  │ • Flight Sessions│    │ • SQLite Persistence             │  │
│  └──────────────────┘    └──────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Navigation Sections (6 Primary Views)

| Section | Route | Purpose |
|---------|-------|---------|
| **Dashboard** | `/dashboard` | Executive KPI overview, S-curve charts, corridor linear strip, active alerts |
| **Site Intel** | `/site-intel` | Live drone video (AI-annotated/Raw/Demo), GIS map with vehicle telemetry, equipment utilization |
| **Progress** | `/progress` | Layer-by-layer pavement cross-section, quality telemetry (FDT %), segment breakdown cards |
| **Evidence** | `/evidence` | Before/after slider comparison, geotagged media gallery (orthomosaics, point clouds, DPRs) |
| **Reports** | `/reports` | Tabbed report generator: DPR, Flight Dossier, PPE Audit — export PDF/Excel/Print |
| **Admin** | `/admin` | Drone fleet status (battery, RTK accuracy, firmware), NFC gate readers, workforce scans |

---

## Detailed Feature Inventory

### 1. DASHBOARD VIEW — Executive Command Center

#### 1.1 Six Standardized KPI Metric Cards (Equal Height, Optical Alignment)
| KPI Card | Data Source | Key Metrics Displayed |
|----------|-------------|----------------------|
| **Physical Progress** | `INITIAL_KPI_DATA.overallProgress` | Current: 68.4% | Weekly Delta: +4.2% | Target: 72.0% | Status: On Schedule |
| **Paved Today** | `workCompletedTodayKm` / `workCompletedTodayMeters` | 0.48 KM / 480m linear asphalt | Active Layer: DBM 75mm |
| **Site Workforce** | `peopleOnSite` / `peopleDiffYesterday` | 147 persons (+12 from yesterday) | PPE Compliance: 97.8% |
| **Machinery Fleet** | `machinesActive` / `totalMachines` | 23/28 active | Idle Note: "3 Rollers on Standby" | CANbus Fleet: 88.8% Active |
| **Site Notices (Alerts)** | `criticalAlertsCount` / `criticalAlertsSeverity` | 3 Active (Medium priority) | Clickable → Alerts Modal |
| **Drone 1 Flight** | `lastDroneSurveyTime` / `lastDroneSurveyDate` | 11:38 AM (Today) | Flight #12 | PPK Fixed | GSD: 1.2cm |

#### 1.2 20-KM Corridor Linear Strip & Sector Quick Selector
- **5 Sectors** (4 km each): KM 0–4, 4–8, 8–12, 12–16, 16–20
- Color-coded by pavement layer type (Emerald=BC, Blue=DBM, Purple=Active Laydown, Amber=WMM, Orange=GSB/Hill Cut)
- Clickable sector cards → pan Leaflet map to sector, show detailed specs drawer
- Shows: Layer type, progress %, density achieved, temperature, status

#### 1.3 Multi-Tab Progress Chart (Recharts)
| Tab | Chart Type | Data |
|-----|------------|------|
| **S-Curve** | AreaChart (Planned vs Actual) | 8-week cumulative progress with reference line at 68.4% |
| **Daily Rate** | BarChart (Planned vs Actual Tons) | 7-day rolling with 1,200T/day target reference line |
| **Layers** | Horizontal BarChart (Vertical Layout) | 5 pavement layers: target vs actual KM, color-coded |

#### 1.4 Operational Site Alerts Card
- Top 2 alerts preview with severity badges (Critical/Warning/Low)
- Clickable "View all" → Alerts Modal
- "View captures from [date]" → Evidence View

---

### 2. SITE INTEL VIEW — Live Drone & GIS Intelligence

#### 2.1 High-Resolution Drone Camera Stream Card
**Three Stream Modes (Toggleable):**
| Mode | Source | Description |
|------|--------|-------------|
| **AI Annotated** | Flask `/api/v1/stream/annotated` | YOLOv8/v11 overlays: PPE detection boxes, machinery classification, personnel counting |
| **Raw HDMI** | Flask `/api/v1/stream/live` | Unprocessed 1080p 30FPS HDMI capture from drone gimbal |
| **Demo Image** | Static asset fallback | High-res aerial photo when backend unavailable |

**HUD Overlays (Always Visible):**
- Top Bar: Date/Time, LIVE/DEMO badge, Battery (84%)
- Bottom Bar: GPS coordinates (LAT/LON), Altitude (85m AGL), Speed (38 km/h), PPK 99.4% Fixed badge

**Camera Controls:**
- **Capture Snapshot** → Saves to backend (Flask `/api/v1/detections/snapshot`) + local toast notification
- **Record Video** → MP4 recording start/stop via Flask (`/api/v1/recordings/start|stop`) with duration counter

#### 2.2 Full-Width Interactive GIS Map (Leaflet + React-Leaflet)
**Base Layers (Switchable):**
- Satellite (Esri World Imagery) — Default
- Street (CARTO Voyager)
- Topo (OpenTopoMap)
- Dark (CARTO Dark)

**GIS Data Layers (Toggleable via Legend Drawer):**
| Layer | Description | Visual |
|-------|-------------|--------|
| **Pavement Layers** | 5 color-coded polylines (10px outer casing + 6px inner layer color) | Clickable → Sector Detail Drawer |
| **Right-of-Way (60m RoW)** | Dashed blue polygon buffer along corridor | Semi-transparent fill |
| **Chainage Milestones** | Markers every 2.5 KM with progress % | Popups: layer, progress, label |
| **Civil Structures** | 4 major structures: Viaduct, Toll Plaza, VUP, Hill Cut | Custom icons + detailed popups |
| **GCPs (Ground Control Points)** | 4 high-precision targets with RMSE H/V | Yellow target icons, verified status |
| **CORS Base Station** | SOI PUNE01 (4.2 km) — PPK corrections | Antenna icon, RTCM32 mount point |
| **Drone Flight Footprint** | 280m radius circle (80% overlap footprint) | Dashed blue circle |
| **Live Machinery & Vehicles** | 6 tracked assets (2 drones, 2 trucks, 1 paver, 1 roller) | Custom HTML icons with status badges, real-time jitter simulation |

**Map Interactions:**
- Click sector polyline → Sector Detail Drawer (specs, density, temp, progress, capture button)
- Click structure/GCP/CORS → Popup with engineering details
- Click vehicle → Vehicle Telemetry Popup (speed, operator, altitude/battery for drone, "Capture Vehicle Telemetry" button)
- Sector jump buttons (top bar) → FlyTo animation
- Reset Alignment button → Full 20 KM view at zoom 13
- Capture Map Snapshot → Geotagged save with chainage reference

#### 2.3 Equipment Fleet Utilization Chart
- Stacked BarChart: Operational Hours (green) vs Idle Hours (amber) per machine type
- 5 machine types: Asphalt Pavers, Tandem Rollers, Pneumatic Rollers, Motor Graders, Heavy Dumpers
- Summary cards: Active/Total deployed, Productivity Score %

---

### 3. PROGRESS VIEW — Pavement Engineering Deep-Dive

#### 3.1 Layer-by-Layer Progress Chart (Dedicated)
- Horizontal BarChart: Target KM (20.0 each) vs Actual KM for 5 layers
- Subgrade (97%), GSB (91%), WMM (80.5%), DBM (68%), BC (42%)
- Color-coded bars matching sector map colors
- Summary grid: actual/target KM, progress %, thickness (mm)

#### 3.2 Quality Telemetry: Field Density Test (FDT) Pass Rate
- LineChart: FDT % along chainage (KM 0–20)
- Reference line at 95% minimum spec (red dashed)
- 5 data points: Optimal (99.4%, 98.8%, 97.9%), Acceptable (94.2%), Warning (91.5%)
- Tooltips: Chainage, FDT %, Paving Temp (°C), IRI Smoothness (mm/km), Status badge

#### 3.3 Highway Section Breakdown Cards (3 Segments)
Each card displays:
- **Geotagged Map Thumbnail** (real construction photos)
- GPS Coordinates badge
- Range tag (e.g., "KM 0 to 8")
- Progress % (large)
- Current Activity description
- Workforce count, Active Machinery count, Quality Score %

---

### 4. EVIDENCE VIEW — Media Archive & Comparison

#### 4.1 Before/After Comparison Slider (KM 12+400)
- **Left (Before):** 15 Jul 2026 — Earthwork Base (highway_earthwork_base image)
- **Right (After):** 22 Aug 2026 — Paved Layer (road_construction_aerial image)
- Draggable vertical divider with ↔ handle
- Range input for precise control
- Date labels on each side

#### 4.2 Geotagged Survey Media Gallery (4 Items)
| Item | Type | Date | Area | Accuracy | Size |
|------|------|------|------|----------|------|
| High-Res Orthomosaic Corridor Survey | orthomosaic | 22 Aug 2026 | 20.0 KM | 1.2cm RTK | 4.8 GB |
| Earthwork Subgrade & Layer Grading | point-cloud | 21 Aug 2026 | 8.0 KM | High density | 2.1 GB |
| 24/7 CCTV Site Surveillance Archive | thermal | 20 Aug 2026 | 4.5 KM | CCTV HD 1080p | 680 MB |
| Corridor Asphalt Paving Drone Flyover | DPR | 19 Aug 2026 | 20.0 KM | 4K Ultra HD | 12.4 GB |

- Click to select (blue ring highlight)
- View button per item
- Download All button (1.2 GB placeholder)

---

### 5. REPORTS VIEW — Regulatory Documentation Generator

#### 5.1 Three Report Tabs (MoRTH / NHAI Standard Formats)

**Tab 1: Executive Daily Progress Report (DPR)**
- Official header: NHAI logo, project ref (DPR-2026-0822-FLT12), Authority Verified badge
- Project summary strip: Name, Chainage, Contractor, Cumulative Progress
- **Section 1: Key Statistics Overview** — 4 metric cards (Inter-Flight Delta +5.8%, Corridor Paved 13.68/20 KM, Workforce 147, Machinery 23/28)
- **Material & Compaction Statistics Table** — 6 rows (Earthwork, GSB, WMM, DBM, BC) with Scope/Executed/Gain/Status
- **Section 2: Segment-wise Physical Progress & Quality Matrix** — Table with 3 segments (Progress, Quality, Workforce, Machines)
- **Triple Signature Block:** Project Director (Contractor), Chief Resident Engineer (NHAI), Chief Remote Pilot (DGCA #4412)

**Tab 2: Flight Details & Geodetic Survey Dossier**
- UAV Platform & Camera Payload Specs (4 cards): Matrice 350 RTK, Zenmuse P1 35mm 45MP, GSD 1.2cm @ 85m AGL, Capt. R. Deshmukh DGCA #4412
- **Mission Telemetry & Photogrammetry** (3 cards):
  - Flight Window: 10:45–11:38 AM (53 min 8 sec)
  - Overlap: 80%/75%, 1,420 RAW images, TimeSync 2.0 (±1 ms)
  - PPK Solution: CORS PUNE01, 99.4% Fixed (12,405 epochs), RMSE H 11.4mm / V 14.1mm
- **Inter-Flight Delta Panel:** Flight #12 vs #11 = +5.8% progress, +1.16 KM DBM, +14,800 m³ hill cutting

**Tab 3: PPE Kit & EHS Safety Compliance Audit**
- Overall: 97.8% PPE Compliance, 420 Safe Work Days (Zero LTI)
- **6 PPE Category Cards:** Helmets 100%, Hi-Vis 98.6%, Boots 100%, Glasses 96.6%, Fall Harnesses 100% (18 viaduct), Ear Defenders 100% (28 paving)
- **AI PPE Detection Log Table:** 3 observations (unzipped vests, cone displacement, morning toolbox talk) with severity, resolution, timestamps
- **EHS Signatures:** Lead Safety Auditor + Authority Engineer

#### 5.2 Export Actions
- Print Report (browser print)
- Export CSV/Excel
- Export PDF Dossier (generates with toast confirmation)

---

### 6. ADMIN VIEW — Fleet & Infrastructure Management

#### 6.1 Drone Fleet Management (2 Drones)
| Drone | Model | Battery | Status | RTK Accuracy | Firmware | Location |
|-------|-------|---------|--------|--------------|----------|----------|
| DR-01 | Aerial Drone Alpha (RTK 4K) | 68% | In-Flight | 1.2 cm | v4.8.2 | 18.5241° N, 73.8567° E |
| DR-02 | Aerial Drone Beta (Docking) | 98% | Standby Dock #1 | 0.9 cm | v4.8.2 | 18.5385° N, 73.8420° E |

- Actions per drone: Run Diagnostic, Calibrate GPS

#### 6.2 Workforce Gate Readers (2 NFC Turnstiles)
| Gate | Name | Scans Today | Status |
|------|------|-------------|--------|
| GATE-01 | Main Camp Entrance Turnstile | 88 Workers | Online |
| GATE-02 | Plant Section Gate Reader | 59 Workers | Online |

---

### 7. INTERACTIVE MODALS (Global, Reusable)

| Modal | Trigger | Purpose |
|-------|---------|---------|
| **CompareDatesModal** | Dashboard "Compare Dates" button | Dual-date image slider + delta summary (+2.84 KM paved, +18,400 M³ earthwork) |
| **GenerateReportModal** | Dashboard "Generate Report" / Reports tab | Checklist config (Flight, PPE, Photogrammetry, Machinery, Quality) → PDF generation |
| **AlertsModal** | KPI Alert card / Alerts button | Full alert list with Resolve buttons, severity badges, location, time |
| **SegmentModal** | Click segment on Dashboard/Progress/Map | Detailed segment inspection (progress, quality, layers, activity, workforce, machinery) |
| **NewFlightSessionModal** | (Available) | Create new drone flight session via Flask backend |

---

### 8. DATA MODELS (TypeScript Types)

**Core Entities:**
- `ProjectPackage` — Project metadata (id, name, section, code, progress, contractor, status)
- `KpiData` — 28 fields including inter-flight deltas, workforce, fleet, alerts, drone survey, AI detections
- `OperationalAlert` — id, type (delay/idle/safety/quality), title, description, location, severity, timestamp
- `SegmentInfo` — 3 segments with layers, workforce, machinery, quality, GPS, map image
- `TelemetryVehicle` — 6 vehicles (2 drones, 2 trucks, 1 paver, 1 roller) with live position, status, operator
- `DroneFeedMetadata` — Camera specs, stream source, resolution, operator
- `EvidenceItem` — Gallery items with type, survey ID, area, accuracy, file size
- `DroneFlight` — Flight dossier: number, model, pilot, images, RTK fix %, progress, volumes
- `FlightComparisonDelta` — Previous vs Current flight quantitative comparison

---

### 9. BACKEND INTEGRATION (Flask AI Backend)

The frontend integrates with a **Flask Python backend** for AI/ML capabilities:

| Endpoint Category | Endpoints | Purpose |
|-------------------|-----------|---------|
| **Flight Sessions** | `POST /api/v1/sessions`, `GET /api/v1/sessions/active`, `POST /api/v1/sessions/{id}/complete` | Create/manage drone survey sessions |
| **Video Streaming** | `GET /api/v1/stream/live`, `GET /api/v1/stream/annotated`, `GET /api/v1/stream/status` | Raw HDMI + AI-annotated MJPEG streams |
| **Video Recording** | `POST /api/v1/recordings/start`, `POST /api/v1/recordings/stop`, `GET /api/v1/recordings` | MP4 recording control & listing |
| **AI Detections** | `GET/POST /api/v1/detections/mode`, `GET /api/v1/detections/latest`, `POST /api/v1/detections/snapshot` | YOLO PPE detection toggle, latest inference, snapshot capture |
| **PPE Observations** | `GET /api/v1/ppe-observations`, `POST /api/v1/ppe-observations/{id}/resolve` | Safety violation log with resolution workflow |
| **Flask KPIs** | `GET /api/v1/kpis` | Aggregated KPIs from AI backend (people count, PPE %, violations) |

**AI Capabilities:**
- YOLOv8/v11 real-time PPE detection (helmet, vest, boots, glasses, harness, ear defenders)
- Personnel counting & tracking
- Machinery classification (paver, roller, truck, grader)
- Annotated video stream overlay
- SQLite persistence for sessions, recordings, observations

---

### 10. UI/UX Design System

**Color Palette:**
- Primary: Blue (#2563eb) — Actions, links, active states
- Success: Emerald (#10b981) — Progress, compliance, good status
- Warning: Amber (#f59e0b) — Alerts, idle, on-track
- Critical: Rose (#ef4444) — Delays, warnings, low quality
- Info: Purple (#8b5cf6) — Drone, AI, flight data
- Neutral: Slate scale (50–950) — Backgrounds, text, borders

**Component Patterns:**
- Cards: `bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs`
- Buttons: Primary (blue), Secondary (slate), Ghost, Destructive
- Badges: Severity (rose/amber/blue/emerald), Status (emergent/active/idle)
- Tooltips: Custom dark theme (slate-900/95) with semantic colors
- Animations: `animate-in fade-in duration-200`, `zoom-in-95`, `slide-in-from-top`

**Responsive Breakpoints:**
- Mobile-first: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px)
- Sidebar: Collapsible (72px ↔ 260px) with main content margin transition

---

### 11. Mock Data & Realism

The project includes **comprehensive mock data** simulating a real Mumbai–Pune Expressway Package 04 project:
- **Project:** 20.0 KM, L&T + IRB JV, 68.4% complete, On Track
- **3 Segments** with realistic layer progressions
- **6 Live Vehicles** with telemetry (GPS, speed, operator, battery/altitude for drones)
- **4 Drone Camera Feeds** (Drone gimbal, Paver mast, Grader mast, CCTV pole)
- **8-Week S-Curve** with planned vs actual
- **7-Day Daily Paving** with tonnage & efficiency
- **5 Pavement Layers** with thickness specs
- **5 Machine Types** with operational/idle hours, fuel rate, productivity
- **5 Chainage Quality Points** with FDT, Temp, IRI, status
- **3 Active Alerts** (material delay, compactor standby, PPE check)
- **3 Historical Drone Flights** (#10, #11, #12) with full geodetic metadata
- **4 Evidence Items** (orthomosaic, point-cloud, thermal, DPR video)
- **Inter-Flight Delta** calculated: +5.8%, +1.16 KM, +14,800 m³

---

### 12. Development & Build

**Scripts:**
```json
"dev": "tsx server.ts"                    // Dev server with Express + Vite middleware
"build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs"
"start": "node dist/server.cjs"           // Production server
"lint": "tsc --noEmit"                    // Type checking
```

**Key Dependencies:**
- `react`, `react-dom` v19
- `leaflet`, `react-leaflet` — GIS mapping
- `recharts` — All charts (Area, Bar, Line, vertical layouts)
- `lucide-react` — Icon system
- `motion` — Animations (Framer Motion successor)
- `express` — Node API server
- `tailwindcss` v4 + `@tailwindcss/vite` — Styling
- `vite` v6 — Build tool

---

## Summary

The **Construction Command & Survey Dashboard** is a production-grade, full-stack monitoring platform purpose-built for **linear infrastructure construction**. It combines:

1. **Real-time GIS Intelligence** — Leaflet map with 9 toggleable engineering layers
2. **Live Drone Operations** — Triple-stream video (AI/Raw/Demo) + recording + snapshots
3. **Photogrammetric Progress Tracking** — Inter-flight orthomosaic delta analysis
4. **Pavement Engineering Analytics** — Layer-wise progress, FDT quality, IRI smoothness
5. **AI-Powered Safety** — YOLO PPE detection, automated observations, compliance reporting
6. **Regulatory Reporting** — NHAI/MoRTH format DPRs, Flight Dossiers, PPE Audits
7. **Fleet & Workforce Telemetry** — CANbus machinery, NFC gate readers, drone fleet management
8. **Evidence Archive** — Geotagged media with before/after comparison

All built with **modern React 19**, **strict TypeScript**, **Tailwind CSS 4**, and a **dual-backend architecture** (Node/Express for app API + Flask/Python for AI/ML video processing).