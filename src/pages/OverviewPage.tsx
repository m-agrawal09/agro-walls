import React, { useState } from 'react';
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

interface VerificationItem {
  caseId: string;
  name: string;
  ageGender: string;
  location: string;
  source: string;
  matchTarget: string;
  confidence: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: 'PENDING FIELD CHECK' | 'PHOTO REVIEW' | 'BIOMETRIC CORRELATED';
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
  const [selectedDisaster, setSelectedDisaster] = useState('Central India Flood Response');
  const [disasterFilterOpen, setDisasterFilterOpen] = useState(false);

  const disastersList = [
    { name: 'Central India Flood Response', region: 'Madhya Pradesh / Narmada Basin', status: 'LEVEL 3 CRITICAL', cases: 1284 },
    { name: 'Assam Brahmaputra Surge 2026', region: 'Dhubri / Barpeta Sector', status: 'LEVEL 2 ELEVATED', cases: 412 },
    { name: 'Coastal Cyclone Sagar Monitoring', region: 'Odisha Coastal Belt', status: 'STANDBY WATCH', cases: 58 },
  ];

  const verificationQueue: VerificationItem[] = [
    {
      caseId: 'RC-CIF-0941',
      name: 'Ramesh Chandra Verma',
      ageGender: '58 M',
      location: 'Hoshangabad Ghat Sector 4',
      source: 'District Civil Hospital Ward 3',
      matchTarget: 'Report #CIF-8812 (Filed by son)',
      confidence: 96,
      priority: 'CRITICAL',
      status: 'PHOTO REVIEW',
      reportedAgo: '12m ago',
    },
    {
      caseId: 'RC-CIF-0938',
      name: 'Sunita Devi Ahirwar',
      ageGender: '34 F',
      location: 'Vidisha Relief Camp #2',
      source: 'Red Cross Field Team B',
      matchTarget: 'Helpline Tip #1070-492',
      confidence: 91,
      priority: 'HIGH',
      status: 'PENDING FIELD CHECK',
      reportedAgo: '24m ago',
    },
    {
      caseId: 'RC-CIF-0935',
      name: 'Aarav Sharma',
      ageGender: '8 M',
      location: 'Sehore Govt High School Shelter',
      source: 'Childline 1098 Ingest',
      matchTarget: 'Intake #CIF-8760 (Unaccompanied)',
      confidence: 94,
      priority: 'CRITICAL',
      status: 'PHOTO REVIEW',
      reportedAgo: '38m ago',
    },
    {
      caseId: 'RC-CIF-0929',
      name: 'Mohammad Farooq Siddiqui',
      ageGender: '62 M',
      location: 'Narmada Valley Rescue Sector 9',
      source: 'NDRF 11 Bn Field Log',
      matchTarget: 'Report #CIF-8902 (Diabetic alert)',
      confidence: 88,
      priority: 'HIGH',
      status: 'BIOMETRIC CORRELATED',
      reportedAgo: '52m ago',
    },
    {
      caseId: 'RC-CIF-0922',
      name: 'Lakshmi Bai Lodhi',
      ageGender: '46 F',
      location: 'Bhopal Central Intake Tents',
      source: 'Citizen Web Portal Tip',
      matchTarget: 'Intake #CIF-8651 (Hospital list)',
      confidence: 84,
      priority: 'MEDIUM',
      status: 'PENDING FIELD CHECK',
      reportedAgo: '1h 14m ago',
    },
  ];

