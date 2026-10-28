import React, { useState } from 'react';
import { 
  Radio, 
  Battery, 
  Server,
  Settings,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const [drones, setDrones] = useState([
    { id: 'DR-01', model: 'Aerial Drone Alpha (RTK 4K)', battery: 68, status: 'In-Flight', lat: '18.5241', lng: '73.8567', rtkAccuracy: '1.2 cm', firmware: 'v4.8.2' },
    { id: 'DR-02', model: 'Aerial Drone Beta (Docking Station)', battery: 98, status: 'Standby Dock #1', lat: '18.5385', lng: '73.8420', rtkAccuracy: '0.9 cm', firmware: 'v4.8.2' }
  ]);

  const [nfcGates, setNfcGates] = useState([
    { id: 'GATE-01', name: 'Main Camp Entrance Turnstile', scansToday: 88, status: 'Online' },
    { id: 'GATE-02', name: 'Plant Section Gate Reader', scansToday: 59, status: 'Online' }
  ]);

  return (
    <div id="admin-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
              <Settings className="w-3 h-3" />
              Equipment & Devices
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Drone Fleet & Site Readers
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Status and telemetry configuration for aerial drones and entry gates
          </p>
        </div>
      </div>

      {/* Drone Fleet Management Cards */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Survey Drone Fleet</h2>
              <p className="text-xs text-slate-500">Autonomous flight and camera transponders</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            2 / 2 Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {drones.map((drone) => (
            <div key={drone.id} className="p-5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between hover:bg-slate-100/60 transition-colors">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{drone.id} — {drone.model}</h3>
                    <span className="text-xs text-slate-500">Firmware: {drone.firmware}</span>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    drone.status === 'In-Flight' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {drone.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mt-4 border-t border-slate-200/60 pt-3">
                  <div className="flex items-center gap-1.5">
                    <Battery className="w-3.5 h-3.5 text-slate-500" />
                    <span>Battery: <strong className="text-slate-900">{drone.battery}%</strong></span>
                  </div>
                  <div>GPS Accuracy: <strong className="text-slate-900">{drone.rtkAccuracy}</strong></div>
                  <div>Lat: <span className="text-slate-500">{drone.lat}° N</span></div>
                  <div>Lng: <span className="text-slate-500">{drone.lng}° E</span></div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex gap-2">
                <button className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold py-2 rounded-lg transition-colors cursor-pointer shadow-2xs">
                  Run Diagnostic
                </button>
                <button className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-2xs">
                  Calibrate GPS
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workforce Entry Gate Readers */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Workforce Gate Readers</h2>
              <p className="text-xs text-slate-500">NFC entrance turnstiles and scanners</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nfcGates.map((gate) => (
            <div key={gate.id} className="p-4.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{gate.name}</h3>
                <div className="text-xs text-slate-500 mt-0.5">Scanned Today: <strong className="text-slate-900">{gate.scansToday} Workers</strong></div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                {gate.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

