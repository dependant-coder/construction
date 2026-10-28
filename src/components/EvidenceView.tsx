import React, { useState } from 'react';
import { Download, Eye, MapPin, Calendar, Layers, Image as ImageIcon } from 'lucide-react';
import { EVIDENCE_GALLERY, imgRoadAerial, imgHighwayEarthwork } from '../data/mockData';

export const EvidenceView: React.FC = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const [selectedSurvey, setSelectedSurvey] = useState(EVIDENCE_GALLERY[0]);

  return (
    <div id="evidence-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
              <ImageIcon className="w-3 h-3" />
              Site Imagery & Media
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Aerial & Site Media Gallery
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Geotagged site surveys, aerial photographs, and progress timeline records
          </p>
        </div>

        <button className="bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-xs self-start sm:self-auto cursor-pointer">
          <Download className="w-4 h-4" />
          Download All Media (1.2 GB)
        </button>
      </div>

      {/* Before / After Comparison Slider */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Progress Comparison: KM 12+400
            </h2>
            <p className="text-xs text-slate-500">Compare site state between survey dates</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="bg-slate-100 text-slate-700 font-semibold px-3 py-1 rounded-lg">15 Jul 2026 (Earthwork)</span>
            <span className="text-slate-400 font-bold">vs</span>
            <span className="bg-blue-50 text-blue-700 font-semibold px-3 py-1 rounded-lg">22 Aug 2026 (Paved)</span>
          </div>
        </div>

        {/* Split Screen Slider Container */}
        <div className="relative w-full h-[420px] rounded-xl border border-slate-200 select-none overflow-hidden bg-slate-900">
          {/* After Image (Right / Base) */}
          <img 
            src={imgRoadAerial} 
            alt="Current Paved State 22 Aug 2026"
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 shadow-md">
            22 Aug 2026 • Paved Layer
          </div>

          {/* Before Image (Left / Clipped by slider) */}
          <div 
            className="absolute inset-0 overflow-hidden" 
            style={{ width: `${sliderPos}%` }}
          >
            <img 
              src={imgHighwayEarthwork} 
              alt="Previous State 15 July 2026"
              className="absolute inset-0 w-full h-full object-cover max-w-none"
              style={{ width: '100%', minWidth: '800px' }}
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 shadow-md">
              15 Jul 2026 • Earthwork Base
            </div>
          </div>

          {/* Divider Line & Handle */}
          <div 
            className="absolute top-0 bottom-0 w-[2px] bg-white cursor-ew-resize flex items-center justify-center shadow-lg"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="w-8 h-8 rounded-full bg-white text-slate-900 border border-slate-300 shadow-xl flex items-center justify-center text-xs font-bold">
              ↔
            </div>
          </div>

          {/* Range Input for Dragging */}
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
          />
        </div>
        <p className="text-center text-xs text-slate-500">
          Slide left or right to compare site progression over 38 days
        </p>
      </div>

      {/* Media Records Gallery */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Geotagged Survey Photos & Media</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {EVIDENCE_GALLERY.map((item) => (
            <div 
              key={item.id}
              onClick={() => setSelectedSurvey(item)}
              className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedSurvey.id === item.id 
                  ? 'border-blue-600 ring-2 ring-blue-100 shadow-md' 
                  : 'border-slate-200/80 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div>
                <div className="relative w-full h-40 rounded-xl overflow-hidden mb-3 bg-slate-100">
                  <img 
                    src={item.thumbnailUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {/* Geotag Indicator */}
                  <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-semibold text-slate-900 flex items-center gap-1 shadow-xs">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    <span>KM 12+400</span>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-medium">
                    {item.fileSize}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 line-clamp-2 mb-1">
                  {item.title}
                </h3>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span>{item.date}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-700 font-semibold">{item.accuracy}</span>
                <div className="flex items-center gap-1 text-blue-600 font-medium hover:underline">
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

