import { ProjectPackage, KpiData, ChartDataPoint, OperationalAlert, SegmentInfo, TelemetryVehicle, EvidenceItem } from '../types';

import imgRoadAerial from '../assets/images/road_construction_aerial_1787642631313.jpg';
import imgCctvSurveillance from '../assets/images/cctv_site_surveillance_1787642646753.jpg';
import imgRoadPaving from '../assets/images/road_paving_action_1787642662827.jpg';
import imgHighwayEarthwork from '../assets/images/highway_earthwork_base_1787642678234.jpg';
import imgRoadOrthomosaic from '../assets/images/road_orthomosaic_map_1787642697531.jpg';

export {
  imgRoadAerial,
  imgCctvSurveillance,
  imgRoadPaving,
  imgHighwayEarthwork,
  imgRoadOrthomosaic
};

export const CURRENT_PROJECT: ProjectPackage = {
  id: 'pkg-04',
  name: 'Mumbai–Pune Expressway',
  section: 'Section B (KM 0 to KM 20)',
  code: 'MPEE-SEC-B',
  overallProgress: 68.4,
  plannedProgress: 72.0,
  lengthKm: 20.0,
  contractor: 'L&T Infrastructure & IRB Infrastructure JV',
  status: 'On Track'
};

export const AVAILABLE_PACKAGES: ProjectPackage[] = [
  CURRENT_PROJECT,
  {
    id: 'pkg-03',
    name: 'Mumbai–Pune Expressway',
    section: 'Section A (Khopoli Bypass)',
    code: 'MPEE-SEC-A',
    overallProgress: 84.1,
    plannedProgress: 85.0,
    lengthKm: 16.5,
    contractor: 'Afcons Infrastructure Ltd',
    status: 'On Track'
  },
  {
    id: 'pkg-05',
    name: 'Mumbai–Pune Expressway',
    section: 'Western Ghats Viaduct Section',
    code: 'MPEE-SEC-C',
    overallProgress: 52.8,
    plannedProgress: 60.0,
    lengthKm: 12.2,
    contractor: 'HCC - Tata Projects JV',
    status: 'Delayed'
  }
];

export const INITIAL_KPI_DATA: KpiData = {
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
  lastDroneSurveyDate: 'Today',
  todayFlightsCount: 4,
  activePersonnelOnSite: 147,
  ppeCompliancePercentage: 98,
  totalInterventionsCount: 2,
  workCompletedTodayKm: 0.48,
  workCompletedTodayMeters: 480
};

export const CHART_PROGRESS_DATA: ChartDataPoint[] = [
  { week: 'Week 1', planned: 5, actual: 4.8, earthwork: 12, paving: 0, structures: 4 },
  { week: 'Week 2', planned: 22, actual: 19.5, earthwork: 38, paving: 10, structures: 18 },
  { week: 'Week 3', planned: 42, actual: 38.0, earthwork: 64, paving: 28, structures: 35 },
  { week: 'Week 4', planned: 60, actual: 56.2, earthwork: 84, paving: 49, structures: 50 },
  { week: 'Week 5', planned: 72, actual: 68.4, earthwork: 97, paving: 68, structures: 62 },
  { week: 'Week 6 (Est)', planned: 84, actual: 81.0, earthwork: 100, paving: 80, structures: 74 },
  { week: 'Week 7 (Est)', planned: 93, actual: 91.5, earthwork: 100, paving: 92, structures: 88 },
  { week: 'Week 8 (Target)', planned: 100, actual: 100, earthwork: 100, paving: 100, structures: 100 }
];

export interface DailyPavingRecord {
  day: string;
  date: string;
  plannedTons: number;
  actualTons: number;
  linearMeters: number;
  efficiency: number;
}

