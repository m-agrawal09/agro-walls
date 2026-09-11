import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <CaseProvider>
        {/* Full-Screen GradientWaves Background Active on Every Page */}
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
            horizonColor="#4c75ba"
            waveColor="#ffffff"
            crestColor="#FFFFFF"
            speed={0.2}
            amplitude={2.5}
            waveScale={0.6}
            waveRatio={0.9}
            swell={35}
            turbulence={20}
            tilt={1.11}
            zoom={1.0}
            height={5.5}
            fogDepth={12}
            detail="medium"
            brightness={1.0}
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
      </CaseProvider>
    </BrowserRouter>
  );
};

export default App;