  const recentActivity: ActivityItem[] = [
    {
      id: 'ACT-491',
      timestamp: '17:16:04 LOC',
      source: 'State Helpline 1070',
      sourceType: 'HELPLINE',
      action: 'Direct sighting reported near Budhni railway bridge',
      person: 'Ganesh Ram Yadav (42 M)',
      caseId: 'RC-CIF-0899',
      operator: 'DISP-412',
      status: 'INTAKE',
    },
    {
      id: 'ACT-490',
      timestamp: '17:12:30 LOC',
      source: 'AIIMS Field Hospital',
      sourceType: 'HOSPITAL',
      action: 'Admitted unconscious patient matched with missing notice',
      person: 'Pooja Tiwari (27 F)',
      caseId: 'RC-CIF-0914',
      operator: 'DISP-884',
      status: 'MATCH',
    },
    {
      id: 'ACT-489',
      timestamp: '17:05:18 LOC',
      source: 'Relief Camp Sector 3',
      sourceType: 'RELIEF CAMP',
      action: 'Family liaison completed physical verification & reunion confirmed',
      person: 'Anand Kumar Mishra (14 M)',
      caseId: 'RC-CIF-0782',
      operator: 'DISP-204',
      status: 'VERIFIED',
    },
    {
      id: 'ACT-488',
      timestamp: '16:58:42 LOC',
      source: 'SEEDS India Volunteer Cell',
      sourceType: 'NGO',
      action: 'Shelter intake roster synchronized (48 evacuees logged)',
      person: 'Batch Ingest Sector B',
      caseId: 'BATCH-042',
      operator: 'SYS-AUTO',
      status: 'INTAKE',
    },
    {
      id: 'ACT-487',
      timestamp: '16:49:11 LOC',
      source: 'NDRF Boat Unit 4',
      sourceType: 'VOLUNTEER',
      action: 'Critical medical flag: Displaced elder rescued without insulin',
      person: 'Deendayal Upadhyay (71 M)',
      caseId: 'RC-CIF-0943',
      operator: 'DISP-884',
      status: 'ALERT',
    },
    {
      id: 'ACT-486',
      timestamp: '16:37:55 LOC',
      source: 'Public Web Portal',
      sourceType: 'PUBLIC',
      action: 'New missing child report filed with photo and last GPS tag',
      person: 'Meera Patel (6 F)',
      caseId: 'RC-CIF-0945',
      operator: 'DISP-309',
      status: 'INTAKE',
    },
  ];