export const DAILY_PAVING_DATA: DailyPavingRecord[] = [
  { day: 'Mon', date: '18 Aug', plannedTons: 1200, actualTons: 1180, linearMeters: 380, efficiency: 98.3 },
  { day: 'Tue', date: '19 Aug', plannedTons: 1200, actualTons: 1240, linearMeters: 410, efficiency: 103.3 },
  { day: 'Wed', date: '20 Aug', plannedTons: 1300, actualTons: 1290, linearMeters: 425, efficiency: 99.2 },
  { day: 'Thu', date: '21 Aug', plannedTons: 1350, actualTons: 1310, linearMeters: 430, efficiency: 97.0 },
  { day: 'Fri', date: '22 Aug', plannedTons: 1400, actualTons: 1450, linearMeters: 480, efficiency: 103.5 },
  { day: 'Sat', date: '23 Aug', plannedTons: 1100, actualTons: 1120, linearMeters: 360, efficiency: 101.8 },
  { day: 'Sun', date: '24 Aug', plannedTons: 600, actualTons: 580, linearMeters: 190, efficiency: 96.6 }
];

export interface PavementLayerMetric {
  key: string;
  name: string;
  shortName: string;
  targetKm: number;
  actualKm: number;
  progressPercent: number;
  thicknessMm: number;
  color: string;
}

export const PAVEMENT_LAYER_CHART_DATA: PavementLayerMetric[] = [
  { key: 'subgrade', name: 'Subgrade Earthwork Foundation', shortName: 'Subgrade', targetKm: 20.0, actualKm: 19.4, progressPercent: 97.0, thicknessMm: 500, color: '#059669' },
  { key: 'gsb', name: 'Granular Sub-Base (GSB)', shortName: 'GSB Base', targetKm: 20.0, actualKm: 18.2, progressPercent: 91.0, thicknessMm: 200, color: '#2563eb' },
  { key: 'wmm', name: 'Wet Mix Macadam (WMM)', shortName: 'WMM Course', targetKm: 20.0, actualKm: 16.1, progressPercent: 80.5, thicknessMm: 150, color: '#6366f1' },
  { key: 'dbm', name: 'Dense Bituminous Macadam (DBM)', shortName: 'DBM Layer', targetKm: 20.0, actualKm: 13.6, progressPercent: 68.0, thicknessMm: 100, color: '#f59e0b' },
  { key: 'bc', name: 'Bituminous Concrete Surface (BC)', shortName: 'Surface (BC)', targetKm: 20.0, actualKm: 8.4, progressPercent: 42.0, thicknessMm: 40, color: '#334155' }
];

export interface EquipmentFleetMetric {
  machineType: string;
  activeCount: number;
  totalCount: number;
  operationalHours: number;
  idleHours: number;
  fuelRate: number; // L/hour
  productivityScore: number; // %
}

export const EQUIPMENT_FLEET_DATA: EquipmentFleetMetric[] = [
  { machineType: 'Asphalt Pavers', activeCount: 4, totalCount: 4, operationalHours: 7.8, idleHours: 0.6, fuelRate: 28.4, productivityScore: 96 },
  { machineType: 'Tandem Rollers', activeCount: 8, totalCount: 10, operationalHours: 6.9, idleHours: 1.5, fuelRate: 16.2, productivityScore: 88 },
  { machineType: 'Pneumatic Rollers', activeCount: 3, totalCount: 3, operationalHours: 7.2, idleHours: 0.8, fuelRate: 18.5, productivityScore: 92 },
  { machineType: 'Motor Graders', activeCount: 3, totalCount: 4, operationalHours: 6.4, idleHours: 1.2, fuelRate: 24.1, productivityScore: 84 },
  { machineType: 'Heavy Dumpers', activeCount: 12, totalCount: 14, operationalHours: 8.1, idleHours: 0.9, fuelRate: 32.0, productivityScore: 94 }
];

export interface ChainageQualityMetric {
  chainage: string;
  kmNumber: number;
  fieldDensityTest: number; // % standard Proctor
  pavingTemperature: number; // °C
  iriSmoothness: number; // mm/km (International Roughness Index)
  status: 'optimal' | 'acceptable' | 'warning';
}

