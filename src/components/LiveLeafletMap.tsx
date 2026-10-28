import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, Circle, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { 
  Navigation, 
  Layers, 
  Eye, 
  Maximize2, 
  Camera, 
  Radio, 
  Truck, 
  CheckCircle2,
  Sliders,
  MapPin,
  Building2,
  Compass,
  AlertTriangle,
  Flame,
  Boxes,
  ShieldCheck,
  ChevronRight,
  Crosshair,
  Satellite,
  Mountain,
  Grid
} from 'lucide-react';
import { TelemetryVehicle } from '../types';
import { TELEMETRY_VEHICLES } from '../data/mockData';

// Fix Leaflet default marker icon assets
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom HTML Icons for Vehicles & Machinery
const createVehicleIcon = (type: string, status: string, name: string, isSelected: boolean) => {
  const isDrone = type === 'drone';
  const isPaver = type === 'paver';
  const isRoller = type === 'roller';
  const isGrader = type === 'grader';
  
  let bg = '#2563eb';
  let label = 'EQ';
  let badgeColor = '#3b82f6';

  if (isDrone) {
    bg = '#3b82f6';
    label = '🚁';
    badgeColor = '#60a5fa';
  } else if (isPaver) {
    bg = status === 'active' ? '#10b981' : '#f59e0b';
    label = 'PAV';
    badgeColor = status === 'active' ? '#34d399' : '#fbbf24';
  } else if (isRoller) {
    bg = status === 'active' ? '#6366f1' : '#f59e0b';
    label = 'ROL';
    badgeColor = status === 'active' ? '#818cf8' : '#fbbf24';
  } else if (isGrader) {
    bg = '#0ea5e9';
    label = 'GRD';
    badgeColor = '#38bdf8';
  } else {
    bg = '#475569';
    label = 'TRK';
    badgeColor = '#94a3b8';
  }

  const borderStyle = isSelected ? '3px solid #facc15' : '2px solid #ffffff';
  const glowStyle = isSelected ? '0 0 16px rgba(250, 204, 21, 0.9)' : '0 4px 12px rgba(0,0,0,0.35)';

  const html = `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
      <div style="
        width: 34px; 
        height: 34px; 
        background: ${bg}; 
        color: white; 
        border-radius: 10px; 
        border: ${borderStyle}; 
        box-shadow: ${glowStyle};
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-weight: 800; 
        font-size: 11px;
        letter-spacing: -0.5px;
        transition: transform 0.2s ease;
      ">
        ${label}
      </div>
      <div style="
        background: rgba(15, 23, 42, 0.95); 
        color: #ffffff; 
        font-size: 9px; 
        font-weight: 700; 
        padding: 2px 6px; 
        border-radius: 6px; 
        margin-top: 3px; 
        white-space: nowrap;
        border: 1px solid ${badgeColor};
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      ">
        ${name.split(' ')[0]}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-vehicle-marker',
    iconSize: [38, 50],
    iconAnchor: [19, 25],
    popupAnchor: [0, -25]
  });
};

// CORS Base Station Icon
const createBaseStationIcon = (name: string) => {
  const html = `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
      <div style="
        width: 36px; 
        height: 36px; 
        background: #0f172a; 
        color: #38bdf8; 
        border-radius: 50%; 
        border: 2.5px solid #38bdf8; 
        box-shadow: 0 0 16px rgba(56, 189, 248, 0.7);
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-size: 15px;
      ">
        📡
      </div>
      <div style="
        background: #0f172a; 
        color: #38bdf8; 
        font-size: 9px; 
        font-weight: 800; 
        padding: 2px 7px; 
        border-radius: 6px; 
        margin-top: 3px; 
        white-space: nowrap;
        border: 1px solid #38bdf8;
      ">
        ${name}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-base-marker',
    iconSize: [42, 54],
    iconAnchor: [21, 27],
    popupAnchor: [0, -27]
  });
};

