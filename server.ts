import express from "express";
import path from "path";
import http from "http";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Proxy /api/v1 endpoints directly to Python Flask backend on port 5000
  app.use("/api/v1", (req, res) => {
    const targetUrl = `/api/v1${req.url}`;
    const options = {
      hostname: "127.0.0.1",
      port: 5000,
      path: targetUrl,
      method: req.method,
      headers: { ...req.headers, host: "127.0.0.1:5000" }
    };

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.on("error", (err) => {
      console.error("Proxy to Flask backend failed:", err.message);
      res.status(502).json({ success: false, error: "Flask backend unavailable" });
    });

    req.pipe(proxyReq, { end: true });
  });

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // 1. Projects API
  app.get("/api/project", (req, res) => {
    res.json({
      success: true,
      data: {
        id: 'pkg-04',
        name: 'Mumbai–Pune Expressway 8-Lane Expansion',
        section: 'Khandala - Lonavala Ghat Bypass Section',
        code: 'MPEE-PKG-04',
        overallProgress: 68.4,
        plannedProgress: 72.0,
        lengthKm: 20.0,
        contractor: 'L&T Infrastructure Engineering',
        status: 'On Track',
        packages: [
          { id: 'pkg-01', name: 'Mumbai–Pune Expressway (Package 01)', code: 'MPEE-PKG-01', overallProgress: 88.2, lengthKm: 24.5, contractor: 'IRB Infrastructure', status: 'On Track' },
          { id: 'pkg-02', name: 'Mumbai–Pune Expressway (Package 02)', code: 'MPEE-PKG-02', overallProgress: 74.0, lengthKm: 18.0, contractor: 'Afcons Infrastructure', status: 'On Track' },
          { id: 'pkg-03', name: 'Mumbai–Pune Expressway (Package 03)', code: 'MPEE-PKG-03', overallProgress: 91.5, lengthKm: 15.0, contractor: 'L&T Construction', status: 'On Track' },
          { id: 'pkg-04', name: 'Mumbai–Pune Expressway (Package 04 - Active)', code: 'MPEE-PKG-04', overallProgress: 68.4, lengthKm: 20.0, contractor: 'L&T Infrastructure Engineering', status: 'On Track' },
          { id: 'pkg-05', name: 'Mumbai–Pune Expressway (Package 05)', code: 'MPEE-PKG-05', overallProgress: 52.8, lengthKm: 12.2, contractor: 'HCC - Tata Projects JV', status: 'Delayed' }
        ]
      },
      timestamp: new Date().toISOString()
    });
  });

  // 2. Real-time KPIs API (with Inter-Flight Survey Delta)
  app.get("/api/kpis", (req, res) => {
    // TODO: when the Flask ML backend is ready, fetch KPI metrics for the given `date`. For now returns the same demo metrics regardless of date.
    const date = req.query.date ?? new Date().toISOString().slice(0, 10);
    res.json({
      success: true,
      date,
      data: {
        overallProgress: 68.4,
        progressDiffWeek: 4.2,
        flightChangePercent: 5.8,
        previousFlightCode: 'Flight #11 (15 Aug)',
        currentFlightCode: 'Flight #12 (22 Aug)',
        flightPavedDeltaKm: 1.16,
        flightEarthworkDeltaM3: 14800,
        peopleOnSite: 147,
        peopleDiffYesterday: 12,
        machinesActive: 23,
        totalMachines: 28,
        idleMachinesCount: 3,
        idleMachinesNote: '3 Rollers on Standby',
        criticalAlertsCount: 3,
        criticalAlertsSeverity: 'Medium',
        lastDroneSurveyTime: '11:38 AM',
        lastDroneSurveyDate: 'Today'
      },
      timestamp: new Date().toISOString()
    });
  });

  // 3. Drone Flights & Comparison API
  app.get("/api/drone-flights", (req, res) => {
    res.json({
      success: true,
      data: [
        {
          id: 'flt-12',
          flightNumber: 12,
          flightCode: 'Flight #12 (Current)',
          date: '22 Aug 2026',
          time: '10:45 AM - 11:38 AM',
          droneModel: 'DJI Matrice 350 RTK + Zenmuse P1 (35mm)',
          pilot: 'Capt. R. Deshmukh (DGCA License #4412)',
          areaKm: 20.0,
          corridorLengthKm: 20.0,
          altitudeMeters: 85,
          imagesCaptured: 1420,
          rtkFixPercent: 99.4,
          progressAchievedPercent: 68.4,
          pavedLengthKm: 13.68,
          earthworkVolumeM3: 342800,
          status: 'Completed'
        },
        {
          id: 'flt-11',
          flightNumber: 11,
          flightCode: 'Flight #11 (Previous)',
          date: '15 Aug 2026',
          time: '09:15 AM - 10:10 AM',
          droneModel: 'DJI Matrice 350 RTK + Zenmuse P1 (35mm)',
          pilot: 'Capt. R. Deshmukh (DGCA License #4412)',
          areaKm: 20.0,
          corridorLengthKm: 20.0,
          altitudeMeters: 85,
          imagesCaptured: 1380,
          rtkFixPercent: 98.8,
          progressAchievedPercent: 62.6,
          pavedLengthKm: 12.52,
          earthworkVolumeM3: 328000,
          status: 'Completed'
        },
        {
          id: 'flt-10',
          flightNumber: 10,
          flightCode: 'Flight #10',
          date: '08 Aug 2026',
          time: '09:30 AM - 10:20 AM',
          droneModel: 'DJI Matrice 300 RTK',
          pilot: 'Capt. S. Shinde',
          areaKm: 20.0,
          corridorLengthKm: 20.0,
          altitudeMeters: 90,
          imagesCaptured: 1310,
          rtkFixPercent: 98.1,
          progressAchievedPercent: 56.4,
          pavedLengthKm: 11.28,
          earthworkVolumeM3: 310500,
          status: 'Completed'
        }
      ],
      timestamp: new Date().toISOString()
    });
  });

  // Drone Flight Comparison Delta
  app.get("/api/drone-flights/comparison", (req, res) => {
    res.json({
      success: true,
      data: {
        previousFlight: {
          flightNumber: 11,
          flightCode: 'Flight #11',
          date: '15 Aug 2026',
          progressAchievedPercent: 62.6,
          pavedLengthKm: 12.52,
          earthworkVolumeM3: 328000,
          rtkFixPercent: 98.8
        },
        currentFlight: {
          flightNumber: 12,
          flightCode: 'Flight #12',
          date: '22 Aug 2026',
          progressAchievedPercent: 68.4,
          pavedLengthKm: 13.68,
          earthworkVolumeM3: 342800,
          rtkFixPercent: 99.4
        },
        percentageChange: 5.8, // +5.8%
        pavedLengthDeltaKm: 1.16, // +1.16 KM
        earthworkVolumeDeltaM3: 14800, // +14,800 m3
        qualityComplianceChange: 1.2, // +1.2%
        daysBetweenFlights: 7,
        notes: 'Significant physical progression in Segment 2 (KM 6 to 14). Dense Bituminous Macadam (DBM) layer laid across 1.16 KM corridor.'
      },
      timestamp: new Date().toISOString()
    });
  });

  // 4. Machinery & Telemetry API
  app.get("/api/telemetry/vehicles", (req, res) => {
    res.json({
      success: true,
      data: [
        { id: 'DR-01', name: 'DJI Matrice 350 RTK (Drone Alpha)', type: 'drone', lat: 18.5241, lng: 73.8567, status: 'active', speed: '38 km/h', operator: 'Capt. R. Deshmukh', battery: 84, altitude: 85 },
        { id: 'PV-01', name: 'Vögele Super 2100-3i Asphalt Paver #1', type: 'paver', lat: 18.5190, lng: 73.8520, status: 'active', speed: '4.2 m/min', operator: 'S. Patil' },
        { id: 'PV-02', name: 'Vögele Super 1800-3 Asphalt Paver #2', type: 'paver', lat: 18.5275, lng: 73.8610, status: 'active', speed: '3.8 m/min', operator: 'A. More' },
        { id: 'RL-01', name: 'Hamm HD+ 90i Tandem Roller #1', type: 'roller', lat: 18.5185, lng: 73.8515, status: 'active', speed: '6 km/h', operator: 'M. Shinde' },
        { id: 'RL-02', name: 'Hamm HD+ 90i Tandem Roller #2', type: 'roller', lat: 18.5280, lng: 73.8618, status: 'active', speed: '5.5 km/h', operator: 'R. Pawar' },
        { id: 'RL-03', name: 'Hamm HD+ 110i Vibratory Roller #3', type: 'roller', lat: 18.5340, lng: 73.8680, status: 'idle', speed: '0 km/h', operator: 'V. Jadhav' },
        { id: 'GR-01', name: 'CAT 140M Motor Grader #1', type: 'truck', lat: 18.5120, lng: 73.8440, status: 'active', speed: '12 km/h', operator: 'K. Kulkarni' },
        { id: 'DT-01', name: 'Tata Prima 2830.K Tipper Truck #1', type: 'truck', lat: 18.5210, lng: 73.8540, status: 'active', speed: '24 km/h', operator: 'D. Gaikwad' },
        { id: 'DT-02', name: 'Tata Prima 2830.K Tipper Truck #2', type: 'truck', lat: 18.5300, lng: 73.8635, status: 'transit', speed: '42 km/h', operator: 'N. Chavan' }
      ],
      timestamp: new Date().toISOString()
    });
  });

  // 8. Camera Feeds API (Cam 1 Drone 1 single camera, Cam 2, Cam 3, Cam 4)
  app.get("/api/cameras", (req, res) => {
    res.json({
      success: true,
      data: [
        { id: 'feed-cam-1', camCode: 'Cam 1', title: 'Cam 1 — Drone 1 Aerial Gimbal (Zenmuse P1 35mm)', shortTitle: 'Cam 1 (Drone 1)', sourceType: 'Drone 1 (Single Gimbal Camera)', location: 'KM 12+400 • Talegaon Corridor', coordinates: '18.5241° N, 73.8567° E' },
        { id: 'feed-cam-2', camCode: 'Cam 2', title: 'Cam 2 — Paver 01 Mast PTZ Camera (Paving Lane)', shortTitle: 'Cam 2 (Paver Mast)', sourceType: 'Paver 01 Mounted PTZ Sensor', location: 'KM 6+200 • Khopoli Section', coordinates: '18.5108° N, 73.8340° E' },
        { id: 'feed-cam-3', camCode: 'Cam 3', title: 'Cam 3 — Earthwork & Grader Mast Camera', shortTitle: 'Cam 3 (Grader Cam)', sourceType: 'Grader 01 Mast Sensor', location: 'KM 18+600 • Hill Section', coordinates: '18.5412° N, 73.8690° E' },
        { id: 'feed-cam-4', camCode: 'Cam 4', title: 'Cam 4 — High-Pole Site Surveillance CCTV', shortTitle: 'Cam 4 (Corridor CCTV)', sourceType: 'Highway Mast Surveillance Pole #04', location: 'KM 14+800 • Junction Interchange', coordinates: '18.5320° N, 73.8610° E' }
      ],
      timestamp: new Date().toISOString()
    });
  });

  // 9. PPE Compliance Audit API
  app.get("/api/ppe-compliance", (req, res) => {
    res.json({
      success: true,
      data: {
        overallCompliancePercent: 97.8,
        totalPersonnelAudited: 147,
        safeWorkDays: 420,
        zeroLtiRecord: true,
        breakdown: {
          helmets: { total: 147, compliant: 147, rate: 100.0 },
          highVisVests: { total: 147, compliant: 145, rate: 98.6 },
          safetyBoots: { total: 147, compliant: 147, rate: 100.0 },
          safetyGlasses: { total: 147, compliant: 142, rate: 96.6 },
          fallHarnesses: { total: 18, compliant: 18, rate: 100.0 },
          earDefenders: { total: 28, compliant: 28, rate: 100.0 }
        },
        recentObservations: [
          { time: '10:14 AM', sensor: 'Cam 1 (Drone 1 Aerial)', location: 'KM 12+400', detail: '2 workers unzipped vest adjusted', severity: 'Low', resolution: 'Corrected on spot' },
          { time: '09:30 AM', sensor: 'Cam 4 (Corridor CCTV)', location: 'KM 14+800', detail: 'Traffic cone displaced by dumper', severity: 'Advisory', resolution: 'Realigned by marshal' }
        ]
      },
      timestamp: new Date().toISOString()
    });
  });

  // 10. Map Snapshot API (Discreet, clean, no ITK labels)
  app.post("/api/snapshots", (req, res) => {
    const { title, coords, locationName, chainageKm, imageUrl } = req.body;
    const snapshot = {
      id: `snap-${Date.now()}`,
      title: title || 'Map Survey Snapshot',
      capturedAt: new Date().toISOString(),
      coords: coords || { lat: 18.5241, lng: 73.8567 },
      locationName: locationName || 'Expressway Corridor',
      chainageKm: chainageKm || 'KM 12+400',
      imageUrl: imageUrl || ''
    };
    res.status(201).json({
      success: true,
      data: snapshot,
      message: 'Map snapshot captured and saved to media gallery with GPS telemetry',
      timestamp: new Date().toISOString()
    });
  });

  // Vite middleware for development vs static files for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ConstruVision server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
