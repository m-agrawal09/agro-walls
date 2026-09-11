import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CaseProvider } from './context/CaseContext';
import { AppShell } from './components/layout/AppShell';
import { DemoPresentationBar } from './components/common/DemoPresentationBar';
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

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <CaseProvider>
        <DemoPresentationBar />
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
            <Route path="audit" element={<AuditTrailPage />} />
            <Route path="privacy" element={<PrivacyAccessPage />} />
            <Route path="settings" element={<SettingsPage />} />
            {/* Catch-all redirect to overview */}
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Route>
        </Routes>
      </CaseProvider>
    </BrowserRouter>
  );
};

export default App;