  const sourceStats: SourceStat[] = [
    { source: 'Emergency Helplines (1070 / 112)', type: 'Voice Call Center', reportsReceived: 512, verified: 340, pending: 18, lastIngest: '2m ago', status: 'LIVE FEED' },
    { source: 'District & Military Field Hospitals', type: 'Clinical Ingest API', reportsReceived: 294, verified: 268, pending: 4, lastIngest: '4m ago', status: 'LIVE FEED' },
    { source: 'Disaster Relief Camps & Shelters', type: 'On-site Camp Roster', reportsReceived: 648, verified: 512, pending: 22, lastIngest: '1m ago', status: 'LIVE FEED' },
    { source: 'Accredited NGOs (Red Cross, SEEDS)', type: 'Verified Partner Feed', reportsReceived: 286, verified: 218, pending: 11, lastIngest: '9m ago', status: 'STABLE' },
    { source: 'Field Volunteers & Ham Radio', type: 'Triage Submission App', reportsReceived: 174, verified: 98, pending: 27, lastIngest: '14m ago', status: 'STABLE' },
    { source: 'Public Portal & WhatsApp Tip Line', type: 'Citizen Submissions', reportsReceived: 428, verified: 210, pending: 64, lastIngest: '30s ago', status: 'LIVE FEED' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100%' }}>
      {/* Editorial Disaster Command Header */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-base)',
          padding: 'var(--space-5) var(--space-8)',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}>
          {/* Title & Subtitle */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontSize: 'var(--text-xs)',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              marginBottom: 'var(--space-1)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>
              <span>DISASTER COMMAND CENTER</span>
              <span>/</span>
              <span>SITUATIONAL OPERATIONAL OVERVIEW</span>
            </div>
            <h1 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 600,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              marginBottom: '4px',
            }}>
              Missing Person Coordination
            </h1>
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
            }}>
              Centralized intake, identity matching and human verification.
            </p>
          </div>

          {/* Active Event Selector & SitRep Controls */}
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
                  padding: '6px 12px',
                  height: '38px',
                  backgroundColor: 'var(--bg-surface)',
                  cursor: 'pointer',
                  borderColor: 'var(--border-strong)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <StatusDot variant="crimson" pulse size={8} />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', lineHeight: 1.15 }}>
                    <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      ACTIVE EVENT
                    </span>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {selectedDisaster}
                    </span>
                  </div>
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
                  <div style={{ padding: '6px 12px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
                    SELECT DECLARED DISASTER OPERATION
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
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</span>
                        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-crimson)' }}>{item.cases} CASES</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                        <span>{item.region}</span>
                        <span style={{ fontFamily: 'var(--font-mono)' }}>{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className="btn btn-secondary" style={{ height: '38px' }} title="Download Operational Situation Report">
              <Download size={14} />
              <span>Export SitRep</span>
            </button>

            <button 
              onClick={() => navigate('/report/new')}
              className="btn btn-primary" 
              style={{ height: '38px' }}
            >
              <span>+ Intake Case</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Operational Dashboard Content */}
      <div style={{
        padding: 'var(--space-6) var(--space-8)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
      }}>
        {/* KEY OPERATIONAL METRICS (Top Row) */}
        <div>
          <div style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 'var(--space-2)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}>
            <span>INCIDENT TELEMETRY SNAPSHOT</span>
            <span>—</span>
            <span style={{ color: 'var(--text-secondary)' }}>UPDATED: REAL-TIME (CAD FEED 12ms)</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-3)',
          }}>
            {/* Metric 1: Active Missing Cases */}
            <div className="surface-card" style={{ padding: 'var(--space-4) var(--space-5)', borderTop: '3px solid var(--color-crimson)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  ACTIVE MISSING
                </span>
                <Badge variant="crimson" dot>
                  UNRESOLVED
                </Badge>
              </div>
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                1,284
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Total open missing person records
              </div>
            </div>

            {/* Metric 2: Found / Rescued */}
            <div className="surface-card" style={{ padding: 'var(--space-4) var(--space-5)', borderTop: '3px solid var(--color-forest)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  FOUND / RESCUED
                </span>
                <Badge variant="forest">
                  +38 PAST 24H
                </Badge>
              </div>
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-forest)', letterSpacing: '-0.03em' }}>
                472
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Reunited or safely registered at shelters
              </div>
            </div>

            {/* Metric 3: Potential Matches */}
            <div className="surface-card" style={{ padding: 'var(--space-4) var(--space-5)', borderTop: '3px solid var(--color-amber)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  POTENTIAL MATCHES
                </span>
                <Badge variant="amber">
                  HIGH CONFIDENCE
                </Badge>
              </div>
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-amber)', letterSpacing: '-0.03em' }}>
                86
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Algorithmic correlations pending check
              </div>
            </div>

            {/* Metric 4: Awaiting Verification */}
            <div className="surface-card" style={{ padding: 'var(--space-4) var(--space-5)', borderTop: '3px solid var(--color-amber)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  AWAITING VERIFICATION
                </span>
                <Badge variant="default">
                  TRIAGE QUEUE
                </Badge>
              </div>
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                31
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Assigned to field operators & liaison officers
              </div>
            </div>

            {/* Metric 5: High Priority */}
            <div className="surface-card" style={{ padding: 'var(--space-4) var(--space-5)', borderTop: '3px solid var(--color-crimson)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  HIGH PRIORITY
                </span>
                <Badge variant="crimson" dot>
                  URGENT SAR
                </Badge>
              </div>
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-crimson)', letterSpacing: '-0.03em' }}>
                18
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Unaccompanied minors, critical medical need
              </div>
            </div>
          </div>
        </div>

        {/* 1. CASE RESOLUTION PIPELINE */}
        <div className="surface-card" style={{ padding: 'var(--space-5) var(--space-6)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-4)',
            paddingBottom: 'var(--space-3)',
            borderBottom: '1px solid var(--border-subtle)',
          }}>
            <div>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                WORKFLOW DISPATCH ENGINE
              </div>
              <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--text-primary)' }}>
                Case Resolution Pipeline
              </h2>
            </div>
            <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              THROUGHPUT: 142 CASES / HOUR
            </span>
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
                {verificationQueue.map((item, idx) => (
                  <tr
                    key={item.caseId}
                    style={{
                      borderBottom: idx === verificationQueue.length - 1 ? 'none' : '1px solid var(--border-subtle)',
                      transition: 'background-color 0.1s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {/* Case ID */}
                    <td style={{ padding: '10px 16px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.caseId}
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
                        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                          {item.status}
                        </span>
                      </div>
                    </td>

                    {/* Action */}
                    <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                      <button
                        onClick={() => navigate('/verification')}
                        className="btn btn-secondary"
                        style={{ height: '28px', padding: '0 10px', fontSize: '12px' }}
                      >
                        <FileCheck size={13} />
                        <span>Verify</span>
                      </button>
                    </td>
                  </tr>
                ))}
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
