import { 
  DroneFlight, 
  FlightComparisonDelta, 
  SnapshotPayload 
} from '../types/api';
import { 
  CURRENT_PROJECT, 
  INITIAL_KPI_DATA, 
  DRONE_FLIGHTS_DATA, 
  FLIGHT_COMPARISON_DELTA, 
  TELEMETRY_VEHICLES
} from '../data/mockData';
import { ProjectPackage, KpiData, TelemetryVehicle } from '../types';

/**
 * Standard API Client with typed contracts and graceful fallback
 */
export const ApiService = {
  // Project Info
  async getProject(): Promise<ProjectPackage> {
    try {
      const res = await fetch('/api/project');
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Fallback
    }
    return CURRENT_PROJECT;
  },

  // Real-time KPIs with Inter-Flight Survey Delta
  async getKpis(date?: string): Promise<KpiData> {
    try {
      const url = date ? `/api/v1/kpis?date=${encodeURIComponent(date)}` : '/api/v1/kpis';
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        const bData = json.data || {};
        const agg = bData.aggregate || bData;
        const activePeople = Math.round(agg.avg_people_count ?? INITIAL_KPI_DATA.activePersonnelOnSite);
        return {
          ...INITIAL_KPI_DATA,
          peopleOnSite: activePeople,
          todayFlightsCount: agg.total_sessions ?? bData.flights_today ?? INITIAL_KPI_DATA.todayFlightsCount,
          activePersonnelOnSite: activePeople,
          ppeCompliancePercentage: Math.round(agg.avg_ppe_compliance_pct ?? INITIAL_KPI_DATA.ppeCompliancePercentage),
          totalInterventionsCount: agg.total_violations ?? INITIAL_KPI_DATA.totalInterventionsCount,
        };
      }
    } catch (err) {
      console.warn('Failed fetching backend KPIs, using fallback:', err);
    }
    return INITIAL_KPI_DATA;
  },

  // Drone Flights List
  async getDroneFlights(): Promise<DroneFlight[]> {
    try {
      const res = await fetch('/api/drone-flights');
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Fallback
    }
    return DRONE_FLIGHTS_DATA as DroneFlight[];
  },

  // Flight Comparison Delta (Previous vs Current Flight Change)
  async getFlightComparisonDelta(): Promise<FlightComparisonDelta> {
    try {
      const res = await fetch('/api/drone-flights/comparison');
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Fallback
    }
    return FLIGHT_COMPARISON_DELTA as unknown as FlightComparisonDelta;
  },

  // Machinery & Telemetry
  async getVehicles(): Promise<TelemetryVehicle[]> {
    try {
      const res = await fetch('/api/telemetry/vehicles');
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Fallback
    }
    return TELEMETRY_VEHICLES;
  },

  // Save Site Map Snapshot (Discreet, clean, no ITK labels)
  async saveSnapshot(payload: Partial<SnapshotPayload>): Promise<SnapshotPayload> {
    try {
      const res = await fetch('/api/snapshots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Fallback
    }
    return {
      id: `snap-${Date.now()}`,
      title: payload.title || 'Map Survey Snapshot',
      capturedAt: new Date().toISOString(),
      coords: payload.coords || { lat: 18.5241, lng: 73.8567 },
      locationName: payload.locationName || 'Expressway Corridor',
      chainageKm: payload.chainageKm || 'KM 12+400',
      imageUrl: payload.imageUrl || ''
    };
  },

  // --- Flask Backend (Python AI + HDMI Capture + SQLite) ---

  // Flight Sessions
  async createFlightSession(payload?: { name?: string; notes?: string; date?: string; start_time?: string }) {
    const res = await fetch('/api/v1/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload || {})
    });
    const json = await res.json();
    return json.data;
  },

  async getActiveFlightSession() {
    const res = await fetch('/api/v1/sessions/active');
    const json = await res.json();
    return json.data;
  },

  async listFlightSessions(date?: string) {
    const url = date ? `/api/v1/sessions?date=${encodeURIComponent(date)}` : '/api/v1/sessions';
    const res = await fetch(url);
    const json = await res.json();
    return json.data;
  },

  async completeFlightSession(sessionId: string) {
    const res = await fetch(`/api/v1/sessions/${sessionId}/complete`, { method: 'POST' });
    const json = await res.json();
    return json.data;
  },

  // Video Streaming
  getLiveStreamUrl(): string {
    return '/api/v1/stream/live';
  },

  getAnnotatedStreamUrl(): string {
    return '/api/v1/stream/annotated';
  },

  async getStreamStatus() {
    const res = await fetch('/api/v1/stream/status');
    const json = await res.json();
    return json.data;
  },

  // Video Recording
  async startVideoRecording(sessionId?: string) {
    const res = await fetch('/api/v1/recordings/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId })
    });
    const json = await res.json();
    return json.data;
  },

  async stopVideoRecording() {
    const res = await fetch('/api/v1/recordings/stop', { method: 'POST' });
    const json = await res.json();
    return json.data;
  },

  async listVideoRecordings(sessionId?: string) {
    const url = sessionId ? `/api/v1/recordings?session_id=${encodeURIComponent(sessionId)}` : '/api/v1/recordings';
    const res = await fetch(url);
    const json = await res.json();
    return json.data;
  },

  getRecordingDownloadUrl(recordingId: string): string {
    return `/api/v1/recordings/${recordingId}/download`;
  },

  // AI Detections & PPE Observations
  async getAIMode() {
    const res = await fetch('/api/v1/detections/mode');
    const json = await res.json();
    return json.data;
  },

  async setAIMode(useSimulated: boolean) {
    const res = await fetch('/api/v1/detections/mode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ use_simulated: useSimulated })
    });
    const json = await res.json();
    return json.data;
  },

  async getLatestAIDetection(sessionId?: string) {
    const url = sessionId ? `/api/v1/detections/latest?session_id=${encodeURIComponent(sessionId)}` : '/api/v1/detections/latest';
    const res = await fetch(url);
    const json = await res.json();
    return json.data;
  },

  async captureAISnapshot(sessionId?: string, notes?: string) {
    const res = await fetch('/api/v1/detections/snapshot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, notes })
    });
    const json = await res.json();
    return json.data;
  },

  async listPPEObservations(sessionId?: string, resolved?: boolean) {
    const params = new URLSearchParams();
    if (sessionId) params.append('session_id', sessionId);
    if (resolved !== undefined) params.append('resolved', String(resolved));
    const res = await fetch(`/api/v1/ppe-observations?${params.toString()}`);
    const json = await res.json();
    return json.data;
  },

  async resolvePPEObservation(obsId: string) {
    const res = await fetch(`/api/v1/ppe-observations/${obsId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resolved_by: 'Safety Officer' })
    });
    const json = await res.json();
    return json.data;
  },

  // Flask Backend KPIs
  async getFlaskKPIs(sessionId?: string, date?: string) {
    const params = new URLSearchParams();
    if (sessionId) params.append('session_id', sessionId);
    if (date) params.append('date', date);
    const res = await fetch(`/api/v1/kpis?${params.toString()}`);
    const json = await res.json();
    return json.data;
  }
};