export const CHAINAGE_QUALITY_DATA: ChainageQualityMetric[] = [
  { chainage: 'KM 0+000 - 4+000', kmNumber: 2, fieldDensityTest: 99.4, pavingTemperature: 154, iriSmoothness: 1.62, status: 'optimal' },
  { chainage: 'KM 4+000 - 8+000', kmNumber: 6, fieldDensityTest: 98.8, pavingTemperature: 149, iriSmoothness: 1.74, status: 'optimal' },
  { chainage: 'KM 8+000 - 12+000', kmNumber: 10, fieldDensityTest: 97.9, pavingTemperature: 146, iriSmoothness: 1.82, status: 'optimal' },
  { chainage: 'KM 12+000 - 16+000', kmNumber: 14, fieldDensityTest: 94.2, pavingTemperature: 139, iriSmoothness: 2.10, status: 'acceptable' },
  { chainage: 'KM 16+000 - 20+000', kmNumber: 18, fieldDensityTest: 91.5, pavingTemperature: 136, iriSmoothness: 2.35, status: 'warning' }
];

export const INITIAL_ALERTS: OperationalAlert[] = [
  {
    id: 'alt-1',
    type: 'delay',
    title: 'Material Delivery Delay',
    timeAgo: '15 mins ago',
    timestamp: '11:28 AM',
    description: 'Aggregate base material shipment delayed by 45 minutes due to highway traffic near Talegaon.',
    location: 'Segment 3 (KM 16+200)',
    severity: 'medium'
  },
  {
    id: 'alt-2',
    type: 'idle',
    title: 'Compactor on Standby',
    timeAgo: '45 mins ago',
    timestamp: '11:00 AM',
    description: '3 Rollers waiting for moisture density test clearance on the sub-base layer.',
    location: 'Segment 2 (KM 12+400)',
    severity: 'medium'
  },
  {
    id: 'alt-3',
    type: 'safety',
    title: 'Safety Check Reminder',
    timeAgo: '1 hr ago',
    timestamp: '10:30 AM',
    description: 'Routine PPE compliance check needed for paving crew entering active lane area.',
    location: 'Segment 1 (KM 4+800)',
    severity: 'low'
  }
];

export const SEGMENTS_DATA: SegmentInfo[] = [
  {
    id: 'seg-1',
    name: 'Segment 1',
    rangeKm: 'KM 0 to 8',
    startKm: 0,
    endKm: 8,
    progress: 92,
    status: 'good',
    color: '#10b981',
    completedLayers: ['Subgrade Earthwork (100%)', 'Granular Sub-Base (100%)', 'Wet Mix Macadam (98%)', 'Bituminous Base (92%)', 'Surface Asphalt (85%)'],
    currentActivity: 'Surface asphalt paving and roadside guardrail installation',
    workforce: 64,
    activeMachinery: 10,
    qualityScore: 98.4,
    mapImageUrl: imgRoadPaving,
    gpsCoords: '18.5108° N, 73.8340° E'
  },
  {
    id: 'seg-2',
    name: 'Segment 2',
    rangeKm: 'KM 8 to 16',
    startKm: 8,
    endKm: 16,
    progress: 78,
    status: 'on-track',
    color: '#3b82f6',
    completedLayers: ['Subgrade Earthwork (100%)', 'Granular Sub-Base (95%)', 'Wet Mix Macadam (84%)', 'Bituminous Base (72%)', 'Surface Asphalt (40%)'],
    currentActivity: 'Dense bituminous layer laying and roller compaction',
    workforce: 58,
    activeMachinery: 9,
    qualityScore: 94.2,
    mapImageUrl: imgRoadAerial,
    gpsCoords: '18.5241° N, 73.8567° E'
  },
  {
    id: 'seg-3',
    name: 'Segment 3',
    rangeKm: 'KM 16 to 20',
    startKm: 16,
    endKm: 20,
    progress: 61,
    status: 'warning',
    color: '#f59e0b',
    completedLayers: ['Subgrade Earthwork (96%)', 'Granular Sub-Base (80%)', 'Wet Mix Macadam (62%)', 'Bituminous Base (35%)', 'Surface Asphalt (0%)'],
    currentActivity: 'Wet mix macadam spreading and grading',
    workforce: 25,
    activeMachinery: 4,
    qualityScore: 88.0,
    mapImageUrl: imgHighwayEarthwork,
    gpsCoords: '18.5412° N, 73.8690° E'
  }
];

