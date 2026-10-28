import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Download, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  MapPin
} from 'lucide-react';
import { OperationalAlert, SegmentInfo } from '../types';
import { imgRoadAerial, imgHighwayEarthwork } from '../data/mockData';

interface CompareDatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompareDatesModal: React.FC<CompareDatesModalProps> = ({ isOpen, onClose }) => {
  const [dateA, setDateA] = useState('2026-07-15');
  const [dateB, setDateB] = useState('2026-08-22');
  const [sliderPos, setSliderPos] = useState(50);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white max-w-3xl w-full p-6 rounded-2xl border border-slate-200 shadow-xl space-y-5 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Compare Dates</h2>
              <p className="text-xs text-slate-500">Visual before/after comparison</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Date Selectors */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <label className="block text-slate-500 font-semibold text-xs mb-1.5">First Date</label>
            <input 
              type="date" 
              value={dateA} 
              onChange={(e) => setDateA(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
            <span className="text-xs text-slate-500 mt-2 block font-medium">54% Progress Recorded</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <label className="block text-slate-500 font-semibold text-xs mb-1.5">Second Date</label>
            <input 
              type="date" 
              value={dateB} 
              onChange={(e) => setDateB(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
            <span className="text-xs text-blue-600 mt-2 block font-semibold">68% Progress (+14% Gain)</span>
          </div>
        </div>

        {/* Interactive Comparison Split Image */}
        <div className="relative w-full h-64 rounded-xl border border-slate-200 overflow-hidden select-none bg-slate-900">
          <img 
            src={imgRoadAerial} 
            alt="Current Paved"
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-lg">
            22 Aug 2026
          </div>

          <div 
            className="absolute inset-0 overflow-hidden" 
            style={{ width: `${sliderPos}%` }}
          >
            <img 
              src={imgHighwayEarthwork} 
              alt="Past Base"
              className="absolute inset-0 w-full h-full object-cover max-w-none"
              style={{ width: '100%', minWidth: '600px' }}
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-lg">
              15 Jul 2026
            </div>
          </div>

          <div 
            className="absolute top-0 bottom-0 w-[2px] bg-white cursor-ew-resize flex items-center justify-center shadow-md"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="w-7 h-7 bg-white text-slate-800 rounded-full shadow-lg flex items-center justify-center text-xs font-bold">
              ↔
            </div>
          </div>

          <input 
            type="range" 
            min="0" 
            max="100" 
            value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
          />
        </div>

        {/* Summary Delta Badges */}
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 block text-xs font-medium">Road Paved</span>
            <span className="font-bold text-slate-900 text-base mt-0.5 block">+2.84 KM</span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 block text-xs font-medium">Earthwork</span>
            <span className="font-bold text-slate-900 text-base mt-0.5 block">+18,400 M³</span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 block text-xs font-medium">Schedule Impact</span>
            <span className="font-bold text-emerald-700 text-base mt-0.5 block">On Track</span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
            Close
          </button>
          <button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs">
            <Download className="w-4 h-4" />
            Export Comparison
          </button>
        </div>
      </div>
    </div>
  );
};

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const GenerateReportModal: React.FC<GenerateReportModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [includePhotogrammetry, setIncludePhotogrammetry] = useState(true);
  const [includeMachinery, setIncludeMachinery] = useState(true);
  const [includeQualityCompliance, setIncludeQualityCompliance] = useState(true);
  const [includeFlightDetails, setIncludeFlightDetails] = useState(true);
  const [includePpeCompliance, setIncludePpeCompliance] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onConfirm();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white max-w-md w-full p-6 rounded-2xl border border-slate-200 shadow-xl space-y-5 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Export Detailed Report</h2>
              <p className="text-xs text-slate-500">Configure parameters for comprehensive DPR & Dossier</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Generate an official Daily Progress Report with drone flight parameters, physical progress statistics, and PPE kit compliance logs.
        </p>

        <div className="space-y-2 text-xs">
          <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100/60 transition-colors">
            <input 
              type="checkbox" 
              checked={includeFlightDetails} 
              onChange={(e) => setIncludeFlightDetails(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="font-semibold text-slate-800 text-xs">Drone 1 Flight Details & PPK Geodetics</span>
          </label>

          <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100/60 transition-colors">
            <input 
              type="checkbox" 
              checked={includePpeCompliance} 
              onChange={(e) => setIncludePpeCompliance(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="font-semibold text-slate-800 text-xs">PPE Kit & EHS Safety Compliance Audit</span>
          </label>

          <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100/60 transition-colors">
            <input 
              type="checkbox" 
              checked={includePhotogrammetry} 
              onChange={(e) => setIncludePhotogrammetry(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="font-semibold text-slate-800 text-xs">Drone Photos & Orthomosaic Delta Map</span>
          </label>

          <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100/60 transition-colors">
            <input 
              type="checkbox" 
              checked={includeMachinery} 
              onChange={(e) => setIncludeMachinery(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="font-semibold text-slate-800 text-xs">Machinery Telemetry & CANbus Hours</span>
          </label>

          <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100/60 transition-colors">
            <input 
              type="checkbox" 
              checked={includeQualityCompliance} 
              onChange={(e) => setIncludeQualityCompliance(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="font-semibold text-slate-800 text-xs">Quality Testing & Compaction Density</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
            Cancel
          </button>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2.5 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            {isGenerating ? (
              <>Generating...</>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Generate PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

interface AlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: OperationalAlert[];
  onResolveAlert: (id: string) => void;
}

export const AlertsModal: React.FC<AlertsModalProps> = ({ isOpen, onClose, alerts, onResolveAlert }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white max-w-2xl w-full p-6 rounded-2xl border border-slate-200 shadow-xl space-y-5 animate-in zoom-in-95 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Site Alerts</h2>
              <p className="text-xs text-slate-500">Active alerts requiring attention</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {alerts.map((alert) => (
            <div key={alert.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                    alert.severity === 'critical' ? 'bg-rose-100 text-rose-700' :
                    alert.severity === 'warning' ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {alert.severity.toUpperCase()}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900">{alert.title}</h3>
                  <span className="text-xs text-slate-400">• {alert.timeAgo}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{alert.description}</p>
                <div className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {alert.location}
                </div>
              </div>

              <button 
                onClick={() => onResolveAlert(alert.id)}
                className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors shrink-0 flex items-center gap-1.5 self-start sm:self-center cursor-pointer shadow-2xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Resolve
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button onClick={onClose} className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-2xs">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

interface SegmentModalProps {
  segment: SegmentInfo | null;
  onClose: () => void;
}

export const SegmentModal: React.FC<SegmentModalProps> = ({ segment, onClose }) => {
  if (!segment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white max-w-lg w-full p-6 rounded-2xl border border-slate-200 shadow-xl space-y-5 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{segment.name} ({segment.rangeKm})</h2>
              <p className="text-xs text-slate-500">Highway Section Inspection</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 block text-xs font-semibold">Physical Progress</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">{segment.progress}%</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 block text-xs font-semibold">Quality Score</span>
            <span className="text-2xl font-bold text-emerald-700 mt-1 block">{segment.qualityScore}%</span>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Layer Completion</h3>
          <div className="space-y-1.5">
            {segment.completedLayers.map((layer, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <span className="text-slate-700 font-medium">{layer.split(' (')[0]}</span>
                <span className="font-bold text-slate-900">
                  {layer.split(' (')[1]?.replace(')', '') || '100%'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
          <span className="text-slate-500 block text-xs font-semibold">Active Work</span>
          <p className="text-slate-900 font-bold text-sm">{segment.currentActivity}</p>
          <div className="flex gap-4 pt-1 text-xs text-slate-500">
            <span>Workforce: <strong>{segment.workforce} Workers</strong></span>
            <span>Machinery: <strong>{segment.activeMachinery} Units</strong></span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button onClick={onClose} className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 text-xs font-semibold rounded-xl cursor-pointer transition-colors shadow-2xs">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

interface NewFlightSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionCreated?: (session: any) => void;
}

export const NewFlightSessionModal: React.FC<NewFlightSessionModalProps> = ({
  isOpen,
  onClose,
  onSessionCreated
}) => {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [todayStr] = useState(() => new Date().toISOString().split('T')[0]);
  const [timeStr] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { ApiService } = await import('../services/api');
      const session = await ApiService.createFlightSession({
        name: name.trim() || undefined,
        notes: notes.trim() || undefined,
        date: todayStr
      });
      if (onSessionCreated) onSessionCreated(session);
      onClose();
    } catch (err) {
      console.error('Failed to create flight session:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white max-w-md w-full p-6 rounded-2xl border border-slate-200 shadow-xl space-y-5 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Start New Drone Flight</h2>
              <p className="text-xs text-slate-500">Create session for today's flight analytics</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Flight Date</label>
              <input 
                type="date" 
                value={todayStr} 
                readOnly
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-semibold cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Start Time</label>
              <input 
                type="text" 
                value={timeStr} 
                readOnly
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-semibold cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Flight Name (Optional)</label>
            <input 
              type="text"
              placeholder="e.g. Flight #2 — Morning Survey"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">Leave empty to auto-generate (Flight #1, #2, etc.)</span>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Notes / Description (Optional)</label>
            <textarea 
              rows={2}
              placeholder="e.g. Inspecting KM 12+400 personnel PPE compliance"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-xs font-semibold rounded-xl cursor-pointer transition-colors shadow-2xs flex items-center gap-2"
            >
              {loading ? 'Creating...' : 'Launch Flight Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


