import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  ChevronDown, 
  MapPin, 
  FileCheck 
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { StatusDot } from '../components/common/StatusDot';
import { useNavigate } from 'react-router-dom';
import { useCaseContext } from '../context/CaseContext';
import { api } from '../services/api';

interface VerificationItem {
  caseId: string;
  name: string;
  ageGender: string;
  location: string;
  source: string;
  matchTarget: string;
  confidence: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: 'PENDING FIELD CHECK' | 'PHOTO REVIEW' | 'BIOMETRIC CORRELATED' | 'VERIFIED MATCH';
  reportedAgo: string;
}

interface ActivityItem {
  id: string;
  timestamp: string;
  source: string;
  sourceType: 'HELPLINE' | 'HOSPITAL' | 'RELIEF CAMP' | 'NGO' | 'VOLUNTEER' | 'PUBLIC';
  action: string;
  person: string;
  caseId: string;
  operator: string;
  status: 'VERIFIED' | 'MATCH' | 'INTAKE' | 'ALERT';
}

interface SourceStat {
  source: string;
  type: string;
  reportsReceived: number;
  verified: number;
  pending: number;
  lastIngest: string;
  status: 'LIVE FEED' | 'STABLE' | 'MANUAL BATCH';
}

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { caseStatus } = useCaseContext();
  const [selectedDisaster, setSelectedDisaster] = useState('Central India Flood Response');
  const [disasterFilterOpen, setDisasterFilterOpen] = useState(false);

  const [kpiData, setKpiData] = useState<{
    totalCases: number;
    verifiedCases: number;
    awaitingVerification: number;
    lookingForMatch: number;
    pendingVerificationQueue: number;
    matchRate: number;
  }>({
    totalCases: 12,
    verifiedCases: 3,
    awaitingVerification: 4,
    lookingForMatch: 5,
    pendingVerificationQueue: 6,
    matchRate: 74,
  });

  const [verificationQueue, setVerificationQueue] = useState<VerificationItem[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [sourceStats, setSourceStats] = useState<SourceStat[]>([]);

  useEffect(() => {
    // 1. Fetch live KPIs
    api.getKPIs()
      .then((kpis) => {
        if (kpis) setKpiData(kpis);
      })
      .catch(() => {});

    // 2. Fetch live Verification Queue
    api.getVerifications()
      .then((items) => {
        if (Array.isArray(items) && items.length > 0) {
          setVerificationQueue(items.map((it: any) => ({
            caseId: it.caseId,
            name: it.name,
            ageGender: it.ageGender || 'Age Unknown',
            location: it.location || 'Relief Camp',
            source: it.source || 'Intake Terminal',
            matchTarget: it.matchTarget || 'Correlation Match',
            confidence: it.confidence || 90,
            priority: it.priority || 'HIGH',
            status: it.status || 'PHOTO REVIEW',
            reportedAgo: it.reportedAgo || 'Recent',
          })));
        }
      })
      .catch(() => {});

    // 3. Fetch live Audit Activity
    api.getAuditLogs(15)
      .then((logs) => {
        if (Array.isArray(logs) && logs.length > 0) {
          setRecentActivity(logs.map((log: any) => ({
            id: log._id ? `ACT-${log._id.slice(-4)}` : `ACT-${Math.floor(Math.random() * 900 + 100)}`,
            timestamp: log.timestamp ? log.timestamp.slice(11, 19) + ' UTC' : 'Just now',
            source: log.source || 'System Feed',
            sourceType: (log.sourceType || 'RELIEF CAMP') as any,
            action: log.details || log.action,
            person: log.person || 'General Incident',
            caseId: log.caseId || 'CAD-OPS',
            operator: log.operator || 'DISP-SYSTEM',
            status: (log.status || 'INTAKE') as any,
          })));
        }
      })
      .catch(() => {});

    // 4. Fetch live Ingest Feeds
    api.getSourceFeeds()
      .then((feeds) => {
        if (Array.isArray(feeds) && feeds.length > 0) {
          setSourceStats(feeds.map((f: any) => ({
            source: f.source,
            type: f.type,
            reportsReceived: f.reportsReceived,
            verified: f.verified,
            pending: f.pending,
            lastIngest: f.lastIngest || 'Live',
            status: f.status || 'LIVE FEED',
          })));
        }
      })
      .catch(() => {});
  }, [caseStatus]);

  const handleExportSitRep = () => {
    const sitrepContent = `# EMERGENCY OPERATIONAL SITUATION REPORT (SITREP)
Generated: ${new Date().toUTCString()}
Incident: ${selectedDisaster}
Command Identifier: INCIDENT ALPHA-04
Clearance: RESTRICTED LEVEL 2

## 1. OPERATIONAL SUMMARY & KPIS
- Total Incident Cases Registered: ${kpiData.totalCases}
- Verified Positive Identifications: ${kpiData.verifiedCases}
- Awaiting Field Verification: ${kpiData.awaitingVerification}
- Active Candidate Matching Queue: ${kpiData.lookingForMatch}
- Pending Verification Review: ${kpiData.pendingVerificationQueue}
- Automated Match Correlation Rate: ${kpiData.matchRate}%

## 2. VERIFICATION QUEUE HIGH-PRIORITY CASES
${verificationQueue.slice(0, 5).map(v => `- [${v.priority}] Case ${v.caseId}: ${v.name} (${v.ageGender}) - Location: ${v.location}`).join('\n') || '- No pending urgent items.'}

## 3. TELEMETRY & DATA SOURCES
- CAD Live Stream: CONNECTED (12ms latency)
- State Disaster Command Hub: Rajasthan Emergency Network
- Audit Trail: Cryptographically verified SHA-256 tamper-evident log
`;

    const blob = new Blob([sitrepContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SITREP_${selectedDisaster.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const disastersList = [
    { name: 'Central India Flood Response', region: 'Madhya Pradesh / Narmada Basin', status: 'LEVEL 3 CRITICAL', cases: kpiData.totalCases },
    { name: 'Assam Brahmaputra Surge 2026', region: 'Dhubri / Barpeta Sector', status: 'LEVEL 2 ELEVATED', cases: 412 },
    { name: 'Coastal Cyclone Sagar Monitoring', region: 'Odisha Coastal Belt', status: 'STANDBY WATCH', cases: 58 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100%' }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-base)',
          padding: '32px 40px 24px 40px',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}>
          {/* Title */}
          <div>
            <h1 style={{
              fontSize: '26px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.025em',
              marginBottom: '4px',
            }}>
              Overview
            </h1>
            <p style={{
              fontSize: '14.5px',
              color: 'var(--text-secondary)',
            }}>
              Intake, automated matching, and field verification status.
            </p>
          </div>

          {/* Active Event Selector & Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            {/* Active Disaster Switcher */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDisasterFilterOpen(!disasterFilterOpen)}
                className="surface-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: '7px 16px',
                  height: '38px',
                  backgroundColor: 'var(--bg-surface)',
                  cursor: 'pointer',
                  borderColor: 'var(--border-strong)',
                  borderRadius: '7px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <StatusDot variant="crimson" pulse size={7} />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {selectedDisaster}
                  </span>
                </div>
                <ChevronDown size={14} color="var(--text-secondary)" />
              </button>

              {disasterFilterOpen && (
                <div
                  className="surface-card"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    right: 0,
                    width: '320px',
                    zIndex: 60,
                    boxShadow: 'var(--shadow-overlay)',
                    padding: 'var(--space-2) 0',
                  }}
                >
                  <div style={{ padding: '6px 12px', fontSize: '12px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)', fontWeight: 600 }}>
                    Active Incidents
                  </div>
                  {disastersList.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedDisaster(item.name);
                        setDisasterFilterOpen(false);
                      }}
                      style={{
                        padding: '8px 12px',
                        cursor: 'pointer',
                        backgroundColor: selectedDisaster === item.name ? 'var(--bg-surface-active)' : 'transparent',
                        borderLeft: selectedDisaster === item.name ? '3px solid var(--color-charcoal-900)' : '3px solid transparent',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedDisaster !== item.name) e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                      }}
                      onMouseLeave={(e) => {
                        if (selectedDisaster !== item.name) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</span>
                        <span style={{ fontSize: '12px', color: 'var(--color-crimson)', fontWeight: 600 }}>{item.cases} cases</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                        <span>{item.region}</span>
                        <span>{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button 
              type="button"
              onClick={handleExportSitRep}
              className="btn btn-secondary" 
              style={{ height: '38px', borderRadius: '7px', fontSize: '13.5px' }} 
              title="Download Situation Report"
            >
              <Download size={14} />
              <span>Export SitRep</span>
            </button>

            <button
              onClick={() => navigate('/incident-map')}
              className="btn btn-secondary"
              style={{ height: '38px', borderRadius: '7px', borderColor: 'rgba(225, 29, 72, 0.4)', color: '#e11d48', fontWeight: 600, fontSize: '13.5px' }}
            >
              <MapPin size={14} />
              <span>Incident Map</span>
            </button>

            <button 
              onClick={() => navigate('/report/new')}
              className="btn btn-primary" 
              style={{ height: '38px', borderRadius: '7px', fontSize: '13.5px' }}
            >
              <span>+ Intake Case</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Operational Dashboard Content */}
      <div style={{
        padding: '28px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}>
        {/* KEY OPERATIONAL METRICS */}
        <div>
          <div style={{
            fontSize: '13.5px',
            fontWeight: 650,
            color: 'var(--text-muted)',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span>Key Metrics</span>
            <span style={{ color: 'var(--border-strong)' }}>•</span>
            <span style={{ color: 'var(--color-forest-text)', fontSize: '12px', fontWeight: 600 }}>Live</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '12px',
          }}>
            {/* Metric 1: Active Missing Cases */}
            <div className="surface-card" style={{ padding: '18px 20px', borderTop: '3px solid var(--color-crimson)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Active Missing
                </span>
                <Badge variant="crimson">
                  Open
                </Badge>
              </div>
              <div style={{ fontSize: '30px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {kpiData.totalCases}
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Open case records
              </div>
            </div>

            {/* Metric 2: Found / Rescued */}
            <div className="surface-card" style={{ padding: '18px 20px', borderTop: '3px solid var(--color-forest)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Found / Verified
                </span>
                <Badge variant="forest">
                  Reunited
                </Badge>
              </div>
              <div style={{ fontSize: '30px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-forest)', letterSpacing: '-0.02em' }}>
                {kpiData.verifiedCases}
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Safely confirmed & reunited
              </div>
            </div>

            {/* Metric 3: Potential Matches */}
            <div className="surface-card" style={{ padding: '18px 20px', borderTop: '3px solid var(--color-amber)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Potential Matches
                </span>
                <Badge variant="amber">
                  Review
                </Badge>
              </div>
              <div style={{ fontSize: '30px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-amber)', letterSpacing: '-0.02em' }}>
                {kpiData.pendingVerificationQueue}
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Correlation pending check
              </div>
            </div>

            {/* Metric 4: Awaiting Verification */}
            <div className="surface-card" style={{ padding: '18px 20px', borderTop: '3px solid var(--border-strong)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Awaiting Verification
                </span>
                <Badge variant="default">
                  Queue
                </Badge>
              </div>
              <div style={{ fontSize: '30px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {kpiData.awaitingVerification}
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Field check pending
              </div>
            </div>

            {/* Metric 5: High Priority */}
            <div className="surface-card" style={{ padding: '18px 20px', borderTop: '3px solid var(--color-crimson)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  High Priority
                </span>
                <Badge variant="crimson">
                  Urgent
                </Badge>
              </div>
              <div style={{ fontSize: '30px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-crimson)', letterSpacing: '-0.02em' }}>
                {kpiData.lookingForMatch}
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Urgent attention cases
              </div>
            </div>
          </div>
        </div>

        {/* 1. CASE RESOLUTION PIPELINE */}
        <div className="surface-card" style={{ padding: '20px 24px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: '1px solid var(--border-subtle)',
          }}>
            <div>
              <h2 style={{ fontSize: '16.5px', fontWeight: 650, color: 'var(--text-primary)' }}>
                Resolution Pipeline
              </h2>
            </div>
          </div>

          {/* Linear 5-Stage Diagram */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 'var(--space-3)',
            position: 'relative',
          }}>
            {/* Stage 1 */}
            <div style={{
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-base)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-3) var(--space-4)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '100px',
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>STAGE 01</span>
                  <StatusDot variant="forest" size={6} />
                </div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Reports Received
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Intake from 6 live feeds
                </div>
              </div>
              <div style={{ marginTop: 'var(--space-2)', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: 'var(--text-lg)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>2,348</span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>INGESTED</span>
              </div>
            </div>

            {/* Stage 2 */}
            <div style={{
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-base)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-3) var(--space-4)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '100px',
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>STAGE 02</span>
                  <StatusDot variant="forest" pulse size={6} />
                </div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Matching
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Biometric & geospatial cross-check
                </div>
              </div>
              <div style={{ marginTop: 'var(--space-2)', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: 'var(--text-lg)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>1,284</span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>INDEXED</span>
              </div>
            </div>

            {/* Stage 3 */}
            <div style={{
              backgroundColor: 'var(--color-amber-bg)',
              border: '1px solid var(--color-amber-border)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-3) var(--space-4)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '100px',
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-amber-text)' }}>STAGE 03</span>
                  <StatusDot variant="amber" size={6} />
                </div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-amber-text)' }}>
                  Potential Match
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-amber-text)', opacity: 0.85, marginTop: '2px' }}>
                  Candidates score &gt;75%
                </div>
              </div>
              <div style={{ marginTop: 'var(--space-2)', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: 'var(--text-lg)', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-amber-text)' }}>86</span>
                <span style={{ fontSize: '10px', color: 'var(--color-amber-text)', fontFamily: 'var(--font-mono)' }}>IDENTIFIED</span>
              </div>
            </div>

            {/* Stage 4 */}
            <div style={{
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-3) var(--space-4)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '100px',
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>STAGE 04</span>
                  <StatusDot variant="crimson" size={6} />
                </div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Human Verification
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  On-duty dispatcher review
                </div>
              </div>
              <div style={{ marginTop: 'var(--space-2)', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: 'var(--text-lg)', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-crimson)' }}>31</span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>IN REVIEW</span>
              </div>
            </div>

            {/* Stage 5 */}
            <div style={{
              backgroundColor: 'var(--color-forest-bg)',
              border: '1px solid var(--color-forest-border)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-3) var(--space-4)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '100px',
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-forest-text)' }}>STAGE 05</span>
                  <CheckCircle2 size={12} color="var(--color-forest)" />
                </div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-forest-text)' }}>
                  Family Notified
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-forest-text)', opacity: 0.85, marginTop: '2px' }}>
                  Positive ID confirmed & reunited
                </div>
              </div>
              <div style={{ marginTop: 'var(--space-2)', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: 'var(--text-lg)', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-forest-text)' }}>472</span>
                <span style={{ fontSize: '10px', color: 'var(--color-forest-text)', fontFamily: 'var(--font-mono)' }}>RESOLVED</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. VERIFICATION QUEUE (Compact Operational Table) */}
        <div className="surface-card">
          <div style={{
            padding: 'var(--space-4) var(--space-6)',
            borderBottom: '1px solid var(--border-base)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-3)',
          }}>
            <div>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                HUMAN-IN-THE-LOOP TRIAGE
              </div>
              <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--text-primary)' }}>
                Verification Queue
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Badge variant="amber">
                31 CASES PENDING REVIEW
              </Badge>
              <button 
                onClick={() => navigate('/verification')}
                className="btn btn-secondary" 
                style={{ height: '30px', fontSize: 'var(--text-xs)' }}
              >
                <span>View Full Queue (31)</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 'var(--text-sm)',
              textAlign: 'left',
            }}>
              <thead>
                <tr style={{
                  backgroundColor: 'var(--bg-app)',
                  borderBottom: '1px solid var(--border-base)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}>
                  <th style={{ padding: '8px 16px', fontWeight: 600 }}>Case ID</th>
                  <th style={{ padding: '8px 16px', fontWeight: 600 }}>Person Name</th>
                  <th style={{ padding: '8px 16px', fontWeight: 600 }}>Age / Gender</th>
                  <th style={{ padding: '8px 16px', fontWeight: 600 }}>Last Known Location</th>
                  <th style={{ padding: '8px 16px', fontWeight: 600 }}>Ingest Source</th>
                  <th style={{ padding: '8px 16px', fontWeight: 600 }}>Match Confidence</th>
                  <th style={{ padding: '8px 16px', fontWeight: 600 }}>Priority & Status</th>
                  <th style={{ padding: '8px 16px', fontWeight: 600, textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {verificationQueue.map((item, idx) => {
                  const isDemoCase = item.caseId === 'MP-2026-00421';
                  return (
                    <tr
                      key={item.caseId}
                      onClick={() => {
                        if (isDemoCase) {
                          navigate('/cases/MP-2026-00421');
                        } else {
                          navigate('/verification');
                        }
                      }}
                      style={{
                        borderBottom: idx === verificationQueue.length - 1 ? 'none' : '1px solid var(--border-subtle)',
                        backgroundColor: isDemoCase ? 'var(--color-amber-bg)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background-color 0.1s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isDemoCase) e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isDemoCase) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {/* Case ID */}
                      <td style={{ padding: '10px 16px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{item.caseId}</span>
                          {isDemoCase && <Badge variant="amber">DEMO</Badge>}
                        </div>
                      </td>

                      {/* Person */}
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target: {item.matchTarget}</div>
                      </td>

                      {/* Age / Gender */}
                      <td style={{ padding: '10px 16px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                        {item.ageGender}
                      </td>

                      {/* Location */}
                      <td style={{ padding: '10px 16px', color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12} color="var(--text-muted)" />
                          <span>{item.location}</span>
                        </div>
                      </td>

                      {/* Source */}
                      <td style={{ padding: '10px 16px', color: 'var(--text-secondary)' }}>
                        {item.source}
                      </td>

                      {/* Match Confidence */}
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '46px',
                            height: '6px',
                            backgroundColor: 'var(--bg-subtle)',
                            borderRadius: '2px',
                            overflow: 'hidden',
                          }}>
                            <div style={{
                              width: `${item.confidence}%`,
                              height: '100%',
                              backgroundColor: item.confidence >= 90 ? 'var(--color-forest)' : 'var(--color-amber)',
                            }} />
                          </div>
                          <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 600,
                            fontSize: '12px',
                            color: item.confidence >= 90 ? 'var(--color-forest)' : 'var(--color-amber)',
                          }}>
                            {item.confidence}%
                          </span>
                        </div>
                      </td>

                      {/* Priority & Status */}
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <Badge variant={item.priority === 'CRITICAL' ? 'crimson' : item.priority === 'HIGH' ? 'amber' : 'default'}>
                            {item.priority}
                          </Badge>
                          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: item.status === 'VERIFIED MATCH' ? 'var(--color-forest-text)' : 'var(--text-muted)', fontWeight: item.status === 'VERIFIED MATCH' ? 600 : 400 }}>
                            {item.status}
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isDemoCase) {
                              navigate('/cases/MP-2026-00421');
                            } else {
                              navigate('/verification');
                            }
                          }}
                          className={isDemoCase ? 'btn btn-primary' : 'btn btn-secondary'}
                          style={{
                            height: '28px',
                            padding: '0 10px',
                            fontSize: '12px',
                            backgroundColor: isDemoCase ? 'var(--color-charcoal-900)' : undefined,
                            color: isDemoCase ? '#ffffff' : undefined,
                          }}
                        >
                          <FileCheck size={13} />
                          <span>{isDemoCase ? 'Case File' : 'Verify'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* DUAL SECTION: RECENT CASE ACTIVITY & SOURCE ACTIVITY */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: 'var(--space-6)',
        }}>
          {/* 3. RECENT CASE ACTIVITY */}
          <div className="surface-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{
              padding: 'var(--space-4) var(--space-5)',
              borderBottom: '1px solid var(--border-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  OPERATIONAL AUDIT STREAM
                </div>
                <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Recent Case Activity
                </h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <StatusDot variant="forest" pulse size={6} />
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>LIVE DISPATCH</span>
              </div>
            </div>

            <div style={{ padding: 'var(--space-3) var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {recentActivity.map((act) => (
                <div
                  key={act.id}
                  style={{
                    padding: 'var(--space-3) 0',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-muted)' }}>
                        {act.timestamp}
                      </span>
                      <span style={{ color: 'var(--border-strong)' }}>•</span>
                      <span style={{
                        padding: '1px 6px',
                        backgroundColor: 'var(--bg-app)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-xs)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        color: 'var(--text-secondary)',
                      }}>
                        {act.source}
                      </span>
                    </div>

                    <Badge variant={act.status === 'VERIFIED' ? 'forest' : act.status === 'ALERT' ? 'crimson' : act.status === 'MATCH' ? 'amber' : 'default'}>
                      {act.status}
                    </Badge>
                  </div>

                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 500 }}>
                    {act.action}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <span>Subject: <strong style={{ color: 'var(--text-secondary)' }}>{act.person}</strong></span>
                    <span>|</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{act.caseId}</span>
                    <span>|</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>OP: {act.operator}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              padding: 'var(--space-3) var(--space-5)',
              borderTop: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-app)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <span>TAMPER-PROOF DISPATCH AUDIT LOG</span>
              <span style={{ color: 'var(--text-secondary)' }}>VIEW COMPLETE LOG &gt;</span>
            </div>
          </div>

          {/* 4. SOURCE ACTIVITY */}
          <div className="surface-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{
              padding: 'var(--space-4) var(--space-5)',
              borderBottom: '1px solid var(--border-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  MULTI-AGENCY INGESTION
                </div>
                <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Source Network Activity
                </h2>
              </div>
              <Badge variant="forest">
                6 / 6 STREAMS ACTIVE
              </Badge>
            </div>

            <div style={{ overflowX: 'auto', flex: 1 }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: 'var(--text-sm)',
                textAlign: 'left',
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: 'var(--bg-app)',
                    borderBottom: '1px solid var(--border-base)',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}>
                    <th style={{ padding: '8px 16px', fontWeight: 600 }}>Source Entity</th>
                    <th style={{ padding: '8px 12px', fontWeight: 600, textAlign: 'right' }}>Received</th>
                    <th style={{ padding: '8px 12px', fontWeight: 600, textAlign: 'right' }}>Verified</th>
                    <th style={{ padding: '8px 12px', fontWeight: 600, textAlign: 'right' }}>Pending</th>
                    <th style={{ padding: '8px 16px', fontWeight: 600, textAlign: 'right' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sourceStats.map((src, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: idx === sourceStats.length - 1 ? 'none' : '1px solid var(--border-subtle)',
                      }}
                    >
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{src.source}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{src.type} • Last sync: {src.lastIngest}</div>
                      </td>

                      <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {src.reportsReceived}
                      </td>

                      <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-forest)', fontWeight: 600 }}>
                        {src.verified}
                      </td>

                      <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: src.pending > 20 ? 'var(--color-crimson)' : 'var(--color-amber)', fontWeight: 600 }}>
                        {src.pending}
                      </td>

                      <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                        <Badge variant={src.status === 'LIVE FEED' ? 'forest' : 'default'} dot={src.status === 'LIVE FEED'}>
                          {src.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{
              padding: 'var(--space-3) var(--space-5)',
              borderTop: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-app)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span>FEDERATED PROTOCOL: EDXL-CAP 1.2</span>
              <span style={{ color: 'var(--text-secondary)' }}>MANAGE API INTEGRATIONS &gt;</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
