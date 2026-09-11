import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { OverviewPage } from './pages/OverviewPage';
import { AddReportPage } from './pages/AddReportPage';
import { MatchIntelligencePage } from './pages/MatchIntelligencePage';
import { VerificationQueuePage } from './pages/VerificationQueuePage';
import {
  LiveCasesPage,
  DuplicateResolutionPage,
  CommunityReportsPage,
  SourceNetworkPage,
  AnalyticsPage,
  AuditTrailPage,
  PrivacyAccessPage,
  SettingsPage,
} from './pages/ModuleViews';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="cases" element={<LiveCasesPage />} />
          <Route path="report/new" element={<AddReportPage />} />
          <Route path="match-intel" element={<MatchIntelligencePage />} />
          <Route path="verification" element={<VerificationQueuePage />} />
          <Route path="duplicates" element={<DuplicateResolutionPage />} />
          <Route path="community-reports" element={<CommunityReportsPage />} />
          <Route path="source-network" element={<SourceNetworkPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="audit" element={<AuditTrailPage />} />
          <Route path="privacy" element={<PrivacyAccessPage />} />
          <Route path="settings" element={<SettingsPage />} />
          {/* Catch-all redirect to overview */}
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
