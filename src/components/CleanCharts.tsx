import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell
} from 'recharts';
import { 
  CHART_PROGRESS_DATA, 
  DAILY_PAVING_DATA, 
  PAVEMENT_LAYER_CHART_DATA, 
  EQUIPMENT_FLEET_DATA,
  CHAINAGE_QUALITY_DATA 
} from '../data/mockData';
import { TrendingUp, BarChart3, Layers, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

// Custom sleek tooltip for Cumulative Progress
const CustomProgressTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const planned = payload.find((p: any) => p.dataKey === 'planned')?.value;
    const actual = payload.find((p: any) => p.dataKey === 'actual')?.value;
    const diff = actual !== undefined && planned !== undefined ? (actual - planned).toFixed(1) : null;

    return (
      <div className="bg-slate-900/95 backdrop-blur-sm text-white p-3.5 rounded-xl shadow-xl border border-slate-800 text-xs min-w-[190px] animate-in fade-in zoom-in-95 duration-100">
        <div className="font-bold text-slate-200 border-b border-slate-800 pb-1.5 mb-2 flex items-center justify-between">
          <span>{label}</span>
          {diff !== null && (
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
              Number(diff) >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
            }`}>
              {Number(diff) >= 0 ? `+${diff}%` : `${diff}%`}
            </span>
          )}
        </div>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-300 capitalize">
                <span 
                  className="w-2.5 h-2.5 rounded-sm shrink-0" 
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}:
              </span>
              <span className="font-bold text-white">
                {entry.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// Custom sleek tooltip for Daily Paving
const CustomDailyTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-sm text-white p-3.5 rounded-xl shadow-xl border border-slate-800 text-xs min-w-[200px]">
        <div className="font-bold text-slate-200 border-b border-slate-800 pb-1.5 mb-2 flex items-center justify-between">
          <span>{label} ({data.date})</span>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
            data.efficiency >= 100 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'
          }`}>
            {data.efficiency}% Eff.
          </span>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-slate-300">
            <span>Actual Laid:</span>
            <span className="font-bold text-blue-400">{data.actualTons} Tons</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Planned Target:</span>
            <span className="font-semibold text-slate-400">{data.plannedTons} Tons</span>
          </div>
          <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800">
            <span>Linear Distance:</span>
            <span className="font-bold text-emerald-400">{data.linearMeters} Meters</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Layer Comparison
const CustomLayerTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-sm text-white p-3.5 rounded-xl shadow-xl border border-slate-800 text-xs min-w-[220px]">
        <div className="font-bold text-slate-200 border-b border-slate-800 pb-1.5 mb-2">
          {data.name}
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-slate-300">
            <span>Completed:</span>
            <span className="font-bold text-emerald-400">{data.actualKm} KM ({data.progressPercent}%)</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Target Length:</span>
            <span className="font-semibold text-slate-400">{data.targetKm} KM</span>
          </div>
          <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800">
            <span>Designed Thickness:</span>
            <span className="font-semibold text-slate-200">{data.thicknessMm} mm</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Custom Quality Tooltip
const CustomQualityTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-sm text-white p-3.5 rounded-xl shadow-xl border border-slate-800 text-xs min-w-[210px]">
        <div className="font-bold text-slate-200 border-b border-slate-800 pb-1.5 mb-2 flex items-center justify-between">
          <span>{data.chainage}</span>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded capitalize ${
            data.status === 'optimal' ? 'bg-emerald-500/20 text-emerald-300' :
            data.status === 'acceptable' ? 'bg-blue-500/20 text-blue-300' : 'bg-amber-500/20 text-amber-300'
          }`}>
            {data.status}
          </span>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-slate-300">
            <span>Field Density Test:</span>
            <span className="font-bold text-emerald-400">{data.fieldDensityTest}% (Pass)</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Delivery Temp:</span>
            <span className="font-bold text-amber-400">{data.pavingTemperature}°C</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Surface Roughness (IRI):</span>
            <span className="font-semibold text-slate-200">{data.iriSmoothness} mm/km</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * 1. Main Project Cumulative Progress & Breakdown Chart (Dashboard)
 */
export const CleanProgressChart: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cumulative' | 'daily' | 'breakdown'>('cumulative');

  return (
    <div className="flex flex-col h-full">
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              {activeTab === 'cumulative' && 'Planned vs Actual Progress Curve'}
              {activeTab === 'daily' && 'Daily Asphalt Paving Rate & Target'}
              {activeTab === 'breakdown' && 'Layer-Wise Pavement Cross-Section'}
            </h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
              Real-time Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeTab === 'cumulative' && 'Cumulative S-Curve tracking against project baseline schedule'}
            {activeTab === 'daily' && 'Daily metric tonnage laid vs 1,200 tons/day design quota'}
            {activeTab === 'breakdown' && 'Completion percentage across structural pavement layers'}
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl shrink-0 self-start sm:self-auto border border-slate-200/60">
          <button
            onClick={() => setActiveTab('cumulative')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'cumulative'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            S-Curve
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'daily'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daily Rate
          </button>
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'breakdown'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Layers
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="flex-1 w-full min-h-[290px] pt-2">
        {activeTab === 'cumulative' && (
          <ResponsiveContainer width="100%" height={290}>
            <AreaChart data={CHART_PROGRESS_DATA} margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
              <defs>
                <linearGradient id="actualProgressGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis 
                dataKey="week" 
                tickLine={false} 
                axisLine={{ stroke: '#cbd5e1' }}
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
              />
              <YAxis 
                domain={[0, 100]} 
                ticks={[0, 25, 50, 75, 100]} 
                tickFormatter={(val) => `${val}%`}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <Tooltip content={<CustomProgressTooltip />} />
              <Legend 
                verticalAlign="top" 
                align="right" 
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
              />
              <ReferenceLine y={68.4} stroke="#2563eb" strokeDasharray="3 3" strokeOpacity={0.4} />
              <Area
                type="monotone"
                dataKey="actual"
                name="Actual Progress"
                stroke="#2563eb"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#actualProgressGrad)"
                activeDot={{ r: 6, fill: '#2563eb', stroke: '#ffffff', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="planned"
                name="Planned Baseline"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3, fill: '#94a3b8', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'daily' && (
          <ResponsiveContainer width="100%" height={290}>
            <BarChart data={DAILY_PAVING_DATA} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis 
                dataKey="day" 
                tickLine={false} 
                axisLine={{ stroke: '#cbd5e1' }}
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={(val) => `${val}T`}
              />
              <Tooltip content={<CustomDailyTooltip />} />
              <Legend 
                verticalAlign="top" 
                align="right" 
                wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
              />
              <ReferenceLine y={1200} label={{ value: 'Target 1200T', fill: '#64748b', fontSize: 10, position: 'insideTopRight' }} stroke="#f59e0b" strokeDasharray="4 4" />
              <Bar 
                dataKey="plannedTons" 
                name="Planned (Tons)" 
                fill="#e2e8f0" 
                radius={[4, 4, 0, 0]} 
                barSize={20}
              />
              <Bar 
                dataKey="actualTons" 
                name="Actual Laid (Tons)" 
                fill="#2563eb" 
                radius={[4, 4, 0, 0]} 
                barSize={20}
              >
                {DAILY_PAVING_DATA.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.actualTons >= entry.plannedTons ? '#2563eb' : '#3b82f6'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'breakdown' && (
          <ResponsiveContainer width="100%" height={290}>
            <BarChart 
              data={PAVEMENT_LAYER_CHART_DATA} 
              layout="vertical"
              margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis 
                type="number" 
                domain={[0, 100]} 
                tickFormatter={(val) => `${val}%`}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <YAxis 
                type="category" 
                dataKey="shortName" 
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#334155', fontSize: 11, fontWeight: 600 }}
                width={85}
              />
              <Tooltip content={<CustomLayerTooltip />} />
              <Bar 
                dataKey="progressPercent" 
                name="Completion %" 
                radius={[0, 6, 6, 0]} 
                barSize={22}
              >
                {PAVEMENT_LAYER_CHART_DATA.map((entry, index) => (
                  <Cell key={`layer-cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Metric Quick Stats Bar */}
      <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span className="text-slate-500 font-medium block">Current Actual</span>
          <span className="text-base font-bold text-blue-600">68.4%</span>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span className="text-slate-500 font-medium block">Planned Target</span>
          <span className="text-base font-bold text-slate-800">72.0%</span>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span className="text-slate-500 font-medium block">Weekly Gain</span>
          <span className="text-base font-bold text-emerald-600">+4.2%</span>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span className="text-slate-500 font-medium block">Daily Avg Output</span>
          <span className="text-base font-bold text-slate-900">1,240 Tons</span>
        </div>
      </div>
    </div>
  );
};

