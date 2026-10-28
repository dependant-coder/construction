import { ProjectPackage, KpiData, TelemetryVehicle, OperationalAlert, SegmentInfo } from '../types';

export interface DroneFlight {
  id: string;
  flightNumber: number;
  flightCode: string;
  date: string;
  time: string;
  droneModel: string;
  pilot: string;
  areaKm: number;
  corridorLengthKm: number;
  altitudeMeters: number;
  imagesCaptured: number;
  rtkFixPercent: number;
  progressAchievedPercent: number;
  pavedLengthKm: number;
  earthworkVolumeM3: number;
  orthomosaicUrl?: string;
  status: 'Completed' | 'Processing' | 'Scheduled';
}

export interface FlightComparisonDelta {
  previousFlight: DroneFlight;
  currentFlight: DroneFlight;
  percentageChange: number; // e.g. +5.8%
  pavedLengthDeltaKm: number; // e.g. +1.16 KM
  earthworkVolumeDeltaM3: number; // e.g. +14,800 m³
  qualityComplianceChange: number; // e.g. +1.2%
  daysBetweenFlights: number;
  notes: string;
}

export interface SnapshotPayload {
  id: string;
  title: string;
  capturedAt: string;
  coords: {
    lat: number;
    lng: number;
    altM?: number;
  };
  locationName: string;
  chainageKm: string;
  imageUrl: string;
  notes?: string;
}

export interface ReportItem {
  id: string;
  title: string;
  date: string;
  type: 'DPR' | 'Flight Survey Delta' | 'Quality & Density';
  generatedBy: string;
  fileSize: string;
  downloadUrl?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}