// Ground Control Point (GCP) Target Icon
const createGcpIcon = (gcpId: string) => {
  const html = `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
      <div style="
        width: 24px; 
        height: 24px; 
        background: #facc15; 
        color: #0f172a; 
        border-radius: 6px; 
        border: 2px solid #0f172a; 
        box-shadow: 0 0 10px rgba(250, 204, 21, 0.8);
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-weight: 900;
        font-size: 10px;
      ">
        🎯
      </div>
      <div style="
        background: #0f172a; 
        color: #facc15; 
        font-size: 8.5px; 
        font-weight: 800; 
        padding: 1px 5px; 
        border-radius: 4px; 
        margin-top: 2px; 
        white-space: nowrap;
        border: 1px solid #facc15;
      ">
        ${gcpId}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-gcp-marker',
    iconSize: [30, 40],
    iconAnchor: [15, 20],
    popupAnchor: [0, -20]
  });
};

// Engineering Structure / Bridge Icon
const createStructureIcon = (symbol: string, label: string, color: string) => {
  const html = `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
      <div style="
        width: 32px; 
        height: 32px; 
        background: ${color}; 
        color: white; 
        border-radius: 8px; 
        border: 2px solid #ffffff; 
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-size: 13px;
      ">
        ${symbol}
      </div>
      <div style="
        background: #0f172a; 
        color: #ffffff; 
        font-size: 8.5px; 
        font-weight: 700; 
        padding: 1.5px 5px; 
        border-radius: 4px; 
        margin-top: 2px; 
        white-space: nowrap;
        border: 1px solid rgba(255,255,255,0.3);
      ">
        ${label}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-structure-marker',
    iconSize: [36, 46],
    iconAnchor: [18, 23],
    popupAnchor: [0, -23]
  });
};

// 20 KM HIGHWAY DETAILED ALIGNMENT GEOMETRY (Realistic S-Curve Corridor)
export const ALIGNMENT_SECTORS = [
  {
    id: 'sec-1',
    name: 'Sector 1 (KM 0+000 – 4+000)',
    chainageRange: 'KM 0+000 to KM 4+000',
    layerType: 'Bituminous Concrete (BC 40mm)',
    layerCategory: 'Wearing Surface (Paved)',
    color: '#10b981', // Emerald
    bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    progress: 100,
    densityAchieved: '99.4%',
    temperature: '154°C',
    thicknessMm: '40 mm',
    status: 'Completed & Signed Off',
    coords: [
      [18.5080, 73.8390],
      [18.5098, 73.8408],
      [18.5118, 73.8428],
      [18.5132, 73.8445],
      [18.5148, 73.8465]
    ] as [number, number][]
  },
  {
    id: 'sec-2',
    name: 'Sector 2 (KM 4+000 – 8+000)',
    chainageRange: 'KM 4+000 to KM 8+000',
    layerType: 'Dense Bituminous Macadam (DBM 75mm)',
    layerCategory: 'Binder Course (Compacted)',
    color: '#2563eb', // Royal Blue
    bgColor: 'bg-blue-50 text-blue-700 border-blue-200',
    progress: 88,
    densityAchieved: '98.8%',
    temperature: '149°C',
    thicknessMm: '75 mm',
    status: 'Binder Layer Approved',
    coords: [
      [18.5148, 73.8465],
      [18.5165, 73.8488],
      [18.5180, 73.8505],
      [18.5195, 73.8522],
      [18.5208, 73.8538]
    ] as [number, number][]
  },
  {
    id: 'sec-3',
    name: 'Sector 3 (KM 8+000 – 12+000)',
    chainageRange: 'KM 8+000 to KM 12+000',
    layerType: 'Dense Bituminous Macadam (DBM Laydown)',
    layerCategory: 'Active Paving & Rolling Front',
    color: '#8b5cf6', // Violet/Purple (Active Paving)
    bgColor: 'bg-purple-50 text-purple-700 border-purple-200',
    progress: 74,
    densityAchieved: '97.9%',
    temperature: '146°C',
    thicknessMm: '75 mm',
    status: 'Active Paving Front (Paver 01)',
    coords: [
      [18.5208, 73.8538],
      [18.5220, 73.8550],
      [18.5232, 73.8560],
      [18.5241, 73.8567],
      [18.5255, 73.8580]
    ] as [number, number][]
  },
  {
    id: 'sec-4',
    name: 'Sector 4 (KM 12+000 – 16+000)',
    chainageRange: 'KM 12+000 to KM 16+000',
    layerType: 'Wet Mix Macadam (WMM 250mm)',
    layerCategory: 'Crushed Rock Base Course',
    color: '#f59e0b', // Amber
    bgColor: 'bg-amber-50 text-amber-700 border-amber-200',
    progress: 62,
    densityAchieved: '94.2%',
    temperature: 'Ambient (31°C)',
    thicknessMm: '250 mm',
    status: 'Base Compaction in Progress',
    coords: [
      [18.5255, 73.8580],
      [18.5270, 73.8595],
      [18.5288, 73.8610],
      [18.5305, 73.8625],
      [18.5320, 73.8638]
    ] as [number, number][]
  },
  {
    id: 'sec-5',
    name: 'Sector 5 (KM 16+000 – 20+000)',
    chainageRange: 'KM 16+000 to KM 20+000',
    layerType: 'Granular Sub-Base (GSB 150mm) & Hill Cut',
    layerCategory: 'Earthwork Subgrade & Slope Terracing',
    color: '#ea580c', // Deep Orange
    bgColor: 'bg-orange-50 text-orange-700 border-orange-200',
    progress: 46,
    densityAchieved: '91.5%',
    temperature: 'Ambient (32°C)',
    thicknessMm: '150 mm',
    status: 'Excavation & Grade Control',
    coords: [
      [18.5320, 73.8638],
      [18.5345, 73.8658],
      [18.5372, 73.8678],
      [18.5398, 73.8695],
      [18.5420, 73.8710]
    ] as [number, number][]
  }
];