export const TELEMETRY_VEHICLES: TelemetryVehicle[] = [
  {
    id: 'DR-01',
    name: 'Survey Drone Alpha (DR-01)',
    type: 'drone',
    lat: 18.5204,
    lng: 73.8567,
    status: 'active',
    speed: '35 km/h',
    operator: 'Pilot R. Deshmukh',
    heading: 142,
    battery: 68,
    altitude: 45
  },
  {
    id: 'DR-02',
    name: 'Backup Drone (DR-02)',
    type: 'drone',
    lat: 18.5385,
    lng: 73.8420,
    status: 'idle',
    speed: '0 km/h',
    operator: 'Station Dock 01',
    heading: 0,
    battery: 98,
    altitude: 0
  },
  {
    id: 'TRK-104',
    name: 'Asphalt Truck #104',
    type: 'truck',
    lat: 18.5140,
    lng: 73.8640,
    status: 'transit',
    speed: '42 km/h',
    operator: 'M. Shinde'
  },
  {
    id: 'TRK-109',
    name: 'Dump Truck #109',
    type: 'truck',
    lat: 18.4980,
    lng: 73.8780,
    status: 'transit',
    speed: '38 km/h',
    operator: 'S. Patil'
  },
  {
    id: 'PVR-01',
    name: 'Asphalt Paver #01',
    type: 'paver',
    lat: 18.5280,
    lng: 73.8490,
    status: 'active',
    speed: '3.2 m/min',
    operator: 'K. Verma'
  },
  {
    id: 'ROL-03',
    name: 'Tandem Roller #03',
    type: 'roller',
    lat: 18.5295,
    lng: 73.8480,
    status: 'idle',
    speed: '0 km/h',
    operator: 'A. Rao'
  }
];

export const DRONE_CAMERA_FEEDS = [
  {
    id: 'feed-cam-1',
    camCode: 'Cam 1',
    title: 'Cam 1 — Drone 1 Aerial Gimbal (Zenmuse P1 35mm)',
    shortTitle: 'Cam 1 (Drone 1)',
    sourceType: 'Drone 1 (Single Gimbal Camera)',
    type: 'drone-main',
    imageUrl: imgRoadAerial,
    alt: 'Aerial drone surveillance view of active highway road construction corridor with paving machines and rollers',
    location: 'KM 12+400 • Talegaon Corridor',
    coordinates: '18.5241° N, 73.8567° E',
    notes: 'Drone 1 primary optical payload (Zenmuse P1 35mm Full-Frame Sensor, 1.2 cm/px GSD)'
  },
  {
    id: 'feed-cam-2',
    camCode: 'Cam 2',
    title: 'Cam 2 — Paver 01 Mast PTZ Camera (Paving Lane)',
    shortTitle: 'Cam 2 (Paver Mast)',
    sourceType: 'Paver 01 Mounted PTZ Sensor',
    type: 'paving-cam',
    imageUrl: imgRoadPaving,
    alt: 'Actual asphalt road paving machine and vibrating tandem roller paving fresh blacktop highway',
    location: 'KM 6+200 • Khopoli Section',
    coordinates: '18.5108° N, 73.8340° E',
    notes: 'Vögele Super 2100-3i screed and compaction feed'
  },
  {
    id: 'feed-cam-3',
    camCode: 'Cam 3',
    title: 'Cam 3 — Earthwork & Grader Mast Camera',
    shortTitle: 'Cam 3 (Grader Cam)',
    sourceType: 'Grader 01 Mast Sensor',
    type: 'earthwork-cam',
    imageUrl: imgHighwayEarthwork,
    alt: 'Road construction earthwork subgrade foundation grading and aggregate spreading',
    location: 'KM 18+600 • Hill Section',
    coordinates: '18.5412° N, 73.8690° E',
    notes: 'CAT 140M subgrade leveling and laser grade control'
  },
  {
    id: 'feed-cam-4',
    camCode: 'Cam 4',
    title: 'Cam 4 — High-Pole Site Surveillance CCTV',
    shortTitle: 'Cam 4 (Corridor CCTV)',
    sourceType: 'Highway Mast Surveillance Pole #04',
    type: 'cctv-surveillance',
    imageUrl: imgCctvSurveillance,
    alt: 'High pole CCTV security surveillance feed overlooking road construction machinery and lane barriers',
    location: 'KM 14+800 • Junction Interchange',
    coordinates: '18.5320° N, 73.8610° E',
    notes: '360° PTZ optical zoom monitoring traffic divergence and material dumping'
  }
];

