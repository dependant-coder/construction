import React, { useState } from 'react';
import { Layers, MapPin, CheckCircle2, TrendingUp, Users, Truck, ShieldCheck } from 'lucide-react';
import { SEGMENTS_DATA } from '../data/mockData';
import { LayerProgressDetailChart, QualityComplianceTelemetryChart } from './CleanCharts';

export const ProgressView: React.FC = () => {
  const layersList = [
    { id: 'subgrade', name: 'Subgrade & Earthwork', target: '20.0 KM', actual: '19.4 KM', progress: 97, color: 'bg-emerald-600' },
    { id: 'gsb', name: 'Granular Sub-Base (GSB)', target: '20.0 KM', actual: '18.2 KM', progress: 91, color: 'bg-blue-600' },
    { id: 'wmm', name: 'Wet Mix Macadam (WMM)', target: '20.0 KM', actual: '16.1 KM', progress: 81, color: 'bg-indigo-600' },
    { id: 'dbm', name: 'Bituminous Base (DBM)', target: '20.0 KM', actual: '13.6 KM', progress: 68, color: 'bg-amber-500' },
    { id: 'bc', name: 'Asphalt Surface Course', target: '20.0 KM', actual: '8.4 KM', progress: 42, color: 'bg-slate-700' }
  ];

  return (
    <div id="progress-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
              <MapPin className="w-3 h-3" />
              KM 0 to KM 20
            </span>
            <span className="text-xs text-slate-500 font-medium">Maharashtra Corridor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Pavement Construction Progress
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Layer-by-layer progress tracking across all 20 kilometers
          </p>
        </div>

        <div className="flex items-center gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100 shrink-0">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Total Length</span>
            <div className="text-xl font-bold text-slate-900">20.0 KM</div>
          </div>
          <div className="border-l border-slate-200 pl-6">
            <span className="text-xs font-semibold text-slate-500 block">Target Completion</span>
            <div className="text-xl font-bold text-slate-900">15 Dec 2026</div>
          </div>
        </div>
      </div>

      {/* Layer-by-Layer Progress Chart & Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Pavement Cross-Section Completion (KM vs Design Target)
              </h2>
              <p className="text-xs text-slate-500">Precise layer-wise length achieved across the 20.0 KM corridor</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            All 5 Layers Active
          </span>
        </div>

        {/* Clean Interactive Bar Chart */}
        <LayerProgressDetailChart />
      </div>

      {/* Quality Telemetry & Compaction Compliance Graph */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Quality Telemetry: Field Density Test Pass Rate (% FDT)
              </h2>
              <p className="text-xs text-slate-500">Nuclear density gauge & core sample pass rates along chainage points</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500 font-medium">Compliance Threshold:</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
              ≥ 95.0%
            </span>
          </div>
        </div>

        <QualityComplianceTelemetryChart />
      </div>

      {/* Detailed Segment Cards Grid with Fake Geotag Map Images */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Highway Section Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SEGMENTS_DATA.map((seg) => (
            <div 
              key={seg.id} 
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              {/* Geotag Map Thumbnail Image */}
              <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                <img 
                  src={seg.mapImageUrl || "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop"} 
                  alt={seg.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Geotag Badge */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg shadow-sm border border-slate-200 text-[11px] font-semibold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{seg.gpsCoords}</span>
                </div>

                {/* Range Tag */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <span className="font-bold text-sm">{seg.name}</span>
                  <span className="text-xs bg-black/50 px-2 py-0.5 rounded-full font-semibold">
                    {seg.rangeKm}
                  </span>
                </div>
              </div>

              {/* Segment Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-slate-900">{seg.progress}%</span>
                    <span className="text-xs text-slate-500 font-medium">Completed</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                    {seg.currentActivity}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      Workforce:
                    </span>
                    <span className="font-semibold text-slate-900">{seg.workforce} People</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-slate-400" />
                      Equipment:
                    </span>
                    <span className="font-semibold text-slate-900">{seg.activeMachinery} Active Units</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Quality Pass:
                    </span>
                    <span className="font-semibold text-emerald-700">{seg.qualityScore}% Passed</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