/**
 * 2. Dedicated Cross-Section & Pavement Layers Chart (for ProgressView)
 */
export const LayerProgressDetailChart: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={PAVEMENT_LAYER_CHART_DATA} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis 
              dataKey="shortName" 
              tickLine={false} 
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={(val) => `${val} KM`}
              domain={[0, 20]}
            />
            <Tooltip content={<CustomLayerTooltip />} />
            <Legend 
              verticalAlign="top" 
              align="right" 
              wrapperStyle={{ paddingBottom: '8px', fontSize: '11px' }}
            />
            <Bar 
              dataKey="targetKm" 
              name="Design Length (KM)" 
              fill="#e2e8f0" 
              radius={[4, 4, 0, 0]} 
              barSize={24}
            />
            <Bar 
              dataKey="actualKm" 
              name="Completed Length (KM)" 
              fill="#2563eb" 
              radius={[4, 4, 0, 0]} 
              barSize={24}
            >
              {PAVEMENT_LAYER_CHART_DATA.map((entry, index) => (
                <Cell key={`bar-cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
        {PAVEMENT_LAYER_CHART_DATA.map((layer) => (
          <div key={layer.key} className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: layer.color }}></span>
              <span className="font-semibold text-slate-800 truncate">{layer.shortName}</span>
            </div>
            <div className="text-base font-bold text-slate-900">{layer.actualKm} / {layer.targetKm} KM</div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">{layer.progressPercent}% Finished</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 3. Equipment Fleet Utilization & Operating Hours Chart (for SiteIntelView)
 */
export const EquipmentUtilizationChart: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={EQUIPMENT_FLEET_DATA} margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis 
              dataKey="machineType" 
              tickLine={false} 
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={(val) => `${val}h`}
            />
            <Tooltip 
              formatter={(value: any, name: string) => [
                name === 'operationalHours' ? `${value} Hours Active` : `${value} Hours Idle`,
                name === 'operationalHours' ? 'Operational' : 'Standby'
              ]}
              contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
            />
            <Legend 
              verticalAlign="top" 
              align="right" 
              wrapperStyle={{ paddingBottom: '8px', fontSize: '11px' }}
            />
            <Bar 
              dataKey="operationalHours" 
              name="Active Working Hours" 
              fill="#059669" 
              radius={[4, 4, 0, 0]} 
              barSize={18}
            />
            <Bar 
              dataKey="idleHours" 
              name="Idle / Standby Hours" 
              fill="#f59e0b" 
              radius={[4, 4, 0, 0]} 
              barSize={18}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {EQUIPMENT_FLEET_DATA.map((item, idx) => (
          <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
            <span className="font-semibold text-slate-700 block truncate">{item.machineType}</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base font-bold text-slate-900">{item.activeCount}</span>
              <span className="text-[11px] text-slate-400">/{item.totalCount} deployed</span>
            </div>
            <div className="text-[11px] font-semibold text-emerald-600 mt-0.5">{item.productivityScore}% Productivity</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 4. Quality Field Density & Compaction Telemetry Chart (for SiteIntelView / AnalysisView)
 */
export const QualityComplianceTelemetryChart: React.FC = () => {
  return (
    <div className="h-[230px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={CHAINAGE_QUALITY_DATA} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis 
            dataKey="chainage" 
            tickLine={false} 
            axisLine={{ stroke: '#cbd5e1' }}
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
          />
          <YAxis 
            domain={[85, 100]} 
            ticks={[85, 90, 95, 100]}
            tickFormatter={(val) => `${val}%`}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
          />
          <Tooltip content={<CustomQualityTooltip />} />
          <ReferenceLine y={95} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Min Spec (95%)', fill: '#ef4444', fontSize: 10, position: 'insideBottomRight' }} />
          <Line
            type="monotone"
            dataKey="fieldDensityTest"
            name="Field Density Test (FDT %)"
            stroke="#059669"
            strokeWidth={3}
            dot={{ r: 5, fill: '#059669', stroke: '#ffffff', strokeWidth: 2 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
