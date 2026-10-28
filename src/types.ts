export type NavSection = 'dashboard' | 'progress' | 'site-intel' | 'evidence' | 'reports' | 'admin';

export interface ProjectPackage {
  id: string;
  name: string;
  section: string;
  code: string;
  overallProgress: number;
  plannedProgress: number;
  lengthKm: number;
  contractor: string;
  status: 'On Track' | 'Delayed' | 'Critical';
}

export interface KpiData {
  overallProgress: number;
  progressDiffWeek: number;
  // Inter-flight survey delta (previous flight vs current flight)
  flightChangePercent: number; // e.g. +5.8%
  previousFlightCode: string; // e.g. 'Flight #11 (15 Aug)'
  currentFlightCode: string; // e.g. 'Flight #12 (22 Aug)'
  flightPavedDeltaKm: number; // e.g. +1.16 KM
  flightEarthworkDeltaM3: number; // e.g. +14,800 m3
  peopleOnSite: number;
  peopleDiffYesterday: number;
  machinesActive: number;
  totalMachines: number;
  idleMachinesCount: number;
  idleMachinesNote: string;
  criticalAlertsCount: number;
  criticalAlertsSeverity: 'High' | 'Medium' | 'Low';
  lastDroneSurveyTime: string;
  lastDroneSurveyDate: string;
  // AI Detection & Drone Survey KPIs from Flask backend
  todayFlightsCount?: number;
  activePersonnelOnSite?: number;
  ppeCompliancePercentage?: number;
  totalInterventionsCount?: number;
  workCompletedTodayKm?: number;
  workCompletedTodayMeters?: number;
}

export interface ChartDataPoint {
  week: string;
  planned: number;
  actual: number;
  earthwork?: number;
  paving?: number;
  structures?: number;
}

export interface OperationalAlert {
  id: string;
  type: 'delay' | 'idle' | 'safety' | 'quality';
  title: string;
  timeAgo: string;
  timestamp: string;
  description: string;
  location: string;
  severity: 'high' | 'medium' | 'low';
  resolved?: boolean;
}

export interface SegmentInfo {
  id: string;
  name: string;
  rangeKm: string;
  startKm: number;
  endKm: number;
  progress: number;
  status: 'good' | 'on-track' | 'warning';
  color: string;
  completedLayers: string[];
  currentActivity: string;
  workforce: number;
  activeMachinery: number;
  qualityScore: number;
  mapImageUrl?: string;
  gpsCoords?: string;
}

export interface TelemetryVehicle {
  id: string;
  name: string;
  type: 'drone' | 'truck' | 'paver' | 'roller' | 'crew' | 'gate';
  lat: number;
  lng: number;
  status: 'active' | 'idle' | 'warning' | 'transit';
  speed: string;
  operator?: string;
  heading?: number;
  battery?: number;
  altitude?: number;
}

export interface DroneFeedMetadata {
  date: string;
  time: string;
  battery: number;
  lat: number;
  lng: number;
  alt: number;
  speed: number;
  droneModel: string;
  operator: string;
  resolution: string;
  streamSource: 'drone-main' | 'oblique-ortho' | 'paving-cam' | 'viaduct-cam';
}

export interface EvidenceItem {
  id: string;
  title: string;
  date: string;
  type: 'orthomosaic' | 'point-cloud' | 'thermal' | 'dpr';
  thumbnailUrl: string;
  surveyId: string;
  areaKm: number;
  accuracy: string;
  fileSize: string;
}