// All highway corridor coordinate vertices combined
const ALL_CORRIDOR_COORDS: [number, number][] = ALIGNMENT_SECTORS.reduce((acc, sec) => {
  if (acc.length === 0) return [...sec.coords];
  // append without duplicate overlapping junction vertex
  return [...acc, ...sec.coords.slice(1)];
}, [] as [number, number][]);

// 60-meter Right-of-Way (RoW) Corridor Buffer Polygon
const ROW_BUFFER_POLYGON: [number, number][] = [
  // Left RoW offset boundary
  [18.5085, 73.8385],
  [18.5152, 73.8460],
  [18.5212, 73.8532],
  [18.5259, 73.8574],
  [18.5325, 73.8632],
  [18.5425, 73.8704],
  // Right RoW offset boundary (return loop)
  [18.5415, 73.8716],
  [18.5315, 73.8644],
  [18.5251, 73.8586],
  [18.5204, 73.8544],
  [18.5144, 73.8470],
  [18.5075, 73.8395]
];

// Detailed Chainage Milestones every 2.5 KM
const DETAILED_MILESTONES = [
  { km: 'KM 0+000', pos: [18.5080, 73.8390] as [number, number], label: 'Khandala Interchange (Package Start)', layer: 'BC 40mm Wearing', progress: '100%' },
  { km: 'KM 2+500', pos: [18.5125, 73.8436] as [number, number], label: 'Khandala Ghat Descent Curve', layer: 'BC 40mm Wearing', progress: '100%' },
  { km: 'KM 5+000', pos: [18.5165, 73.8488] as [number, number], label: 'Viaduct Pier #04 Span', layer: 'DBM 75mm Binder', progress: '94%' },
  { km: 'KM 7+500', pos: [18.5198, 73.8526] as [number, number], label: 'Khopoli Approach Ramp', layer: 'DBM 75mm Binder', progress: '85%' },
  { km: 'KM 10+000', pos: [18.5220, 73.8550] as [number, number], label: 'Toll Plaza & WIM Gantry', layer: 'DBM Active Laydown', progress: '78%' },
  { km: 'KM 12+500', pos: [18.5255, 73.8580] as [number, number], label: 'Talegaon River Bridge', layer: 'WMM 250mm Base', progress: '68%' },
  { km: 'KM 15+000', pos: [18.5305, 73.8625] as [number, number], label: 'Junction Cloverleaf VUP', layer: 'WMM 250mm Base', progress: '58%' },
  { km: 'KM 17+500', pos: [18.5372, 73.8678] as [number, number], label: 'Hill Cut Terracing Zone', layer: 'GSB 150mm Sub-Base', progress: '48%' },
  { km: 'KM 20+000', pos: [18.5420, 73.8710] as [number, number], label: 'Lonavala Package 04 End', layer: 'GSB Sub-Base & Cut', progress: '42%' },
];

