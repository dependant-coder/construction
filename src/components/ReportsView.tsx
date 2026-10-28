import React, { useState } from 'react';
import { 
  Download, 
  Printer, 
  CheckCircle2, 
  FileText, 
  Building2, 
  Calendar, 
  Layers, 
  Plane, 
  HardHat, 
  ShieldCheck, 
  Compass, 
  BarChart3, 
  Activity, 
  Users, 
  Truck, 
  Clock, 
  AlertTriangle, 
  Sparkles,
  FileSpreadsheet,
  BadgeCheck
} from 'lucide-react';
import { CURRENT_PROJECT, INITIAL_KPI_DATA, SEGMENTS_DATA } from '../data/mockData';

export const ReportsView: React.FC = () => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activeReportTab, setActiveReportTab] = useState<'dpr' | 'flight-dossier' | 'ppe-audit'>('dpr');

  const handleDownload = (format: 'PDF' | 'Excel') => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  return (
    <div id="reports-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <FileText className="w-3.5 h-3.5" />
              Official Documentation & Engineering Dossier
            </span>
            <span className="text-xs text-slate-500 font-medium">MoRTH & NHAI Standard Formats</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Daily Progress & Survey Reports
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Complete executive DPR with UAV flight telemetry, physical statistics, and PPE kit compliance logs
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => window.print()}
            className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            Print Report
          </button>

          <button 
            onClick={() => handleDownload('Excel')}
            className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Export CSV / Excel
          </button>

          <button 
            onClick={() => handleDownload('PDF')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            Export PDF Dossier
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="bg-slate-900 text-white p-4 rounded-xl text-xs flex items-center gap-3 animate-in slide-in-from-top-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Official Detailed Progress Report & Flight Dossier PDF successfully generated and exported.</span>
        </div>
      )}

      {/* Report Section Navigation Tabs */}
      <div className="flex flex-wrap bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs gap-1">
        <button
          onClick={() => setActiveReportTab('dpr')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeReportTab === 'dpr'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          Executive Daily Progress Report (DPR)
        </button>

        <button
          onClick={() => setActiveReportTab('flight-dossier')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeReportTab === 'flight-dossier'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Plane className="w-4 h-4" />
          Flight Details & Geodetic Survey Dossier
        </button>

        <button
          onClick={() => setActiveReportTab('ppe-audit')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeReportTab === 'ppe-audit'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <HardHat className="w-4 h-4" />
          PPE Kit & EHS Safety Compliance Audit
        </button>
      </div>

      {/* TAB 1: EXECUTIVE DAILY PROGRESS REPORT */}
      {activeReportTab === 'dpr' && (
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/80 shadow-xs space-y-8 max-w-4xl mx-auto text-slate-900">
          {/* Official Document Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">National Highways Authority of India</span>
                <h2 className="text-lg font-bold text-slate-900">Daily Construction Progress Report (DPR)</h2>
                <p className="text-xs text-slate-500">{CURRENT_PROJECT.name} • 20.00 KM Access-Controlled Corridor</p>
              </div>
            </div>
            <div className="text-right text-xs">
              <div className="font-bold text-slate-900 text-sm">REF: DPR-2026-0822-FLT12</div>
              <div className="text-slate-500">Date: 22 August 2026</div>
              <div className="text-emerald-700 font-semibold mt-0.5 flex items-center justify-end gap-1">
                <BadgeCheck className="w-3.5 h-3.5" /> Authority Verified
              </div>
            </div>
          </div>

          {/* Project Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px] font-semibold uppercase">Project Name</span>
              <span className="font-bold text-slate-900">{CURRENT_PROJECT.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] font-semibold uppercase">Chainage Length</span>
              <span className="font-bold text-slate-900">KM 0+000 to KM 20+000 (20.0 KM)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] font-semibold uppercase">Contractor EPC</span>
              <span className="font-bold text-slate-900">{CURRENT_PROJECT.contractor}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] font-semibold uppercase">Cumulative Progress</span>
              <span className="font-bold text-blue-600 text-sm">{INITIAL_KPI_DATA.overallProgress}% Completed</span>
            </div>
          </div>

          {/* SECTION 1: Key Statistics Overview */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>1. Executive Progress & Construction Statistics</span>
              <span className="text-xs font-normal text-slate-500">Survey Delta: Flight #12 vs Flight #11</span>
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-1">
                <span className="text-slate-500 block text-xs font-semibold">Inter-Flight Delta</span>
                <span className="text-xl font-bold text-slate-900">+{INITIAL_KPI_DATA.flightChangePercent}%</span>
                <span className="text-xs text-blue-600 font-semibold block">+{INITIAL_KPI_DATA.flightPavedDeltaKm} KM Paved Gain</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-1">
                <span className="text-slate-500 block text-xs font-semibold">Corridor Paved</span>
                <span className="text-xl font-bold text-slate-900">13.68 / 20 KM</span>
                <span className="text-xs text-emerald-600 font-semibold block">68.4% Corridor Done</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-1">
                <span className="text-slate-500 block text-xs font-semibold">Workforce Deployed</span>
                <span className="text-xl font-bold text-slate-900">{INITIAL_KPI_DATA.peopleOnSite} People</span>
                <span className="text-xs text-slate-500 font-medium block">4 Shifts Active</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-1">
                <span className="text-slate-500 block text-xs font-semibold">Machinery On-Site</span>
                <span className="text-xl font-bold text-slate-900">{INITIAL_KPI_DATA.machinesActive} / {INITIAL_KPI_DATA.totalMachines} Active</span>
                <span className="text-xs text-emerald-600 font-semibold block">88.8% Fleet Utilization</span>
              </div>
            </div>

            {/* Material & Compaction Statistics Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden mt-3">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-3 font-semibold">Material / Work Item</th>
                    <th className="p-3 font-semibold text-center">Unit</th>
                    <th className="p-3 font-semibold text-right">Scope Total</th>
                    <th className="p-3 font-semibold text-right">Executed Cumulative</th>
                    <th className="p-3 font-semibold text-right">Gain This Flight</th>
                    <th className="p-3 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/60">
                    <td className="p-3 font-bold text-slate-900">Earthwork Excavation / Embankment</td>
                    <td className="p-3 text-center text-slate-500">m³</td>
                    <td className="p-3 text-right font-medium">350,000</td>
                    <td className="p-3 text-right font-bold text-slate-900">342,800</td>
                    <td className="p-3 text-right font-semibold text-blue-600">+14,800</td>
                    <td className="p-3 text-center"><span className="text-emerald-700 font-semibold">97.9%</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/60">
                    <td className="p-3 font-bold text-slate-900">Granular Sub-Base (GSB 150mm)</td>
                    <td className="p-3 text-center text-slate-500">m²</td>
                    <td className="p-3 text-right font-medium">180,000</td>
                    <td className="p-3 text-right font-bold text-slate-900">165,600</td>
                    <td className="p-3 text-right font-semibold text-blue-600">+8,200</td>
                    <td className="p-3 text-center"><span className="text-emerald-700 font-semibold">92.0%</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/60">
                    <td className="p-3 font-bold text-slate-900">Wet Mix Macadam (WMM 250mm)</td>
                    <td className="p-3 text-center text-slate-500">m²</td>
                    <td className="p-3 text-right font-medium">180,000</td>
                    <td className="p-3 text-right font-bold text-slate-900">146,520</td>
                    <td className="p-3 text-right font-semibold text-blue-600">+10,440</td>
                    <td className="p-3 text-center"><span className="text-emerald-700 font-semibold">81.4%</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/60">
                    <td className="p-3 font-bold text-slate-900">Dense Bituminous Macadam (DBM 75mm)</td>
                    <td className="p-3 text-center text-slate-500">MT</td>
                    <td className="p-3 text-right font-medium">32,500</td>
                    <td className="p-3 text-right font-bold text-slate-900">22,230</td>
                    <td className="p-3 text-right font-semibold text-blue-600">+4,850</td>
                    <td className="p-3 text-center"><span className="text-emerald-700 font-semibold">68.4%</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/60">
                    <td className="p-3 font-bold text-slate-900">Bituminous Concrete (BC 40mm Wearing)</td>
                    <td className="p-3 text-center text-slate-500">MT</td>
                    <td className="p-3 text-right font-medium">18,200</td>
                    <td className="p-3 text-right font-bold text-slate-900">7,553</td>
                    <td className="p-3 text-right font-semibold text-blue-600">+1,920</td>
                    <td className="p-3 text-center"><span className="text-blue-700 font-semibold">41.5%</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 2: Section Breakdown Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              2. Segment-wise Physical Progress & Quality Matrix
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <th className="p-3">Section</th>
                    <th className="p-3">Chainage</th>
                    <th className="p-3">Current Activity</th>
                    <th className="p-3 text-center">Workforce</th>
                    <th className="p-3 text-center">Machines</th>
                    <th className="p-3 text-right">Progress</th>
                    <th className="p-3 text-center">Quality Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {SEGMENTS_DATA.map((seg) => (
                    <tr key={seg.id} className="hover:bg-slate-50/60">
                      <td className="p-3 font-bold text-slate-900">{seg.name}</td>
                      <td className="p-3 text-slate-500">{seg.rangeKm}</td>
                      <td className="p-3 text-slate-700">{seg.currentActivity}</td>
                      <td className="p-3 text-center font-medium text-slate-800">{seg.workforce}</td>
                      <td className="p-3 text-center font-medium text-slate-800">{seg.activeMachinery}</td>
                      <td className="p-3 text-right font-bold text-slate-900">{seg.progress}%</td>
                      <td className="p-3 text-center font-bold text-emerald-700">{seg.qualityScore}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-6 text-xs">
            <div>
              <div className="h-10 border-b border-dashed border-slate-300 flex items-end pb-1 text-slate-900 font-bold">
                ✓ Glenn Maxwell
              </div>
              <span className="text-slate-500 block mt-1 font-medium">Project Director (Contractor)</span>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-300 flex items-end pb-1 text-slate-900 font-bold">
                ✓ Dr. V. K. Kulkarni
              </div>
              <span className="text-slate-500 block mt-1 font-medium">Chief Resident Engineer (NHAI)</span>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-300 flex items-end pb-1 text-slate-900 font-bold">
                ✓ Capt. R. Deshmukh
              </div>
              <span className="text-slate-500 block mt-1 font-medium">Chief Remote Pilot (DGCA #4412)</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FLIGHT DETAILS & GEODETIC SURVEY DOSSIER */}
      {activeReportTab === 'flight-dossier' && (
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/80 shadow-xs space-y-8 max-w-4xl mx-auto text-slate-900">
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                <Plane className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">Aerial Survey & Geodetics Division</span>
                <h2 className="text-lg font-bold text-slate-900">Drone Flight #12 Technical Survey Dossier</h2>
                <p className="text-xs text-slate-500">DJI Matrice 350 RTK (Drone 1) • Zenmuse P1 Full-Frame Payload</p>
              </div>
            </div>
            <div className="text-right text-xs">
              <div className="font-bold text-purple-700 text-sm">FLT-2026-0822-012</div>
              <div className="text-slate-500">Survey Date: 22 Aug 2026</div>
              <div className="text-emerald-700 font-semibold mt-0.5">PPK Fixed: 99.4%</div>
            </div>
          </div>

          {/* Drone 1 & Camera Specifications Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              1. UAV Platform & Camera Payload Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[11px] font-semibold uppercase">UAV Platform</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">Drone 1 (Matrice 350 RTK)</span>
                <span className="text-[11px] text-slate-500">DGCA UIN: UA-2026-9812</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[11px] font-semibold uppercase">Camera (Only Payload)</span>
                <span className="font-bold text-blue-600 text-sm mt-0.5 block">Cam 1 (Zenmuse P1)</span>
                <span className="text-[11px] text-slate-500">35mm Full-Frame 45 MP</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[11px] font-semibold uppercase">Ground Sample Distance</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">1.2 cm / pixel</span>
                <span className="text-[11px] text-slate-500">Flown @ 85m AGL Altitude</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[11px] font-semibold uppercase">Certified Pilot</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">Capt. R. Deshmukh</span>
                <span className="text-[11px] text-slate-500">DGCA RPC License #4412</span>
              </div>
            </div>
          </div>

          {/* Mission Parameters & Photogrammetry Telemetry */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              2. Flight Mission Telemetry & Photogrammetric Parameters
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
                <span className="font-bold text-slate-900 block text-xs">Flight Window & Duration</span>
                <div className="flex justify-between text-slate-600">
                  <span>Takeoff Time:</span>
                  <span className="font-bold text-slate-900">10:45:10 AM</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Touchdown Time:</span>
                  <span className="font-bold text-slate-900">11:38:18 AM</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total Airborne Time:</span>
                  <span className="font-bold text-purple-700">53 Minutes 08 Sec</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
                <span className="font-bold text-slate-900 block text-xs">Overlap & Image Collection</span>
                <div className="flex justify-between text-slate-600">
                  <span>Forward / Side Overlap:</span>
                  <span className="font-bold text-slate-900">80% / 75%</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>RAW Images Captured:</span>
                  <span className="font-bold text-slate-900">1,420 Photos (100%)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Camera Trigger Accuracy:</span>
                  <span className="font-bold text-emerald-700">TimeSync 2.0 (±1 ms)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
                <span className="font-bold text-slate-900 block text-xs">PPK Solution & CORS Base</span>
                <div className="flex justify-between text-slate-600">
                  <span>CORS Base Station:</span>
                  <span className="font-bold text-slate-900">SOI PUNE01 (4.2 KM)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Carrier Phase Fix Rate:</span>
                  <span className="font-bold text-emerald-700">99.4% Fixed (12,405 ep)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Horizontal / Vertical RMSE:</span>
                  <span className="font-bold text-slate-900">11.4 mm / 14.1 mm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Inter-Flight Progress Comparison */}
          <div className="p-4.5 rounded-xl border border-purple-200 bg-purple-50/50 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-purple-900">
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-700" />
                Inter-Flight Orthomosaic Delta (Flight #12 vs Flight #11)
              </span>
              <span className="text-purple-700 font-bold">+5.8% Progress Gain</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Comparison between Flight #11 (flown 15 Aug 2026) and Flight #12 (flown 22 Aug 2026) confirms an additional +1.16 KM of Dense Bituminous Macadam (DBM) layer laid in Segment 2 and +14,800 m³ of hill cutting completed in Segment 3.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: PPE KIT & EHS SAFETY COMPLIANCE AUDIT */}
      {activeReportTab === 'ppe-audit' && (
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/80 shadow-xs space-y-8 max-w-4xl mx-auto text-slate-900">
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                <HardHat className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Environment, Health & Safety (EHS) Audit</span>
                <h2 className="text-lg font-bold text-slate-900">Daily PPE Kit Compliance & Safety Inspection</h2>
                <p className="text-xs text-slate-500">Automated Computer Vision PPE Scan from Drone 1 & Site Mast Cameras</p>
              </div>
            </div>
            <div className="text-right text-xs">
              <div className="font-bold text-emerald-700 text-sm">97.8% PPE Compliance</div>
              <div className="text-slate-500">Audit Date: 22 Aug 2026</div>
              <div className="text-emerald-700 font-semibold mt-0.5">420 Safe Work Days (Zero LTI)</div>
            </div>
          </div>

          {/* PPE Compliance Rate Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-center space-y-1">
              <span className="text-slate-400 block text-[11px] font-semibold">Safety Helmets</span>
              <span className="text-lg font-bold text-emerald-700">100%</span>
              <span className="text-[11px] text-slate-500 block">147 / 147</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-center space-y-1">
              <span className="text-slate-400 block text-[11px] font-semibold">High-Vis Vests</span>
              <span className="text-lg font-bold text-emerald-700">98.6%</span>
              <span className="text-[11px] text-slate-500 block">145 / 147</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-center space-y-1">
              <span className="text-slate-400 block text-[11px] font-semibold">Safety Boots</span>
              <span className="text-lg font-bold text-emerald-700">100%</span>
              <span className="text-[11px] text-slate-500 block">147 / 147</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-center space-y-1">
              <span className="text-slate-400 block text-[11px] font-semibold">Safety Glasses</span>
              <span className="text-lg font-bold text-emerald-700">96.6%</span>
              <span className="text-[11px] text-slate-500 block">142 / 147</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-center space-y-1">
              <span className="text-slate-400 block text-[11px] font-semibold">Fall Harnesses</span>
              <span className="text-lg font-bold text-emerald-700">100%</span>
              <span className="text-[11px] text-slate-500 block">18 / 18 (Viaduct)</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-center space-y-1">
              <span className="text-slate-400 block text-[11px] font-semibold">Ear Defenders</span>
              <span className="text-lg font-bold text-emerald-700">100%</span>
              <span className="text-[11px] text-slate-500 block">28 / 28 (Paving)</span>
            </div>
          </div>

          {/* AI PPE Detection Log */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              1. Automated Computer Vision Safety Observations
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Sensor Source</th>
                    <th className="p-3">Corridor Location</th>
                    <th className="p-3">Observation Detail</th>
                    <th className="p-3 text-center">Severity</th>
                    <th className="p-3 text-right">Resolution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/60">
                    <td className="p-3 font-semibold text-slate-900">10:14 AM</td>
                    <td className="p-3 text-slate-600">Cam 1 (Drone 1 Aerial)</td>
                    <td className="p-3 text-slate-600">KM 12+400 (Segment 2)</td>
                    <td className="p-3 text-slate-800">2 workers observed with unzipped reflective vests during batch unloading</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700">Low</span>
                    </td>
                    <td className="p-3 text-right font-semibold text-emerald-700">Corrected on spot (10:17 AM)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60">
                    <td className="p-3 font-semibold text-slate-900">09:30 AM</td>
                    <td className="p-3 text-slate-600">Cam 4 (Corridor CCTV)</td>
                    <td className="p-3 text-slate-600">KM 14+800 (Interchange)</td>
                    <td className="p-3 text-slate-800">Traffic divergence zone retro-reflective cone displacement by haul truck</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700">Advisory</span>
                    </td>
                    <td className="p-3 text-right font-semibold text-emerald-700">Re-aligned by Safety Marshall</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60">
                    <td className="p-3 font-semibold text-slate-900">08:00 AM</td>
                    <td className="p-3 text-slate-600">Site Safety Gate</td>
                    <td className="p-3 text-slate-600">Base Camp & Lab</td>
                    <td className="p-3 text-slate-800">Morning Tool Box Talk & PPE kit verification for 147 personnel</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700">Passed</span>
                    </td>
                    <td className="p-3 text-right font-semibold text-emerald-700">100% Signoff Recorded</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* EHS Safety Signatures */}
          <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-8 text-xs">
            <div>
              <div className="h-10 border-b border-dashed border-slate-300 flex items-end pb-1 text-slate-900 font-bold">
                ✓ S. K. Mahajan (EHS Lead Safety Officer)
              </div>
              <span className="text-slate-500 block mt-1 font-medium">Certified Lead Safety Auditor</span>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-300 flex items-end pb-1 text-slate-900 font-bold">
                ✓ Dr. V. K. Kulkarni (Chief Resident Engineer)
              </div>
              <span className="text-slate-500 block mt-1 font-medium">Authority Engineer EHS Signoff</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
