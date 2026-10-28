import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  Truck,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  MapPin,
  ChevronRight,
  Compass,
  Plane,
  Calendar
} from 'lucide-react';
import {
  ProjectPackage,
  KpiData,
  OperationalAlert,
  SegmentInfo
} from '../types';
import {
  SEGMENTS_DATA
} from '../data/mockData';
import { CleanProgressChart } from './CleanCharts';
import { ALIGNMENT_SECTORS } from './LiveLeafletMap';

interface DashboardViewProps {
  currentProject: ProjectPackage;
  kpiData: KpiData;
  alerts: OperationalAlert[];
  onStartLiveView: () => void;
  onCompareDates: () => void;
  onGenerateReport: () => void;
  onOpenAlertsModal: () => void;
  onSelectSegment: (segment: SegmentInfo) => void;
  selectedDate: string;
  onChangeDate: (date: string) => void;
  onViewCaptures: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentProject,
  kpiData,
  alerts,
  onStartLiveView,
  onCompareDates,
  onGenerateReport,
  onOpenAlertsModal,
  onSelectSegment,
  selectedDate,
  onChangeDate,
  onViewCaptures
}) => {
  const [selectedSectorId, setSelectedSectorId] = useState<string>('sec-3');

  const handleSectorClick = (secId: string) => {
    setSelectedSectorId(secId);
    const mappedSeg = SEGMENTS_DATA.find(s => s.id === (secId === 'sec-1' ? 'seg-1' : secId === 'sec-2' ? 'seg-2' : 'seg-3'));
    if (mappedSeg) {
      onSelectSegment(mappedSeg);
    }
  };

  return (
    <div id="dashboard-view-container" className="space-y-6 animate-in fade-in duration-200">

      {/* 1. TOP EXECUTIVE HEADER BANNER */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              {currentProject.name}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Autonomous Survey Active
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Ref: NHAI/EPC/2026/PKG-04
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Construction Command & Survey Dashboard
          </h1>
          <p className="text-sm text-slate-500 max-w-3xl leading-relaxed">
            Corridor Chainage KM 0+000 to KM 20+000 • Autonomous UAV Photogrammetry & Machine Telemetry Stream
          </p>
        </div>

        <div className="flex items-center gap-3 lg:justify-end shrink-0">
          <label htmlFor="dashboard-metrics-date" className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Calendar className="w-4 h-4 text-blue-600" />
            Metrics for:
          </label>
          <input
            id="dashboard-metrics-date"
            type="date"
            value={selectedDate}
            onChange={(e) => onChangeDate(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

      </div>

      {/* 2. SIX STANDARDIZED KPI METRIC CARDS (Equal Heights & Optical Alignments) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">

        {/* Metric 1: Overall Physical Progress */}
        <div
          id="kpi-card-overall-progress"
          className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-blue-300/80 transition-all group"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Physical Progress</span>
              <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {kpiData.overallProgress}%
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <span>+{kpiData.progressDiffWeek}% this week</span>
            </div>
          </div>

          <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
              On Schedule
            </span>
            <span className="text-slate-400 font-medium">Target: 72.0%</span>
          </div>
        </div>

        {/* Metric 2: Completed Today */}
        <div
          id="kpi-card-work-today"
          className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-emerald-300/80 transition-all group"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Paved Today</span>
              <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-baseline gap-1">
              {kpiData.workCompletedTodayKm} <span className="text-xs font-bold text-slate-400">KM</span>
            </div>
            <div className="text-[11px] font-semibold text-slate-500 mt-1">
              +{kpiData.workCompletedTodayMeters}m linear asphalt
            </div>
          </div>

          <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">Active Layer</span>
            <span className="font-bold text-slate-800">DBM 75mm</span>
          </div>
        </div>

        {/* Metric 3: Workforce on Site */}
        <div
          id="kpi-card-people-site"
          className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-indigo-300/80 transition-all group"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Site Workforce</span>
              <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Users className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-baseline gap-1">
              {kpiData.peopleOnSite} <span className="text-xs font-normal text-slate-400">pers.</span>
            </div>
            <div className="text-[11px] font-semibold text-emerald-600 mt-1">
              +{kpiData.peopleDiffYesterday} from yesterday
            </div>
          </div>

          <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">PPE Compliance</span>
            <span className="font-bold text-emerald-700">97.8%</span>
          </div>
        </div>

        {/* Metric 4: Active Fleet Utilization */}
        <div
          id="kpi-card-machines-active"
          className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-amber-300/80 transition-all group"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Machinery Fleet</span>
              <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Truck className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-baseline gap-1">
              {kpiData.machinesActive} <span className="text-xs font-normal text-slate-400">/ {kpiData.totalMachines}</span>
            </div>
            <div className="text-[11px] font-semibold text-slate-500 mt-1 truncate">
              {kpiData.idleMachinesNote}
            </div>
          </div>

          <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">CANbus Fleet</span>
            <span className="font-bold text-emerald-700">88.8% Active</span>
          </div>
        </div>

        {/* Metric 5: Active Operational Alerts */}
        <div
          id="kpi-card-critical-alerts"
          className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-amber-300/80 transition-all cursor-pointer group"
          onClick={onOpenAlertsModal}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Site Notices</span>
              <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-baseline gap-1">
              {kpiData.criticalAlertsCount} <span className="text-xs font-bold text-amber-600">Active</span>
            </div>
            <div className="text-[11px] font-semibold text-amber-600 mt-1 truncate">
              {kpiData.criticalAlertsSeverity} priority item
            </div>
          </div>

          <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="font-bold text-blue-600 group-hover:underline flex items-center gap-1">
              Review details <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Metric 6: UAV Survey Status & Accuracy */}
        <div
          id="kpi-card-drone-survey"
          className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-blue-300/80 transition-all group"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Drone 1 Flight</span>
              <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Plane className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {kpiData.lastDroneSurveyTime}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 mt-1 truncate">
              Flight #12 ({kpiData.lastDroneSurveyDate})
            </div>
          </div>

          <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              PPK Fixed
            </span>
            <span className="text-slate-400 font-medium">GSD: 1.2cm</span>
          </div>
        </div>
      </div>

      {/* 3. 20-KM CORRIDOR LINEAR STRIP & SECTOR QUICK SELECTOR */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">
              20.00 KM Corridor Linear Chainage & Pavement Layer Architecture
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Total Paved: <strong className="text-slate-900">13.68 KM</strong> / 20.00 KM (68.4%)
          </span>
        </div>

        {/* 5-Sector Grid Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
          {ALIGNMENT_SECTORS.map((sec, idx) => {
            const isSelected = selectedSectorId === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => handleSectorClick(sec.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${isSelected
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-2 ring-blue-600/15'
                    : 'border-slate-200/90 bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-300'
                  }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-slate-900">
                      KM {idx * 4}–{(idx + 1) * 4}
                    </span>
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: sec.color }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium line-clamp-1">
                    {sec.layerType}
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                  <span className="font-bold text-slate-700">{sec.progress}%</span>
                  <span className={`font-semibold ${isSelected ? 'text-blue-700' : 'text-slate-500'}`}>
                    {sec.densityAchieved}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. MAIN WORKSPACE: PROGRESS CHART & SITE ALERTS (Side-by-Side Cards) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">

        {/* Progress Chart Card */}
        <div
          id="progress-chart-card"
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs"
        >
          <CleanProgressChart />
        </div>

        {/* Operational Site Alerts Card */}
        <div
          id="recent-alerts-card"
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs"
        >
          <div className="flex justify-between items-center pb-3.5 border-b border-slate-100 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Active Site Observations & Alerts
              </h2>
              <p className="text-xs text-slate-500">
                Automated computer vision & engineering telemetry notices
              </p>
            </div>
            <button
              id="btn-view-all-alerts"
              onClick={onOpenAlertsModal}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
            >
              View all ({alerts.length})
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {alerts.slice(0, 2).map((alert) => (
              <div
                key={alert.id}
                className="flex gap-3.5 items-start p-4 rounded-xl bg-slate-50/80 hover:bg-slate-100/90 border border-slate-100 transition-all cursor-pointer group"
                onClick={onOpenAlertsModal}
              >
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 truncate">
                      {alert.title}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium shrink-0">{alert.timeAgo}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                    {alert.description}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{alert.location}</span>
                    </div>
                    <span className="text-[11px] font-bold text-blue-600 group-hover:underline">
                      Take Action →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onViewCaptures}
            className="w-full mt-2 flex items-center justify-center gap-2 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl px-4 py-2.5 transition-colors cursor-pointer"
          >
            View captures from {selectedDate}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