// Major Civil Engineering Structures
const CIVIL_STRUCTURES = [
  {
    id: 'struct-1',
    name: 'Major Viaduct Pier #04',
    symbol: '🌉',
    chainage: 'KM 5+800',
    type: 'High-Level Viaduct (480m Span)',
    pos: [18.5175, 73.8498] as [number, number],
    color: '#0284c7',
    details: 'Cast-in-situ prestressed concrete box girder. 16 Pier columns completed. Deck slab concreting passed.'
  },
  {
    id: 'struct-2',
    name: 'Expressway Toll Plaza & WIM',
    symbol: '🏢',
    chainage: 'KM 10+400',
    type: '12-Lane Electronic Toll Plaza',
    pos: [18.5225, 73.8555] as [number, number],
    color: '#7c3aed',
    details: 'Fastag automatic gantries + High-Speed Weigh-in-Motion axle sensors installed in lane #01 to #06.'
  },
  {
    id: 'struct-3',
    name: 'Vehicular Underpass (VUP #02)',
    symbol: '🔄',
    chainage: 'KM 14+800',
    type: 'Grade-Separated Cloverleaf Interchange',
    pos: [18.5310, 73.8630] as [number, number],
    color: '#059669',
    details: 'Reinforced earth (RE) wall embankments 88% erected. Underpass box culvert open for local farm traffic.'
  },
  {
    id: 'struct-4',
    name: 'Deep Rock Hill Cut & Slope Netting',
    symbol: '⛰️',
    chainage: 'KM 18+200',
    type: 'Slope Stabilization & Shotcrete',
    pos: [18.5385, 73.8685] as [number, number],
    color: '#dc2626',
    details: 'Pre-split blasting completed. High-tensile steel wire mesh & 8m rock bolts installed on 65° slope face.'
  }
];

// High-Precision Ground Control Points (GCPs)
const GCP_TARGETS = [
  { id: 'GCP-01', chainage: 'KM 0+200', pos: [18.5088, 73.8398] as [number, number], rmseH: '4.2 mm', rmseV: '8.4 mm', status: 'Verified' },
  { id: 'GCP-02', chainage: 'KM 5+800', pos: [18.5172, 73.8492] as [number, number], rmseH: '5.0 mm', rmseV: '7.2 mm', status: 'Verified' },
  { id: 'GCP-03', chainage: 'KM 11+400', pos: [18.5235, 73.8562] as [number, number], rmseH: '7.9 mm', rmseV: '11.0 mm', status: 'Verified' },
  { id: 'GCP-04', chainage: 'KM 17+200', pos: [18.5368, 73.8672] as [number, number], rmseH: '6.4 mm', rmseV: '12.8 mm', status: 'Verified' },
];

// Helper to recenter map smoothly
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

interface LiveLeafletMapProps {
  onCaptureSnapshot?: (data: any) => void;
  selectedVehicle?: TelemetryVehicle | null;
  onSelectVehicle?: (v: TelemetryVehicle) => void;
}

