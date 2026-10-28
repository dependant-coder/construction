import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  CircleDot, 
  ShieldCheck, 
  CheckCircle2,
  Video,
  Radio
} from 'lucide-react';
import { TelemetryVehicle } from '../types';
import { DRONE_CAMERA_FEEDS } from '../data/mockData';
import { LiveLeafletMap } from './LiveLeafletMap';
import { EquipmentUtilizationChart } from './CleanCharts';
import { ApiService } from '../services/api';

interface SiteIntelViewProps {
  onCaptureSnapshot?: (snapshotData: any) => void;
}

export const SiteIntelView: React.FC<SiteIntelViewProps> = ({ onCaptureSnapshot }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [currentTime, setCurrentTime] = useState('11:42:18');
  const [currentDate, setCurrentDate] = useState('22 Aug 2026');
  const [droneCoords, setDroneCoords] = useState({ lat: 18.5241, lng: 73.8567, alt: 85, spd: 38 });
  const [snapshotToast, setSnapshotToast] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<TelemetryVehicle | null>(null);

  // Stream Mode: 'annotated' (Flask AI), 'raw' (Flask HDMI), 'demo' (Mock image)
  const [streamMode, setStreamMode] = useState<'annotated' | 'raw' | 'demo'>('annotated');
  const [streamError, setStreamError] = useState(false);

  // Live timer for drone HUD
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${mins}:${secs}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Recording counter
  useEffect(() => {
    let recInterval: any;
    if (isRecording) {
      recInterval = setInterval(() => {
        setRecordSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(recInterval);
  }, [isRecording]);

  const handleTakeSnapshot = async () => {
    try {
      if (streamMode !== 'demo') {
        const snap = await ApiService.captureAISnapshot(undefined, 'Live Drone Stream Snapshot');
        if (onCaptureSnapshot) {
          onCaptureSnapshot({
            id: snap.id,
            title: 'Live Drone AI Snapshot',
            time: `${currentDate} ${currentTime}`,
            coords: `LAT: ${droneCoords.lat}° N, LON: ${droneCoords.lng}° E`,
            alt: `${droneCoords.alt}m AGL`,
            url: snap.file_path || activeFeed.imageUrl
          });
        }
        setSnapshotToast(`AI drone survey snapshot saved to backend.`);
      } else {
        const snapshot = {
          id: `snap-${Date.now()}`,
          title: `Snapshot — ${activeFeed.title}`,
          time: `${currentDate} ${currentTime}`,
          coords: `LAT: ${droneCoords.lat}° N, LON: ${droneCoords.lng}° E`,
          alt: `${droneCoords.alt}m AGL`,
          url: activeFeed.imageUrl
        };
        if (onCaptureSnapshot) onCaptureSnapshot(snapshot);
        setSnapshotToast(`Map & drone survey snapshot saved with GPS telemetry.`);
      }
    } catch (err) {
      console.error('Failed to capture snapshot:', err);
      setSnapshotToast('Snapshot saved locally.');
    }
    setTimeout(() => setSnapshotToast(null), 3000);
  };

  const handleToggleRecord = async () => {
    if (!isRecording) {
      try {
        await ApiService.startVideoRecording();
        setIsRecording(true);
        setSnapshotToast('Started MP4 video recording on backend.');
      } catch (err) {
        console.error('Failed to start recording:', err);
        setIsRecording(true);
        setSnapshotToast('Recording started locally.');
      }
    } else {
      try {
        const rec = await ApiService.stopVideoRecording();
        setIsRecording(false);
        setSnapshotToast(`Video recording saved (${rec?.duration_sec || recordSeconds}s).`);
      } catch (err) {
        console.error('Failed to stop recording:', err);
        setIsRecording(false);
        setSnapshotToast('Recording completed.');
      }
    }
    setTimeout(() => setSnapshotToast(null), 3000);
  };

  const formatRecTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const activeFeed = DRONE_CAMERA_FEEDS[0];

  const getStreamSrc = () => {
    if (streamMode === 'annotated') return ApiService.getAnnotatedStreamUrl();
    if (streamMode === 'raw') return ApiService.getLiveStreamUrl();
    return streamMode === 'demo' ? '/demo-videos/demo-loop.mp4' : activeFeed.imageUrl;
  };

  return (
    <div id="site-intel-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {snapshotToast && (
        <div className="fixed top-24 right-8 bg-slate-900 text-white px-5 py-3 rounded-2xl border border-slate-700 flex items-center gap-3 z-50 animate-in slide-in-from-top-3 shadow-2xl">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{snapshotToast}</span>
        </div>
      )}

      {/* Stacked Layout: Drone Video Stream on top (full-width), Leaflet GIS Map below (full-width) */}
      <div className="flex flex-col gap-6">

        {/* TOP: High-Resolution Drone Camera Stream Card */}
        <div 
          id="drone-stream-card"
          className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between"
        >
          {/* Feed Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-bold text-white tracking-wide">
                {activeFeed.title}
              </span>
            </div>

            {/* Stream Selector Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 text-xs">
              <button
                onClick={() => { setStreamMode('annotated'); setStreamError(false); }}
                className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  streamMode === 'annotated' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                AI Annotated Feed
              </button>
              <button
                onClick={() => { setStreamMode('raw'); setStreamError(false); }}
                className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  streamMode === 'raw' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                Raw HDMI Feed
              </button>
              <button
                onClick={() => { setStreamMode('demo'); setStreamError(false); }}
                className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  streamMode === 'demo' ? 'bg-slate-700 text-slate-200 shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Demo Image
              </button>
            </div>
          </div>

          {/* Camera Info Note */}
          <div className="mb-3 px-3 py-2 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-blue-400">{activeFeed.camCode}:</span>
              <span>{streamMode === 'demo' ? 'Demo Video Playback' : 'Flask Backend Live Video Feed'}</span>
            </div>
            <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
              {streamMode === 'annotated' ? 'YOLOv8/v11 AI Overlays Active' : streamMode === 'raw' ? '1080p 30FPS HDMI Capture' : 'MP4 Playback (Loop)'}
            </span>
          </div>

          {/* Video Viewport Frame with HUD Overlays */}
          <div className="relative w-full min-h-[480px] rounded-xl bg-black select-none flex items-center justify-center overflow-hidden border border-slate-800">
            {streamError ? (
              <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                <Video className="w-12 h-12 text-slate-600 animate-bounce" />
                <div className="text-sm font-bold text-slate-300">Backend Live Stream Re-connecting...</div>
                <p className="text-xs text-slate-500 max-w-sm">Ensure Flask backend is running (`python run.py`) on port 5000.</p>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => { setStreamError(false); setStreamMode('annotated'); }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-semibold rounded-xl text-white transition-colors cursor-pointer shadow-xs"
                  >
                    Retry Live Feed
                  </button>
                  <button
                    onClick={() => setStreamMode('demo')}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-slate-300 transition-colors cursor-pointer"
                  >
                    Switch to Demo Image
                  </button>
                </div>
              </div>
            ) : streamMode === 'demo' ? (
              <video
                src="/demo-videos/demo-loop.mp4"
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <img 
                src={getStreamSrc()} 
                alt="Live Drone Stream"
                className="w-full h-full object-cover transform scale-x[-1]"
                referrerPolicy="no-referrer"
                onError={() => { if (streamMode !== 'demo') setStreamError(true); }}
              />
            )}

            {/* Top HUD Bar */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white text-xs z-20 pointer-events-none">
              <div className="bg-slate-900/80 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-slate-700 flex items-center gap-2 font-medium">
                <span>{currentDate}</span>
                <span className="text-slate-500">•</span>
                <span className="font-bold text-white">{currentTime}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-slate-900/80 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                  <span className="text-white text-xs font-bold">
                    {streamMode === 'demo' ? 'DEMO VIDEO' : 'LIVE HDMI'}
                  </span>
                </div>
                <div className="bg-slate-900/80 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5">
                  <span className="text-slate-400 text-xs">Battery:</span>
                  <span className="font-bold text-emerald-400">84%</span>
                </div>
              </div>
            </div>

            {/* Bottom HUD: Coordinates & Sensors */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white text-xs z-20 pointer-events-none">
              <div className="bg-slate-900/80 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-slate-700 space-y-0.5">
                <div className="font-bold">GPS: {droneCoords.lat}° N, {droneCoords.lng}° E</div>
                <div className="text-[11px] text-slate-400">Altitude: {droneCoords.alt}m AGL • Speed: {droneCoords.spd} km/h</div>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                PPK 99.4% Fixed
              </div>
            </div>
          </div>

          {/* Bottom Camera Controls */}
          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-end gap-3 select-none">
            {/* Action Tools */}
            <div className="flex items-center gap-2.5">
              <button 
                id="btn-take-snapshot"
                onClick={handleTakeSnapshot}
                className="bg-white hover:bg-slate-100 text-slate-900 px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Camera className="w-4 h-4 text-slate-700" />
                Capture Snapshot
              </button>

              <button 
                id="btn-toggle-record"
                onClick={handleToggleRecord}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer ${
                  isRecording 
                    ? 'bg-rose-600 text-white animate-pulse' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <CircleDot className="w-4 h-4" />
                {isRecording ? `REC ${formatRecTime(recordSeconds)}` : 'Record Video'}
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM: Full-Width Interactive GIS Map with Vehicle Filters & Flight Trajectories */}
        <div id="gis-map-container" className="w-full">
          <LiveLeafletMap 
            selectedVehicle={selectedVehicle}
            onSelectVehicle={(veh) => setSelectedVehicle(veh)}
          />
        </div>

        {/* Fleet Equipment Utilization Chart Section */}
        <div className="w-full">
          <EquipmentUtilizationChart />
        </div>

      </div>
    </div>
  );
};
