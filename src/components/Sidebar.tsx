import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Video, 
  FolderArchive, 
  FileSpreadsheet, 
  ShieldCheck,
  Radio,
  Pin,
  PinOff,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { NavSection } from '../types';

interface SidebarProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  liveDroneActive?: boolean;
  onExpandChange?: (expanded: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  liveDroneActive = true,
  onExpandChange
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const isExpanded = isHovered || isPinned;

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onExpandChange) onExpandChange(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (onExpandChange) onExpandChange(isPinned);
  };

  const togglePin = () => {
    const nextPinned = !isPinned;
    setIsPinned(nextPinned);
    if (onExpandChange) onExpandChange(nextPinned || isHovered);
  };

  const navItems: { id: NavSection; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'progress', label: 'Progress & Layers', icon: <TrendingUp className="w-5 h-5" /> },
    { 
      id: 'site-intel', 
      label: 'Live GIS Map & Drone', 
      icon: <Video className="w-5 h-5" />,
      badge: liveDroneActive ? 'LIVE' : undefined
    },
    { id: 'evidence', label: 'Surveys & Orthomosaics', icon: <FolderArchive className="w-5 h-5" /> },
    { id: 'reports', label: 'Reports & DPR', icon: <FileSpreadsheet className="w-5 h-5" /> },
    { id: 'admin', label: 'Fleet & Telemetry', icon: <ShieldCheck className="w-5 h-5" /> },
  ];

  return (
    <aside 
      id="sidebar-nav"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`bg-slate-900 text-slate-100 h-screen fixed left-0 top-0 flex flex-col py-5 z-50 border-r border-slate-800 select-none transition-all duration-300 ease-in-out shadow-2xl ${
        isExpanded ? 'w-[260px] px-4' : 'w-[72px] px-2.5 items-center'
      }`}
    >
      {/* Brand Header */}
      <div className={`w-full mb-6 pb-4 border-b border-slate-800 transition-all ${
        isExpanded ? 'px-2' : 'flex justify-center'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-blue-500/40 shrink-0">
              C
            </div>
            {isExpanded && (
              <div className="overflow-hidden whitespace-nowrap animate-in fade-in duration-200">
                <h1 className="text-base font-bold tracking-tight text-white leading-tight">
                  ConstruVision
                </h1>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Highway Monitoring
                </p>
              </div>
            )}
          </div>

          {/* Pin toggle button when expanded */}
          {isExpanded && (
            <button
              onClick={togglePin}
              title={isPinned ? "Unpin sidebar (auto-collapse)" : "Pin sidebar expanded"}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                isPinned ? 'text-blue-400 bg-blue-500/10' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
              }`}
            >
              {isPinned ? <Pin className="w-3.5 h-3.5" /> : <PinOff className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <div className="w-full flex-1 overflow-y-auto overflow-x-hidden space-y-1.5">
        {isExpanded && (
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 animate-in fade-in duration-150">
            Navigation
          </div>
        )}

        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onSelectSection(item.id)}
              title={!isExpanded ? item.label : undefined}
              className={`w-full flex items-center rounded-xl text-sm font-medium transition-all group cursor-pointer relative ${
                isExpanded ? 'justify-between px-3.5 py-2.5' : 'justify-center p-3'
              } ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                  {item.icon}
                </span>
                {isExpanded && (
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis animate-in fade-in duration-150">
                    {item.label}
                  </span>
                )}
              </div>

              {/* Status Badge when expanded */}
              {isExpanded && item.badge && (
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wide shrink-0 ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {item.badge}
                </span>
              )}

              {/* Dot indicator when collapsed */}
              {!isExpanded && isActive && (
                <span className="absolute right-1 w-1.5 h-1.5 rounded-full bg-white"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Live Drone Status Card */}
      <div className="w-full mt-auto pt-3">
        {isExpanded ? (
          <div className="rounded-2xl border border-slate-800 p-3.5 text-xs text-slate-300 bg-slate-800/50 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-xs text-white flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                Drone Alpha
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                Live
              </span>
            </div>
            <div className="t ext-[11px] text-slate-400 leading-relaxed border-t border-slate-700/60 pt-2 flex justify-between items-center">
              <span>KM 12+400</span>
              <span className="text-slate-300 font-mono">RTK 99.4%</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center p-2">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" title="Survey Drone Alpha Live"></div>
          </div>
        )}
      </div>
    </aside>
  );
};