export const LiveLeafletMap: React.FC<LiveLeafletMapProps> = ({
  onCaptureSnapshot,
  selectedVehicle,
  onSelectVehicle
}) => {
  const [vehicles, setVehicles] = useState<TelemetryVehicle[]>(TELEMETRY_VEHICLES);
  const [activeLayer, setActiveLayer] = useState<'street' | 'satellite' | 'topo' | 'dark'>('satellite');
  const [showMachinery, setShowMachinery] = useState(true);
  const [showChainage, setShowChainage] = useState(true);
  const [showFlightPath, setShowFlightPath] = useState(true);
  const [showPavementLayers, setShowPavementLayers] = useState(true);
  const [showStructures, setShowStructures] = useState(true);
  const [showGcps, setShowGcps] = useState(true);
  const [showRowBuffer, setShowRowBuffer] = useState(true);
  const [selectedSector, setSelectedSector] = useState<typeof ALIGNMENT_SECTORS[0] | null>(null);
  const [selectedStructure, setSelectedStructure] = useState<typeof CIVIL_STRUCTURES[0] | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Map viewport control state
  const [mapTarget, setMapTarget] = useState<{ center: [number, number]; zoom: number }>({
    center: [18.5241, 73.8567],
    zoom: 13
  });

  // Real-time subtle telemetry jitter simulation for live drone and moving rollers
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prev => prev.map(v => {
        if (v.type === 'drone') {
          const jitterLat = (Math.random() - 0.5) * 0.0003;
          const jitterLng = (Math.random() - 0.5) * 0.0003;
          return { ...v, lat: v.lat + jitterLat, lng: v.lng + jitterLng };
        } else if (v.status === 'active' && (v.type === 'roller' || v.type === 'paver')) {
          const jitterLat = (Math.random() - 0.5) * 0.00008;
          const jitterLng = (Math.random() - 0.5) * 0.00008;
          return { ...v, lat: v.lat + jitterLat, lng: v.lng + jitterLng };
        }
        return v;
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // When vehicle prop changes, pan to vehicle
  useEffect(() => {
    if (selectedVehicle) {
      setMapTarget({ center: [selectedVehicle.lat, selectedVehicle.lng], zoom: 15 });
    }
  }, [selectedVehicle]);

  const handleTakeMapSnapshot = (customLabel?: string, coords?: { lat: number; lng: number }) => {
    const currentDrone = vehicles.find(v => v.type === 'drone') || vehicles[0];
    const snapData = {
      id: `snap-${Date.now()}`,
      title: customLabel || `Highway Corridor GIS Snapshot — KM 12+400`,
      capturedAt: new Date().toISOString(),
      coords: {
        lat: coords ? coords.lat : currentDrone.lat,
        lng: coords ? coords.lng : currentDrone.lng,
        altM: currentDrone.altitude || 85
      },
      locationName: 'Mumbai-Pune Expressway (Package 04 Alignment)',
      chainageKm: selectedSector ? selectedSector.chainageRange : 'KM 12+400'
    };

    if (onCaptureSnapshot) {
      onCaptureSnapshot(snapData);
    }

    setToastMessage(`Map alignment snapshot captured at ${snapData.chainageKm} with geodetic coordinates.`);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleJumpToSector = (sector: typeof ALIGNMENT_SECTORS[0]) => {
    setSelectedSector(sector);
    setSelectedStructure(null);
    const midIdx = Math.floor(sector.coords.length / 2);
    setMapTarget({
      center: sector.coords[midIdx],
      zoom: 14
    });
  };

  const handleResetAlignmentView = () => {
    setSelectedSector(null);
    setSelectedStructure(null);
    setMapTarget({
      center: [18.5241, 73.8567],
      zoom: 13
    });
  };

  const tileLayerUrls = {
    street: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    topo: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
  };

  return (
    <div id="live-leaflet-map-wrapper" className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-900 flex flex-col">
      {/* Toast Notification (Discreet, clean, no ITK labels) */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-md text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 shadow-2xl z-[1000] flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP FLOATING CONTROLS BAR */}
      <div className="absolute top-4 left-4 right-4 z-[900] flex flex-wrap items-start justify-between gap-3 pointer-events-none">
        
        {/* Left: Corridor Status Pill & Quick Sector Jumps */}
        <div className="bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/80 shadow-xl pointer-events-auto flex items-center gap-1.5 max-w-full overflow-x-auto">
          <button
            onClick={handleResetAlignmentView}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              !selectedSector ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Full 20 KM Alignment</span>
          </button>

          <div className="h-4 w-px bg-slate-700 shrink-0"></div>

          {ALIGNMENT_SECTORS.map((sec, idx) => (
            <button
              key={sec.id}
              onClick={() => handleJumpToSector(sec)}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                selectedSector?.id === sec.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={`${sec.name} • ${sec.layerType}`}
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: sec.color }}></span>
              <span>KM {idx * 4}–{(idx + 1) * 4}</span>
            </button>
          ))}
        </div>

        {/* Right: Map Layers & Actions */}
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          {/* Tile Layer Switcher */}
          <div className="bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/80 shadow-xl flex gap-1 text-xs font-bold text-white">
            <button
              onClick={() => setActiveLayer('satellite')}
              className={`px-2.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeLayer === 'satellite' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Satellite className="w-3.5 h-3.5" />
              <span>Satellite</span>
            </button>
            <button
              onClick={() => setActiveLayer('street')}
              className={`px-2.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeLayer === 'street' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Street</span>
            </button>
            <button
              onClick={() => setActiveLayer('topo')}
              className={`px-2.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeLayer === 'topo' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Mountain className="w-3.5 h-3.5" />
              <span>Topo</span>
            </button>
          </div>

          {/* Quick Snapshot Action Button */}
          <button
            onClick={() => handleTakeMapSnapshot()}
            className="bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
          >
            <Camera className="w-3.5 h-3.5 text-blue-600" />
            <span>Capture Map Snapshot</span>
          </button>
        </div>
      </div>

      {/* BOTTOM-LEFT: Interactive Legend & Filter Drawer */}
      <div className="absolute bottom-16 left-4 z-[900] bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700/80 shadow-2xl text-xs text-white max-w-xs space-y-2.5">
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
          <div className="flex items-center gap-2 font-bold text-white">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>GIS Alignment Layers</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 font-mono">
            NHAI EPC
          </span>
        </div>

        {/* Toggle Filters */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] text-slate-300 font-medium">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
            <input 
              type="checkbox" 
              checked={showPavementLayers} 
              onChange={e => setShowPavementLayers(e.target.checked)} 
              className="rounded text-blue-600 focus:ring-0 w-3.5 h-3.5"
            />
            <span>Pavement Layers</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
            <input 
              type="checkbox" 
              checked={showMachinery} 
              onChange={e => setShowMachinery(e.target.checked)} 
              className="rounded text-blue-600 focus:ring-0 w-3.5 h-3.5"
            />
            <span>Live Machinery</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
            <input 
              type="checkbox" 
              checked={showStructures} 
              onChange={e => setShowStructures(e.target.checked)} 
              className="rounded text-blue-600 focus:ring-0 w-3.5 h-3.5"
            />
            <span>Bridges / VUP</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
            <input 
              type="checkbox" 
              checked={showGcps} 
              onChange={e => setShowGcps(e.target.checked)} 
              className="rounded text-blue-600 focus:ring-0 w-3.5 h-3.5"
            />
            <span>GCPs & CORS</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white col-span-2">
            <input 
              type="checkbox" 
              checked={showRowBuffer} 
              onChange={e => setShowRowBuffer(e.target.checked)} 
              className="rounded text-blue-600 focus:ring-0 w-3.5 h-3.5"
            />
            <span>Right-of-Way (60m RoW Corridor)</span>
          </label>
        </div>

        {/* Pavement Color Legend */}
        {showPavementLayers && (
          <div className="pt-2 border-t border-slate-700/80 space-y-1 text-[10px]">
            <div className="flex items-center justify-between text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
                <span>Bituminous Concrete (BC 40mm)</span>
              </div>
              <span className="font-semibold text-emerald-400">KM 0–4</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span>
                <span>Dense Bituminous (DBM 75mm)</span>
              </div>
              <span className="font-semibold text-blue-400">KM 4–8</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-purple-500"></span>
                <span>Active Laydown Front</span>
              </div>
              <span className="font-semibold text-purple-400">KM 8–12</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span>
                <span>Wet Mix Macadam (WMM)</span>
              </div>
              <span className="font-semibold text-amber-400">KM 12–16</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-orange-600"></span>
                <span>Sub-Base (GSB) & Hill Cut</span>
              </div>
              <span className="font-semibold text-orange-400">KM 16–20</span>
            </div>
          </div>
        )}
      </div>

      {/* SELECTED SECTOR / STRUCTURE FLOATING DETAIL DRAWER */}
      {selectedSector && (
        <div className="absolute top-20 left-4 z-[900] bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-2xl text-xs text-slate-900 max-w-sm space-y-3 animate-in fade-in slide-in-from-left-4">
          <div className="flex items-start justify-between border-b border-slate-100 pb-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">{selectedSector.chainageRange}</span>
              <h3 className="font-bold text-slate-900 text-sm mt-0.5">{selectedSector.name}</h3>
            </div>
            <button 
              onClick={() => setSelectedSector(null)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-600">
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-semibold">Pavement Layer</span>
              <span className="font-bold text-slate-900 text-xs">{selectedSector.layerType}</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-semibold">Density Achieved</span>
              <span className="font-bold text-emerald-700 text-xs">{selectedSector.densityAchieved}</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-semibold">Laydown Temperature</span>
              <span className="font-bold text-slate-900 text-xs">{selectedSector.temperature}</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-semibold">Progress</span>
              <span className="font-bold text-blue-600 text-xs">{selectedSector.progress}% Done</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500 font-medium">{selectedSector.status}</span>
            <button
              onClick={() => handleTakeMapSnapshot(`Sector Snapshot — ${selectedSector.chainageRange}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Camera className="w-3 h-3" />
              Capture Segment
            </button>
          </div>
        </div>
      )}

      {/* LEAFLET MAP CONTAINER */}
      <div className="w-full h-[540px]">
        <MapContainer
          center={mapTarget.center}
          zoom={mapTarget.zoom}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a> | &copy; <a href="https://www.esri.com/">Esri</a>'
            url={tileLayerUrls[activeLayer]}
          />

          {/* Smooth map controller */}
          <MapController center={mapTarget.center} zoom={mapTarget.zoom} />

          {/* 60m Right-of-Way (RoW) Buffer Polygon */}
          {showRowBuffer && (
            <Polygon
              positions={ROW_BUFFER_POLYGON}
              pathOptions={{
                color: '#60a5fa',
                fillColor: '#3b82f6',
                fillOpacity: 0.08,
                weight: 1.5,
                dashArray: '6, 6'
              }}
            >
              <Tooltip sticky>
                <span className="text-xs font-semibold">60m Right-of-Way (RoW) Boundary Corridor</span>
              </Tooltip>
            </Polygon>
          )}

          {/* COLOR-CODED HIGHWAY PAVEMENT SECTORS */}
          {showPavementLayers ? (
            ALIGNMENT_SECTORS.map((sec) => (
              <React.Fragment key={sec.id}>
                {/* Outer casing stroke */}
                <Polyline
                  positions={sec.coords}
                  pathOptions={{
                    color: '#0f172a',
                    weight: 10,
                    opacity: 0.9,
                    lineCap: 'round',
                    lineJoin: 'round'
                  }}
                />
                {/* Inner color-coded pavement layer stroke */}
                <Polyline
                  positions={sec.coords}
                  pathOptions={{
                    color: sec.color,
                    weight: 6,
                    opacity: 1,
                    lineCap: 'round',
                    lineJoin: 'round'
                  }}
                  eventHandlers={{
                    click: () => setSelectedSector(sec)
                  }}
                >
                  <Tooltip sticky>
                    <div className="text-xs font-bold text-slate-900 p-0.5">
                      <div>{sec.name}</div>
                      <div className="text-[11px] font-normal text-slate-600">{sec.layerType}</div>
                      <div className="text-[10px] text-blue-600 font-semibold mt-0.5">Progress: {sec.progress}% • Click for Sector Specs</div>
                    </div>
                  </Tooltip>
                </Polyline>
              </React.Fragment>
            ))
          ) : (
            // Standard Dual Centerline Polyline
            <>
              <Polyline
                positions={ALL_CORRIDOR_COORDS}
                pathOptions={{
                  color: '#2563eb',
                  weight: 8,
                  opacity: 0.9,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              />
              <Polyline
                positions={ALL_CORRIDOR_COORDS}
                pathOptions={{
                  color: '#ffffff',
                  weight: 2,
                  dashArray: '8, 8',
                  opacity: 0.95
                }}
              />
            </>
          )}

          {/* DETAILED CHAINAGE MILESTONES (Every 2.5 KM) */}
          {showChainage && DETAILED_MILESTONES.map((m, idx) => (
            <Marker
              key={idx}
              position={m.pos}
              icon={L.divIcon({
                html: `
                  <div style="
                    background: #0f172a; 
                    color: #ffffff; 
                    font-size: 9.5px; 
                    font-weight: 800; 
                    padding: 2.5px 7px; 
                    border-radius: 6px; 
                    border: 1.5px solid #ffffff; 
                    box-shadow: 0 3px 8px rgba(0,0,0,0.5);
                    white-space: nowrap;
                    display: flex;
                    align-items: center;
                    gap: 3px;
                  ">
                    <span style="width: 5px; height: 5px; border-radius: 50%; background: #38bdf8;"></span>
                    ${m.km}
                  </div>
                `,
                className: 'chainage-marker',
                iconSize: [64, 22],
                iconAnchor: [32, 11]
              })}
            >
              <Popup>
                <div className="text-xs p-1.5 space-y-1 min-w-[180px]">
                  <div className="font-bold text-slate-900 text-sm flex items-center justify-between">
                    <span>{m.km}</span>
                    <span className="text-blue-600 font-semibold text-xs">{m.progress}</span>
                  </div>
                  <div className="text-slate-700 font-medium text-[11px]">{m.label}</div>
                  <div className="text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded border border-slate-100">
                    Layer: {m.layer}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* MAJOR CIVIL ENGINEERING STRUCTURES */}
          {showStructures && CIVIL_STRUCTURES.map((st) => (
            <Marker
              key={st.id}
              position={st.pos}
              icon={createStructureIcon(st.symbol, st.name.split(' ')[0], st.color)}
            >
              <Popup>
                <div className="text-xs p-1.5 space-y-1.5 min-w-[220px]">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-1.5">
                    <span className="text-base">{st.symbol}</span>
                    <div>
                      <div className="font-bold text-slate-900">{st.name}</div>
                      <div className="text-[10px] text-blue-600 font-semibold">{st.chainage} • {st.type}</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{st.details}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* GROUND CONTROL POINTS (GCPs) */}
          {showGcps && GCP_TARGETS.map((gcp) => (
            <Marker
              key={gcp.id}
              position={gcp.pos}
              icon={createGcpIcon(gcp.id)}
            >
              <Popup>
                <div className="text-xs p-1.5 space-y-1 min-w-[180px]">
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>{gcp.id}</span>
                    <span className="text-emerald-600 font-bold text-[10px]">✓ {gcp.status}</span>
                  </div>
                  <div className="text-[11px] text-slate-600">Location: {gcp.chainage}</div>
                  <div className="grid grid-cols-2 gap-1 text-[10px] bg-slate-50 p-1.5 rounded border border-slate-100">
                    <div>RMSE (H): <span className="font-bold text-slate-800">{gcp.rmseH}</span></div>
                    <div>RMSE (V): <span className="font-bold text-slate-800">{gcp.rmseV}</span></div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* CORS BASE STATION (KM 12+400) */}
          {showGcps && (
            <Marker
              position={[18.52043, 73.85674]}
              icon={createBaseStationIcon('SOI PUNE01')}
            >
              <Popup>
                <div className="text-xs p-1.5 space-y-1.5 min-w-[210px]">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-1">
                    <span className="text-base">📡</span>
                    <div>
                      <div className="font-bold text-slate-900">Survey of India CORS Base</div>
                      <div className="text-[10px] text-emerald-700 font-bold">Mount: PUNE01_RTCM32</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-blue-700 bg-blue-50 p-1 rounded">
                    Lat: 18.52043° N | Lon: 73.85674° E
                  </div>
                  <div className="text-[11px] text-slate-600">Continuous RINEX 3.04 @ 1 Hz Multi-GNSS Base</div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* DRONE FLIGHT PATH SCAN FOOTPRINT */}
          {showFlightPath && (
            <Circle
              center={[vehicles[0].lat, vehicles[0].lng]}
              radius={280}
              pathOptions={{
                color: '#3b82f6',
                fillColor: '#3b82f6',
                fillOpacity: 0.14,
                weight: 1.5,
                dashArray: '4,4'
              }}
            >
              <Tooltip sticky>
                <span className="text-xs font-semibold">Drone 1 Zenmuse P1 35mm Optical Footprint (80% Overlap)</span>
              </Tooltip>
            </Circle>
          )}

          {/* MACHINERY & LIVE VEHICLES */}
          {showMachinery && vehicles.map((v) => (
            <Marker
              key={v.id}
              position={[v.lat, v.lng]}
              icon={createVehicleIcon(v.type, v.status, v.name, selectedVehicle?.id === v.id)}
              eventHandlers={{
                click: () => {
                  if (onSelectVehicle) onSelectVehicle(v);
                }
              }}
            >
              <Popup>
                <div className="text-xs p-1.5 min-w-[220px] space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span className="font-bold text-slate-900">{v.name}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                      v.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {v.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Speed / Rate:</span>
                      <span className="font-semibold text-slate-800">{v.speed}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Operator:</span>
                      <span className="font-semibold text-slate-800">{v.operator || 'Autonomous Pilot'}</span>
                    </div>
                  </div>

                  {v.altitude && (
                    <div className="text-[11px] text-blue-700 bg-blue-50 px-2 py-1 rounded-lg font-medium">
                      Altitude: {v.altitude}m AGL | Battery: {v.battery}% | Fix: PPK 99.4%
                    </div>
                  )}

                  <div className="pt-1">
                    <button
                      onClick={() => handleTakeMapSnapshot(`Machine Telemetry — ${v.name}`, { lat: v.lat, lng: v.lng })}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-1.5 px-3 rounded-lg text-[11px] flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Camera className="w-3.5 h-3.5 text-blue-400" />
                      <span>Capture Vehicle Telemetry</span>
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* BOTTOM CORRIDOR PROGRESS RIBBON BAR */}
      <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-slate-300">
          <span className="font-bold text-white text-xs shrink-0">Linear Corridor Progress:</span>
          <span className="text-xs text-slate-400 hidden md:inline">Click any segment to inspect engineering specs & telemetry</span>
        </div>

        {/* 5-Segment Visual Progress Bar */}
        <div className="flex-1 max-w-lg flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {ALIGNMENT_SECTORS.map((sec, idx) => (
            <button
              key={sec.id}
              onClick={() => handleJumpToSector(sec)}
              className={`flex-1 py-1.5 px-1 text-center rounded-lg font-bold text-[10px] transition-all cursor-pointer truncate ${
                selectedSector?.id === sec.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-white hover:brightness-110'
              }`}
              style={{ backgroundColor: selectedSector?.id === sec.id ? '#ffffff' : sec.color }}
              title={`${sec.name}: ${sec.progress}% complete (${sec.layerType})`}
            >
              KM {idx * 4}–{(idx + 1) * 4} ({sec.progress}%)
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-slate-400 text-xs">
          <div>Cumulative: <span className="font-bold text-emerald-400">68.4% Paved</span></div>
          <button
            onClick={handleResetAlignmentView}
            className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer underline text-[11px]"
          >
            Reset Center
          </button>
        </div>
      </div>
    </div>
  );
};
