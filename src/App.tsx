import React, { useState, useEffect } from 'react';
import { NavSection, ProjectPackage, OperationalAlert, SegmentInfo } from './types';
import { CURRENT_PROJECT, INITIAL_KPI_DATA, INITIAL_ALERTS } from './data/mockData';
import { ApiService } from './services/api';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { SiteIntelView } from './components/SiteIntelView';
import { ProgressView } from './components/ProgressView';
import { EvidenceView } from './components/EvidenceView';
import { ReportsView } from './components/ReportsView';
import { AdminView } from './components/AdminView';
import { 
  CompareDatesModal, 
  GenerateReportModal, 
  AlertsModal, 
  SegmentModal 
} from './components/Modals';

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('dashboard');
  const [currentProject, setCurrentProject] = useState<ProjectPackage>(CURRENT_PROJECT);
  const [kpiData, setKpiData] = useState(INITIAL_KPI_DATA);
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [alerts, setAlerts] = useState<OperationalAlert[]>(INITIAL_ALERTS);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // Modals state
  const [isCompareDatesOpen, setIsCompareDatesOpen] = useState(false);
  const [isGenerateReportOpen, setIsGenerateReportOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<SegmentInfo | null>(null);

  const handleResolveAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    setKpiData(prev => ({
      ...prev,
      criticalAlertsCount: Math.max(0, prev.criticalAlertsCount - 1)
    }));
  };

  const handleReportGenerated = () => {
    setIsGenerateReportOpen(false);
    setActiveSection('reports');
  };

  useEffect(() => {
    let cancelled = false;
    ApiService.getKpis(selectedDate)
      .then((data) => { if (!cancelled) setKpiData(data); })
      .catch(() => { /* keep existing kpiData on failure */ });
    return () => { cancelled = true; };
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-[#111111] flex flex-col font-sans selection:bg-black selection:text-white overflow-x-hidden">
      {/* Hover-Activated Collapsible Left Sidebar Navigation */}
      <Sidebar 
        activeSection={activeSection}
        onSelectSection={(section) => setActiveSection(section)}
        liveDroneActive={true}
        onExpandChange={(expanded) => setIsSidebarExpanded(expanded)}
      />

      {/* Top Sticky Header */}
      <Header 
        currentProject={currentProject}
        onSelectProject={(pkg) => setCurrentProject(pkg)}
        onOpenNotifications={() => setIsAlertsModalOpen(true)}
        unreadAlertsCount={alerts.length}
        isSidebarExpanded={isSidebarExpanded}
      />

      {/* Main Dynamic Viewport */}
      <main className={`p-8 max-w-[1600px] w-full flex-1 min-w-0 transition-all duration-300 ${
        isSidebarExpanded ? 'ml-[260px] max-w-[calc(100%-260px)]' : 'ml-[72px] max-w-[calc(100%-72px)]'
      }`}>
        {activeSection === 'dashboard' && (
          <DashboardView 
            currentProject={currentProject}
            kpiData={kpiData}
            alerts={alerts}
            onStartLiveView={() => setActiveSection('site-intel')}
            onCompareDates={() => setIsCompareDatesOpen(true)}
            onGenerateReport={() => setIsGenerateReportOpen(true)}
            onOpenAlertsModal={() => setIsAlertsModalOpen(true)}
            onSelectSegment={(seg) => setSelectedSegment(seg)}
            selectedDate={selectedDate}
            onChangeDate={(date: string) => setSelectedDate(date)}
            onViewCaptures={() => setActiveSection('evidence')}
          />
        )}

        {activeSection === 'site-intel' && (
          <SiteIntelView />
        )}

        {activeSection === 'progress' && (
          <ProgressView />
        )}

        {activeSection === 'evidence' && (
          <EvidenceView />
        )}

        {activeSection === 'reports' && (
          <ReportsView />
        )}

        {activeSection === 'admin' && (
          <AdminView />
        )}
      </main>

      {/* Interactive Global Modals */}
      <CompareDatesModal 
        isOpen={isCompareDatesOpen}
        onClose={() => setIsCompareDatesOpen(false)}
      />

      <GenerateReportModal 
        isOpen={isGenerateReportOpen}
        onClose={() => setIsGenerateReportOpen(false)}
        onConfirm={handleReportGenerated}
      />

      <AlertsModal 
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        alerts={alerts}
        onResolveAlert={handleResolveAlert}
      />

      <SegmentModal 
        segment={selectedSegment}
        onClose={() => setSelectedSegment(null)}
      />
    </div>
  );
}
