import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { CaseProvider } from './context/CaseContext';
import { AppShell } from './components/layout/AppShell';
import { GradientWaves } from './components/common/GradientWaves';
import { OverviewPage } from './pages/OverviewPage';
import { LiveCasesPage } from './pages/LiveCasesPage';
import { AddReportPage } from './pages/AddReportPage';
import { MatchIntelligencePage } from './pages/MatchIntelligencePage';
import { VerificationQueuePage } from './pages/VerificationQueuePage';
import { CaseDetailPage } from './pages/CaseDetailPage';
import { DuplicateResolutionPage } from './pages/DuplicateResolutionPage';
import { FamilyStatusPage } from './pages/FamilyStatusPage';
import { CommunityReportsPage } from './pages/CommunityReportsPage';
import { SourceNetworkPage } from './pages/SourceNetworkPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AuditTrailPage } from './pages/AuditTrailPage';
import { PrivacyAccessPage } from './pages/PrivacyAccessPage';
import { SettingsPage } from './pages/SettingsPage';
import { ConnectionGraphPage } from './pages/ConnectionGraphPage';
import { IndiaIncidentMapPage } from './pages/IndiaIncidentMapPage';

const AppContent: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <>
      {/* Full-Screen GradientWaves Background Active on Every Page with Theme Adaptability */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <GradientWaves
          key={theme}
          horizonColor={isDark ? '#080d1a' : '#4c75ba'}
          waveColor={isDark ? '#0f172a' : '#ffffff'}
          crestColor={isDark ? '#38bdf8' : '#FFFFFF'}
          speed={0.2}
          amplitude={2.5}
          waveScale={0.6}
          waveRatio={0.9}
          swell={35}
          turbulence={20}
          tilt={1.11}
          zoom={1.0}
          height={5.5}
          fogDepth={isDark ? 14 : 12}
          detail="medium"
          brightness={isDark ? 0.95 : 1.0}
          opacity={1.0}
          mouseInteraction={false}
          parallaxStrength={0.5}
          grain={true}
          grainIntensity={0.05}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={<Navigate to="/overview" replace />} />
            <Route path="overview" element={<OverviewPage />} />
            <Route path="cases" element={<LiveCasesPage />} />
            <Route path="cases/:id" element={<CaseDetailPage />} />
            <Route path="status" element={<FamilyStatusPage />} />
            <Route path="status/:id" element={<FamilyStatusPage />} />
            <Route path="family-status" element={<FamilyStatusPage />} />
            <Route path="report/new" element={<AddReportPage />} />
            <Route path="match-intel" element={<MatchIntelligencePage />} />
            <Route path="match-intel/:id" element={<MatchIntelligencePage />} />
            <Route path="verification" element={<VerificationQueuePage />} />
            <Route path="verification/:id" element={<VerificationQueuePage />} />
            <Route path="duplicates" element={<DuplicateResolutionPage />} />
            <Route path="community-reports" element={<CommunityReportsPage />} />
            <Route path="source-network" element={<SourceNetworkPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="connection-graph" element={<ConnectionGraphPage />} />
            <Route path="network-graph" element={<ConnectionGraphPage />} />
            <Route path="incident-map" element={<IndiaIncidentMapPage />} />
            <Route path="geospatial-map" element={<IndiaIncidentMapPage />} />
            <Route path="audit" element={<AuditTrailPage />} />
            <Route path="privacy" element={<PrivacyAccessPage />} />
            <Route path="settings" element={<SettingsPage />} />
            {/* Catch-all redirect to overview */}
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Route>
        </Routes>
      </div>
    </>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <CaseProvider>
          <AppContent />
        </CaseProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