export const EVIDENCE_GALLERY: EvidenceItem[] = [
  {
    id: 'ev-01',
    title: 'High-Res Orthomosaic Corridor Survey (KM 0 to 20)',
    date: '22 Aug 2026',
    type: 'orthomosaic',
    thumbnailUrl: imgRoadOrthomosaic,
    surveyId: 'SUR-0822-A',
    areaKm: 20.0,
    accuracy: '1.2cm RTK Precision',
    fileSize: '4.8 GB'
  },
  {
    id: 'ev-02',
    title: 'Earthwork Subgrade & Layer Grading Survey',
    date: '21 Aug 2026',
    type: 'point-cloud',
    thumbnailUrl: imgHighwayEarthwork,
    surveyId: 'SUR-0821-B',
    areaKm: 8.0,
    accuracy: 'High density point cloud',
    fileSize: '2.1 GB'
  },
  {
    id: 'ev-03',
    title: '24/7 CCTV Site Surveillance Snapshot Archive',
    date: '20 Aug 2026',
    type: 'thermal',
    thumbnailUrl: imgCctvSurveillance,
    surveyId: 'SUR-0820-T',
    areaKm: 4.5,
    accuracy: 'CCTV HD 1080p Feed',
    fileSize: '680 MB'
  },
  {
    id: 'ev-04',
    title: 'Corridor Asphalt Paving Drone Flyover',
    date: '19 Aug 2026',
    type: 'dpr',
    thumbnailUrl: imgRoadAerial,
    surveyId: 'SUR-0819-V',
    areaKm: 20.0,
    accuracy: '4K Ultra HD Drone',
    fileSize: '12.4 GB'
  }
];

// Drone Flights & Inter-Flight Survey Comparison
export const DRONE_FLIGHTS_DATA = [
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
    orthomosaicUrl: imgRoadOrthomosaic,
    status: 'Completed' as const
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
    orthomosaicUrl: imgHighwayEarthwork,
    status: 'Completed' as const
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
    orthomosaicUrl: imgRoadPaving,
    status: 'Completed' as const
  }
];

export const FLIGHT_COMPARISON_DELTA = {
  previousFlight: DRONE_FLIGHTS_DATA[1],
  currentFlight: DRONE_FLIGHTS_DATA[0],
  percentageChange: 5.8, // +5.8%
  pavedLengthDeltaKm: 1.16, // +1.16 KM
  earthworkVolumeDeltaM3: 14800, // +14,800 m3
  qualityComplianceChange: 1.2, // +1.2%
  daysBetweenFlights: 7,
  notes: 'Major progress along Segment 2 (KM 6 to 14) with dense bituminous layer completed and thermal compaction index at 98.4%.'
};
