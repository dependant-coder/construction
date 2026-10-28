import React from 'react';
import { 
  Radio, 
  RotateCw, 
  Bell, 
  CheckCircle2, 
  ChevronDown,
  Layers,
  Sparkles
} from 'lucide-react';
import { ProjectPackage } from '../types';
import { AVAILABLE_PACKAGES } from '../data/mockData';

import { NewFlightSessionModal } from './Modals';

interface HeaderProps {
  currentProject: ProjectPackage;
  onSelectProject: (pkg: ProjectPackage) => void;
  onOpenNotifications: () => void;
  unreadAlertsCount: number;
  isSidebarExpanded?: boolean;
  onFlightCreated?: (session: any) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProject,
  onSelectProject,
  onOpenNotifications,
  unreadAlertsCount,
  isSidebarExpanded = false,
  onFlightCreated
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [syncedState, setSyncedState] = React.useState(false);
  const [isFlightModalOpen, setIsFlightModalOpen] = React.useState(false);
  const [isMockML, setIsMockML] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    import('../services/api').then(({ ApiService }) => {
      ApiService.getAIMode().then((status) => {
        if (mounted && status) {
          setIsMockML(status.use_simulated);
        }
      }).catch(() => {});
    });
    return () => { mounted = false; };
  }, []);

  const handleSync = () => {
    setSyncedState(true);
    setTimeout(() => setSyncedState(false), 1200);
  };

  return (
    <header 
      id="top-header"
      className={`bg-white h-[72px] sticky top-0 z-40 border-b border-slate-200/80 flex justify-between items-center px-8 w-full transition-all duration-300 select-none ${
        isSidebarExpanded ? 'ml-[260px] max-w-[calc(100%-260px)]' : 'ml-[72px] max-w-[calc(100%-72px)]'
      }`}
    >
      {/* Left: Project Selector & Section Badge */}
      <div className="flex items-center gap-5">
        <div>
          <div className="relative">
            <button 
              id="project-selector-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/70 transition-colors text-slate-900 font-semibold text-sm cursor-pointer"
            >
              <Layers className="w-4 h-4 text-blue-600" />
              <span>{currentProject.name}</span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>

            {dropdownOpen && (
              <div 
                id="project-dropdown"
                className="absolute top-full left-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl p-2 z-50 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Select Highway Section
                </div>
                {AVAILABLE_PACKAGES.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => {
                      onSelectProject(pkg);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-between cursor-pointer ${
                      pkg.id === currentProject.id ? 'bg-blue-50/80 text-blue-900 font-medium' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold">{pkg.section}</div>
                      <div className="text-xs text-slate-500">{pkg.lengthKm} KM • {pkg.contractor.split('&')[0]}</div>
                    </div>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      pkg.status === 'On Track' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {pkg.status}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          {currentProject.section}
        </div>
      </div>

      {/* Right: Actions, Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Mock / Real ML Toggle Pill */}
        <button
          id="btn-toggle-ai-mode"
          onClick={async () => {
            const nextMode = !isMockML;
            setIsMockML(nextMode);
            try {
              const { ApiService } = await import('../services/api');
              const res = await ApiService.setAIMode(nextMode);
              if (res && typeof res.use_simulated === 'boolean') {
                setIsMockML(res.use_simulated);
              }
            } catch (err) {
              console.error('Failed to toggle AI mode on backend:', err);
            }
          }}
          title={isMockML ? 'Switch to Real PyTorch ML Models' : 'Switch to Mock ML Simulator'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer border ${
            isMockML 
              ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100' 
              : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isMockML ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
          <span>{isMockML ? 'Mock ML' : 'Real ML (.pt)'}</span>
        </button>

        {/* New Flight Session Button */}
        <button
          onClick={() => setIsFlightModalOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Flight</span>
        </button>

        {/* Sync Button */}
        <button 
          id="btn-sync-telemetry"
          onClick={handleSync}
          title="Refresh live data"
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          {syncedState ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <RotateCw className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Notifications */}
        <button 
          id="btn-notifications"
          onClick={onOpenNotifications}
          title="Notifications"
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          {unreadAlertsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white"></span>
          )}
        </button>

        {/* User Profile */}
        <div 
          id="user-profile-avatar"
          className="flex items-center gap-3 pl-3 border-l border-slate-200 ml-1"
        >
          <div className="text-right hidden md:block">
            <div className="text-xs font-bold text-slate-800">Project Director</div>
            <div className="text-[11px] text-slate-500">Glenn Maxwell</div>
          </div>
          <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-slate-200 bg-slate-100 cursor-pointer shadow-xs">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
              alt="Project Director"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      <NewFlightSessionModal
        isOpen={isFlightModalOpen}
        onClose={() => setIsFlightModalOpen(false)}
        onSessionCreated={(session) => {
          if (onFlightCreated) onFlightCreated(session);
        }}
      />
    </header>
  );
};

