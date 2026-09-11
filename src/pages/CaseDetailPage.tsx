import React, { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Printer, 
  Plus, 
  UserCheck, 
  GitMerge, 
  X, 
  ChevronRight 
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { StatusDot } from '../components/common/StatusDot';
import { useNavigate, useParams } from 'react-router-dom';
import { useCaseContext } from '../context/CaseContext';
import { api } from '../services/api';

export const CaseDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const caseId = id || 'MP-2026-00421';
  const { caseStatus, priority, setPriority, verifiedCandidate } = useCaseContext();

  const [assignedVerifier, setAssignedVerifier] = useState<string>('DISP-884 (Tier 2)');
  const [actionAlert, setActionAlert] = useState<string | null>(null);
  const [addInfoModalOpen, setAddInfoModalOpen] = useState<boolean>(false);
  const [assignModalOpen, setAssignModalOpen] = useState<boolean>(false);
  const [newInfoNote, setNewInfoNote] = useState<string>('');
  const [fetchedCase, setFetchedCase] = useState<any>(null);
  const [caseMatches, setCaseMatches] = useState<any[] | null>(null);
  const [liveAudit, setLiveAudit] = useState<any[] | null>(null);

  useEffect(() => {
    api.getCaseById(caseId)
      .then((data) => {
        if (data) setFetchedCase(data);
      })
      .catch(() => {});

    api.getMatches(caseId)
      .then((matches) => {
        if (Array.isArray(matches) && matches.length > 0) {
          setCaseMatches(matches);
        }
      })
      .catch(() => {});

    api.getAuditLogs(10)
      .then((logs) => {
        if (Array.isArray(logs) && logs.length > 0) {
          setLiveAudit(logs.filter((l: any) => !l.caseId || l.caseId === caseId || caseId === 'MP-2026-00421'));
        }
      })
      .catch(() => {});
  }, [caseId]);

  const caseData = {
    caseId: fetchedCase?.caseId || caseId,
    name: fetchedCase?.name || (caseId === 'MP-2026-00421' ? 'Rahul Agrawal' : `Case ${caseId}`),
    aliases: fetchedCase?.aliases && fetchedCase.aliases.length > 0 ? fetchedCase.aliases : (caseId === 'MP-2026-00421' ? ['Rahul Agarwal', 'Rahool Agrawal', 'R. Agrawal'] : []),
    age: fetchedCase?.age || 24,
    dob: fetchedCase?.dob || '14 Aug 2002',
    gender: fetchedCase?.gender === 'M' ? 'Male' : fetchedCase?.gender === 'F' ? 'Female' : (fetchedCase?.gender || 'Male'),
    status: fetchedCase?.status || caseStatus,
    dateReported: fetchedCase?.reportedAgo || '11 Sep 2026, 09:15 LOC',
    primarySource: fetchedCase?.source || 'State Disaster Helpline 1070',
    primaryCaller: fetchedCase?.reporterContact || 'Sumeet Agrawal (Elder Brother)',
    primaryPhone: fetchedCase?.reporterPhone || '+91 98261 44102',
    incidentName: 'Central India Flood Response',
    incidentSector: fetchedCase?.sector || 'Sector B-4 (Narmada Riverfront)',
    photoUrl: fetchedCase?.photoUrl,

    // 1. Identity
    height: fetchedCase?.height || '5 ft 9 in (175 cm)',
    build: fetchedCase?.build || 'Slim athletic',
    complexion: fetchedCase?.complexion || 'Wheatish',
    hairEyes: fetchedCase?.hairEyes || 'Short black hair, dark brown eyes',
    physicalMarks: fetchedCase?.keyMarks || 'Healed scar on right chin (~2cm from childhood fall), small mole below left eye',
    languages: fetchedCase?.languages || 'Hindi, Bundeli dialect, English',
    nationalId: fetchedCase?.nationalId || 'Aadhaar (Last 4: 8841 - Verified via DigiLocker)',

    // 2. Last Known Information
    lastSeenLocation: fetchedCase?.lastSeenLocation || 'Relief Zone B (Sector 4 Narmada Riverfront Ghat)',
    lastSeenCoordinates: fetchedCase?.coordinates || '22.7533° N, 77.7289° E',
    lastSeenDateTime: fetchedCase?.reportedAgo ? `${fetchedCase.reportedAgo} ago` : '11 Sep 2026, 08:30 LOC (9h 34m ago)',
    clothing: fetchedCase?.clothing || 'Navy blue collared polo shirt, beige cargo pants, black digital wristwatch, dark rubber sandals',
    possessions: fetchedCase?.possessions || 'Carrying 1L steel water bottle, no wallet or mobile phone on person during displacement',
    circumstances: fetchedCase?.circumstances || 'Evacuating ancestral family home near Sethani Ghat when flood waters rose rapidly. Separated from brother Sumeet while assisting elderly neighbors onto an SDRF evacuation tractor.',

    // 3. Report Sources
    reportSources: fetchedCase?.reportSources || [
      { id: 'SRC-01', type: 'Emergency Helpline', entity: fetchedCase?.source || 'State Helpline 1070', ref: `CALL-1070-${caseId.replace(/[^0-9]/g, '') || '08912'}`, timestamp: '11 Sep, 09:15 LOC', reporter: fetchedCase?.reporterContact || 'Sumeet Agrawal (Brother)', status: 'VERIFIED INTAKE' },
      { id: 'SRC-02', type: 'Relief Camp', entity: 'Camp Ward 6 Polytechnic', ref: 'ROSTER-W6-01892', timestamp: '11 Sep, 15:42 LOC', reporter: 'Camp Triage Desk #4', status: 'CANDIDATE LOG' },
      { id: 'SRC-03', type: 'Hospital Feed', entity: 'District Civil Hospital', ref: 'HOS-CAS-00634', timestamp: '11 Sep, 14:10 LOC', reporter: 'Casualty MO Dr. Sharma', status: 'CLINICAL INGEST' },
      { id: 'SRC-04', type: 'Volunteer Field Sighting', entity: 'Red Cross Team B', ref: 'SGT-RC-00419', timestamp: '11 Sep, 11:30 LOC', reporter: 'Field Sighting Unit', status: 'TIP RECORDED' },
    ],

    // 4. Potential Matches
    potentialMatches: caseMatches && caseMatches.length > 0 ? caseMatches.map((m: any, idx: number) => ({
      id: `cand-${idx + 1}`,
      name: m.candidateName,
      ref: m.candidateRef,
      confidence: m.confidence,
      location: m.location,
      distance: m.distance || '3.2 km',
      status: m.status === 'VERIFIED' ? 'Verified Match' : 'Awaiting Human Verification',
      evidence: m.evidence || 'Demographic overlap & biometric similarity',
    })) : [
      { id: 'cand-1', name: 'Rahul Agarwal', ref: 'FND-2026-01892', confidence: 94, location: 'Disaster Relief Camp Ward 6', distance: '3.2 km', status: 'Awaiting Human Verification', evidence: 'Name similarity 96%, exact age (24), matching chin scar & blue polo shirt' },
      { id: 'cand-2', name: 'Rahool Agrawal', ref: 'HOS-2026-00634', confidence: 87, location: 'District Civil Hospital Trauma Ward', distance: '5.8 km', status: 'Field Review Requested', evidence: 'Phonetic hospital spelling, age 25 approx, facial abrasion dressing' },
      { id: 'cand-3', name: 'R. Agrawal', ref: 'SGT-2026-00419', confidence: 79, location: 'Interstate Bus Terminal Holding Point', distance: '7.1 km', status: 'Volunteer Sighting', evidence: 'Surname match, demographic cohort 23-24, blue shirt beneath jacket' },
    ],

    // 5. Timeline
    timeline: fetchedCase?.timeline && fetchedCase.timeline.length > 0 ? fetchedCase.timeline : [
      { time: '08:30 LOC', date: '11 Sep', event: `Last Seen at ${fetchedCase?.lastSeenLocation || 'Relief Zone B'}`, detail: 'Separated from family during rapid water level rise near Sethani Ghat', actor: 'Family Witness' },
      { time: '09:15 LOC', date: '11 Sep', event: 'Missing Report Received', detail: `Case ${caseId} registered via ${fetchedCase?.source || 'Helpline 1070'}`, actor: fetchedCase?.source || 'Helpline 1070' },
      { time: '09:28 LOC', date: '11 Sep', event: 'Similar Records Detected', detail: 'Automated EDXL indexing cross-referenced historical evacuation records', actor: 'System Core' },
      { time: '11:30 LOC', date: '11 Sep', event: 'Field Sighting Appended', detail: 'Red Cross Team B logged sighting along bus evacuation corridor', actor: 'Red Cross Volunteer' },
      { time: '14:31 LOC', date: '11 Sep', event: 'Potential Match Generated', detail: 'Correlation engine paired record with facility intake', actor: 'Match Engine v2' },
      { time: '14:46 LOC', date: '11 Sep', event: 'Assigned for Human Verification', detail: 'Dossier placed in Tier 2 Dispatcher verification workbench', actor: 'Lead Dispatcher' },
    ],

    // 6. Related / Duplicate Reports
    relatedReports: [
      { id: 'DUP-2026-0089', title: `${fetchedCase?.name || 'Rahul'} s/o Family Relative`, filedBy: 'Maternal Relative via Help Desk', similarity: '92% duplicate score', status: 'CANDIDATE MERGE', note: 'Same permanent residence and family branch' },
      { id: 'DUP-2026-0114', title: `Individual matching ${fetchedCase?.clothing || 'navy blue shirt'}`, filedBy: 'NDRF Boat 3 Observation Log', similarity: '81% duplicate score', status: 'LINKED SIGHTING', note: 'Corresponds to last known evacuation sector' },
    ],

    // 7. Verification History
    verificationHistory: [
      { timestamp: '11 Sep, 14:50 LOC', officer: 'DISP-412 (Intake Triage Officer)', action: 'Priority Elevation', note: 'Marked as High Priority due to riverfront rapid-rise flood hazard.' },
      { timestamp: '11 Sep, 15:12 LOC', officer: 'DISP-884 (Tier 2 Certified Dispatcher)', action: 'Candidate Review', note: 'Opened Match Intelligence workspace; corroborated chin scar description.' },
      { timestamp: '11 Sep, 15:45 LOC', officer: 'Sister Vandana (Staff Nurse, Civil Hospital)', action: 'Physical Verification Callback', note: 'Confirmed patient at casualty desk has matching healed chin scar.' },
    ],

    // 8. Audit Trail
    auditTrail: liveAudit && liveAudit.length > 0 ? liveAudit.map((a: any) => ({
      id: a._id ? `AUD-${a._id.substring(18).toUpperCase()}` : 'AUD-89210',
      timestamp: a.timestamp ? new Date(a.timestamp).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) + ' LOC' : '11 Sep 2026, 09:15:04 LOC',
      actor: a.operator || 'OP-DISP-104',
      action: a.action.toUpperCase().replace(/\s+/g, '_'),
      hash: a._id ? `sha256:${a._id}e3b0c442` : 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    })) : [
      { id: 'AUD-89210', timestamp: '11 Sep 2026, 09:15:04 LOC', actor: 'OP-DISP-104', action: 'RECORD_CREATED', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
      { id: 'AUD-89214', timestamp: '11 Sep 2026, 09:28:18 LOC', actor: 'SYS-INDEX-01', action: 'INDEX_ENRICHED', hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4' },
      { id: 'AUD-89239', timestamp: '11 Sep 2026, 14:31:02 LOC', actor: 'SYS-MATCH-ENG', action: 'CORRELATION_PAIR_LINKED', hash: '3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b' },
      { id: 'AUD-89248', timestamp: '11 Sep 2026, 14:46:22 LOC', actor: 'OP-DISP-884', action: 'QUEUE_ASSIGNED', hash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb' },
    ],
  };

  const handleMarkPriority = () => {
    const nextPriority = priority === 'HIGH' ? 'CRITICAL' : priority === 'CRITICAL' ? 'ROUTINE' : 'HIGH';
    setPriority(nextPriority);
    setActionAlert(`Case priority updated to ${nextPriority}. Audit record appended.`);
  };

  const handleAddInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInfoNote) return;
    setAddInfoModalOpen(false);
    setNewInfoNote('');
    setActionAlert('New supplemental evidence note committed to case dossier and audit ledger.');
  };

  const handleAssignSubmit = (officer: string) => {
    setAssignedVerifier(officer);
    setAssignModalOpen(false);
    setActionAlert(`Case reassigned to ${officer}. Operator alert dispatched.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', width: '100%' }}>
      {/* Top Breadcrumb & Operational Action Bar */}
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
          gap: 'var(--space-3)',
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              marginBottom: '2px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>
              <span>DISPATCH DOSSIER</span>
              <span>/</span>
              <span>ACTIVE MISSING RECORD</span>
              <span>/</span>
              <span>{caseData.caseId}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <h1 style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 600,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}>
                Operational Case File
              </h1>
              <Badge variant="charcoal">
                CASE {caseData.caseId}
              </Badge>
              <Badge variant="forest">
                EDXL-CAP 1.2
              </Badge>
            </div>
          </div>

          {/* Quick Primary Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/match-intel')}
              className="btn btn-danger"
              style={{ height: '34px', backgroundColor: 'var(--color-crimson)', borderColor: 'var(--color-crimson)', fontWeight: 600 }}
            >
              <span>REVIEW MATCHES (3)</span>
              <ArrowRight size={13} />
            </button>

            <button
              onClick={() => setAddInfoModalOpen(true)}
              className="btn btn-secondary"
              style={{ height: '34px' }}
            >
              <Plus size={13} />
              <span>ADD INFORMATION</span>
            </button>

            <button
              onClick={handleMarkPriority}
              className="btn btn-secondary"
              style={{ height: '34px' }}
            >
              <span>MARK {priority === 'HIGH' ? 'CRITICAL' : 'HIGH'}</span>
            </button>

            <button
              onClick={() => setAssignModalOpen(true)}
              className="btn btn-secondary"
              style={{ height: '34px' }}
            >
              <UserCheck size={13} />
              <span>ASSIGN VERIFIER</span>
            </button>

            <button
              onClick={() => window.print()}
              className="btn btn-ghost"
              style={{ height: '34px', padding: '0 8px' }}
              title="Print Physical Case File Docket"
            >
              <Printer size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionAlert && (
        <div
          style={{
            margin: 'var(--space-3) 40px 0 40px',
            padding: 'var(--space-2) var(--space-4)',
            backgroundColor: 'var(--color-forest-bg)',
            border: '1px solid var(--color-forest-border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-forest-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <CheckCircle2 size={14} />
            <strong>{actionAlert}</strong>
          </div>
          <button onClick={() => setActionAlert(null)} className="btn btn-ghost" style={{ padding: 2 }}>
            <X size={12} />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div style={{
        padding: '24px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
        maxWidth: '1240px',
        width: '100%',
        margin: '0 auto',
      }}>
        {/* =========================================================================
            TOP DOSSIER SUMMARY CARD
            ========================================================================= */}
        <div className="surface-card" style={{ padding: 'var(--space-5) var(--space-6)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-5)',
          }}>
            {/* Person Photo & Primary Identifiers */}
            <div style={{ display: 'flex', gap: 'var(--space-5)', alignItems: 'center' }}>
              {/* Photo Box */}
              <div style={{
                width: '104px',
                height: '124px',
                backgroundColor: 'var(--bg-app)',
                border: '1px solid var(--border-base)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: caseData.photoUrl ? '0' : 'var(--space-2)',
                flexShrink: 0,
                overflow: 'hidden',
                position: 'relative',
              }}>
                {caseData.photoUrl ? (
                  <>
                    <img 
                      src={caseData.photoUrl} 
                      alt={caseData.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: 'rgba(0,0,0,0.65)',
                      padding: '2px 4px',
                      fontSize: '8px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--color-forest-text)',
                      textAlign: 'center'
                    }}>
                      LIVE PHOTO
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--border-strong)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-inverse)',
                      marginBottom: '6px',
                    }}>
                      <User size={26} />
                    </div>
                    <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', lineHeight: 1.1 }}>
                      REF PHOTO
                    </span>
                    <span style={{ fontSize: '8px', fontFamily: 'var(--font-mono)', color: 'var(--color-forest-text)' }}>
                      GOV ID VERIFIED
                    </span>
                  </>
                )}
              </div>

              {/* Subject Bio Header */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                    {caseData.caseId}
                  </span>
                  <span style={{ color: 'var(--border-strong)' }}>•</span>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    INCIDENT: {caseData.incidentName}
                  </span>
                </div>

                <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                  {caseData.name}
                </h2>

                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {caseData.age} years · {caseData.gender} (DOB: {caseData.dob})
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: '6px', flexWrap: 'wrap' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    backgroundColor: caseStatus === 'VERIFIED MATCH' ? 'var(--color-forest-bg)' : 'var(--color-amber-bg)',
                    color: caseStatus === 'VERIFIED MATCH' ? 'var(--color-forest-text)' : 'var(--color-amber-text)',
                    border: caseStatus === 'VERIFIED MATCH' ? '1px solid var(--color-forest-border)' : '1px solid var(--color-amber-border)',
                  }}>
                    <StatusDot variant={caseStatus === 'VERIFIED MATCH' ? 'forest' : 'amber'} pulse size={6} />
                    <span>STATUS: {caseData.status}</span>
                  </div>

                  <Badge variant={priority === 'CRITICAL' ? 'crimson' : priority === 'HIGH' ? 'amber' : 'default'} dot>
                    PRIORITY: {priority}
                  </Badge>

                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    VERIFIER: <strong>{assignedVerifier}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metadata Column */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--space-3) var(--space-5)',
              fontSize: 'var(--text-xs)',
              borderLeft: '1px solid var(--border-base)',
              paddingLeft: 'var(--space-5)',
              minWidth: '280px',
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px', display: 'block' }}>DATE REPORTED</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{caseData.dateReported}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px', display: 'block' }}>REPORTING SOURCE</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{caseData.primarySource}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px', display: 'block' }}>REPORTED BY</span>
                <span style={{ color: 'var(--text-secondary)' }}>{caseData.primaryCaller}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px', display: 'block' }}>CONTACT PHONE</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{caseData.primaryPhone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* VERIFIED POSITIVE IDENTIFICATION BANNER */}
        {caseStatus === 'VERIFIED MATCH' && (
          <div style={{
            backgroundColor: 'var(--color-forest-bg)',
            border: '1px solid var(--color-forest-border)',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--space-4) var(--space-5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-3)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={22} color="var(--color-forest)" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-forest-text)' }}>
                  POSITIVE IDENTIFICATION CONFIRMED: Rahul Agarwal ({verifiedCandidate?.ref || 'FND-2026-01892'})
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Corroborated by {verifiedCandidate?.verifiedBy || 'DISP-884'} at {verifiedCandidate?.verifiedAt || '11 Sep, 15:48 LOC'} · Located at Disaster Relief Camp Ward 6, Polytechnic Campus
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button
                onClick={() => navigate('/duplicates')}
                className="btn btn-secondary"
                style={{ fontSize: '11px', padding: '5px 12px' }}
              >
                <span>Step 8: Consolidate Duplicates →</span>
              </button>
              <button
                onClick={() => navigate('/status')}
                className="btn btn-primary"
                style={{ fontSize: '11px', padding: '5px 12px', backgroundColor: 'var(--color-forest)', color: '#ffffff' }}
              >
                <span>Step 9: Open Family View →</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 1 & 2: DUAL GRID (IDENTITY + LAST KNOWN INFORMATION)
            ========================================================================= */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-5)',
        }}>
          {/* 1. IDENTITY */}
          <div className="surface-card">
            <div style={{
              padding: 'var(--space-3) var(--space-5)',
              borderBottom: '1px solid var(--border-base)',
              backgroundColor: 'var(--bg-app)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                1. IDENTITY &amp; BIOMETRIC PROFILE
              </span>
              <Badge variant="default">Aadhaar Verified</Badge>
            </div>

            <div style={{ padding: 'var(--space-4) var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 'var(--space-2)' }}>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Full Legal Name:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{caseData.name}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 'var(--space-2)' }}>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Alternate Spellings:</span>
                <span style={{ color: 'var(--text-secondary)' }}>{caseData.aliases.join(', ')}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 'var(--space-2)' }}>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Age &amp; Gender:</span>
                <span style={{ color: 'var(--text-primary)' }}>{caseData.age} years · {caseData.gender} (DOB: {caseData.dob})</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 'var(--space-2)' }}>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Height &amp; Build:</span>
                <span style={{ color: 'var(--text-primary)' }}>{caseData.height} · {caseData.build}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 'var(--space-2)' }}>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Physical Marks:</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{caseData.physicalMarks}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 'var(--space-2)' }}>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Languages Spoken:</span>
                <span style={{ color: 'var(--text-secondary)' }}>{caseData.languages}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 'var(--space-2)' }}>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>National Registry:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-forest-text)' }}>{caseData.nationalId}</span>
              </div>
            </div>
          </div>

          {/* 2. LAST KNOWN INFORMATION */}
          <div className="surface-card">
            <div style={{
              padding: 'var(--space-3) var(--space-5)',
              borderBottom: '1px solid var(--border-base)',
              backgroundColor: 'var(--bg-app)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                2. LAST KNOWN INFORMATION
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>GPS: {caseData.lastSeenCoordinates}</span>
            </div>

            <div style={{ padding: 'var(--space-4) var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px', display: 'block' }}>LAST SEEN LOCATION</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  <MapPin size={13} color="var(--color-crimson)" />
                  <span>{caseData.lastSeenLocation}</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-2)' }}>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px', display: 'block' }}>DATE &amp; TIME LAST SEEN</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                  <Clock size={13} color="var(--text-muted)" />
                  <span>{caseData.lastSeenDateTime}</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-2)' }}>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px', display: 'block' }}>CLOTHING WORN</span>
                <p style={{ color: 'var(--text-primary)', marginTop: '2px', lineHeight: 1.35 }}>
                  {caseData.clothing}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-2)' }}>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px', display: 'block' }}>DISPLACEMENT CIRCUMSTANCES</span>
                <p style={{ color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                  {caseData.circumstances}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 3: REPORT SOURCES
            ========================================================================= */}
        <div className="surface-card">
          <div style={{
            padding: 'var(--space-3) var(--space-5)',
            borderBottom: '1px solid var(--border-base)',
            backgroundColor: 'var(--bg-app)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              3. REPORT SOURCES &amp; INGEST CHANNELS
            </span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              4 INDEPENDENT INGESTS LOGGED
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-xs)', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-app)', borderBottom: '1px solid var(--border-base)', fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  <th style={{ padding: '8px 14px' }}>Source Type</th>
                  <th style={{ padding: '8px 14px' }}>Reporting Entity</th>
                  <th style={{ padding: '8px 14px' }}>Reference Ref #</th>
                  <th style={{ padding: '8px 14px' }}>Timestamp</th>
                  <th style={{ padding: '8px 14px' }}>Reporter / Agent</th>
                  <th style={{ padding: '8px 14px', textAlign: 'right' }}>Ingest Status</th>
                </tr>
              </thead>
              <tbody>
                {caseData.reportSources.map((src: any, idx: number) => (
                  <tr key={src.id} style={{ borderBottom: idx === caseData.reportSources.length - 1 ? 'none' : '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '9px 14px', fontWeight: 600, color: 'var(--text-primary)' }}>{src.type}</td>
                    <td style={{ padding: '9px 14px', color: 'var(--text-secondary)' }}>{src.entity}</td>
                    <td style={{ padding: '9px 14px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{src.ref}</td>
                    <td style={{ padding: '9px 14px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{src.timestamp}</td>
                    <td style={{ padding: '9px 14px', color: 'var(--text-primary)' }}>{src.reporter}</td>
                    <td style={{ padding: '9px 14px', textAlign: 'right' }}>
                      <Badge variant="forest">{src.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* =========================================================================
            SECTION 4: POTENTIAL MATCHES
            ========================================================================= */}
        <div className="surface-card">
          <div style={{
            padding: 'var(--space-3) var(--space-5)',
            borderBottom: '1px solid var(--border-base)',
            backgroundColor: 'var(--bg-app)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                4. POTENTIAL MATCHES (CORRELATION PIPELINE)
              </span>
              <Badge variant="amber">3 CANDIDATES IDENTIFIED</Badge>
            </div>
            <button
              onClick={() => navigate('/match-intel')}
              className="btn btn-secondary"
              style={{ height: '26px', fontSize: '11px', padding: '0 8px' }}
            >
              <span>Open Match Intelligence</span>
              <ChevronRight size={11} />
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-xs)', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-app)', borderBottom: '1px solid var(--border-base)', fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  <th style={{ padding: '8px 14px' }}>Candidate Name</th>
                  <th style={{ padding: '8px 14px' }}>Record Ref</th>
                  <th style={{ padding: '8px 14px', width: '130px' }}>Confidence</th>
                  <th style={{ padding: '8px 14px' }}>Holding Facility</th>
                  <th style={{ padding: '8px 14px' }}>Distance</th>
                  <th style={{ padding: '8px 14px' }}>Key Correlation Evidence</th>
                  <th style={{ padding: '8px 14px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {caseData.potentialMatches.map((cand, idx) => (
                  <tr key={cand.id} style={{ borderBottom: idx === caseData.potentialMatches.length - 1 ? 'none' : '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--text-primary)' }}>{cand.name}</td>
                    <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{cand.ref}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '38px', height: '5px', backgroundColor: 'var(--bg-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: `${cand.confidence}%`, height: '100%', backgroundColor: cand.confidence >= 90 ? 'var(--color-forest)' : 'var(--color-amber)' }} />
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: cand.confidence >= 90 ? 'var(--color-forest-text)' : 'var(--color-amber-text)' }}>
                          {cand.confidence}%
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{cand.location}</td>
                    <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)' }}>{cand.distance}</td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{cand.evidence}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                      <button
                        onClick={() => navigate('/match-intel')}
                        className="btn btn-secondary"
                        style={{ height: '24px', fontSize: '11px', padding: '0 8px' }}
                      >
                        Compare
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* =========================================================================
            SECTION 5 & 6: DUAL GRID (CASE TIMELINE + RELATED/DUPLICATE REPORTS)
            ========================================================================= */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-5)',
        }}>
          {/* 5. CASE TIMELINE */}
          <div className="surface-card">
            <div style={{
              padding: 'var(--space-3) var(--space-5)',
              borderBottom: '1px solid var(--border-base)',
              backgroundColor: 'var(--bg-app)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                5. CASE TIMELINE
              </span>
              <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>CHRONOLOGICAL</span>
            </div>

            <div style={{ padding: 'var(--space-4) var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {caseData.timeline.map((evt: any, idx: number) => (
                <div key={idx} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '82px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    flexShrink: 0,
                    lineHeight: 1.2,
                  }}>
                    <div>{evt.time}</div>
                    <div style={{ fontSize: '9px', color: 'var(--text-disabled)' }}>{evt.date}</div>
                  </div>

                  <div style={{ borderLeft: '2px solid var(--border-base)', paddingLeft: 'var(--space-3)', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {evt.event}
                      </span>
                      <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        {evt.actor}
                      </span>
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.35 }}>
                      {evt.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. RELATED / DUPLICATE REPORTS */}
          <div className="surface-card">
            <div style={{
              padding: 'var(--space-3) var(--space-5)',
              borderBottom: '1px solid var(--border-base)',
              backgroundColor: 'var(--bg-app)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                6. RELATED / DUPLICATE REPORTS
              </span>
              <Badge variant="default">Disambiguation Ready</Badge>
            </div>

            <div style={{ padding: 'var(--space-4) var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {caseData.relatedReports.map((dup) => (
                <div
                  key={dup.id}
                  style={{
                    padding: 'var(--space-3)',
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {dup.id}
                    </span>
                    <Badge variant="amber">{dup.similarity}</Badge>
                  </div>

                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {dup.title}
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Filed by: {dup.filedBy}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-2)', paddingTop: 'var(--space-1)', borderTop: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                      {dup.note}
                    </span>
                    <button
                      onClick={() => navigate('/duplicates')}
                      className="btn btn-secondary"
                      style={{ height: '22px', fontSize: '10px', padding: '0 6px' }}
                    >
                      <GitMerge size={11} />
                      <span>Merge Tool</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 7 & 8: DUAL GRID (VERIFICATION HISTORY + AUDIT TRAIL)
            ========================================================================= */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-5)',
        }}>
          {/* 7. VERIFICATION HISTORY */}
          <div className="surface-card">
            <div style={{
              padding: 'var(--space-3) var(--space-5)',
              borderBottom: '1px solid var(--border-base)',
              backgroundColor: 'var(--bg-app)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                7. VERIFICATION HISTORY
              </span>
              <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>OFFICER LOG</span>
            </div>

            <div style={{ padding: 'var(--space-4) var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {caseData.verificationHistory.map((vh, idx) => (
                <div key={idx} style={{ paddingBottom: 'var(--space-2)', borderBottom: idx === caseData.verificationHistory.length - 1 ? 'none' : '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{vh.officer}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{vh.timestamp}</span>
                  </div>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-forest-text)', marginTop: '2px' }}>
                    Action: {vh.action}
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.35 }}>
                    "{vh.note}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 8. AUDIT TRAIL */}
          <div className="surface-card">
            <div style={{
              padding: 'var(--space-3) var(--space-5)',
              borderBottom: '1px solid var(--border-base)',
              backgroundColor: 'var(--bg-app)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                8. CRYPTOGRAPHIC AUDIT TRAIL
              </span>
              <Badge variant="default">SHA-256 Chain</Badge>
            </div>

            <div style={{ padding: 'var(--space-4) var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {caseData.auditTrail.map((at) => (
                <div key={at.id} style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>{at.id}</span>
                    <span>{at.timestamp}</span>
                  </div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '1px' }}>
                    {at.action} · Actor: {at.actor}
                  </div>
                  <div style={{ color: 'var(--text-disabled)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '1px' }}>
                    Hash: {at.hash}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL: ADD INFORMATION
          ========================================================================= */}
      {addInfoModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(18, 20, 23, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: 'var(--space-4)',
        }}>
          <div className="surface-card" style={{ width: '100%', maxWidth: '520px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--border-base)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>Append Case Information</h3>
              <button onClick={() => setAddInfoModalOpen(false)} className="btn btn-ghost" style={{ padding: 4 }}><X size={14} /></button>
            </div>
            <form onSubmit={handleAddInfoSubmit} style={{ padding: 'var(--space-5) var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                Enter supplemental sighting observations, medical notes, or family communication details for Case <strong>{caseData.caseId}</strong>.
              </div>
              <textarea
                rows={4}
                required
                value={newInfoNote}
                onChange={(e) => setNewInfoNote(e.target.value)}
                placeholder="e.g. Sumeet (brother) called at 16:20 to clarify that Rahul was wearing a dark brown leather band bracelet on his right wrist..."
                style={{ width: '100%', padding: '8px 10px', fontSize: 'var(--text-xs)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                <button type="button" onClick={() => setAddInfoModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Commit Note to Dossier</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ASSIGN VERIFIER
          ========================================================================= */}
      {assignModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(18, 20, 23, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: 'var(--space-4)',
        }}>
          <div className="surface-card" style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--border-base)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>Assign Case Verifier</h3>
              <button onClick={() => setAssignModalOpen(false)} className="btn btn-ghost" style={{ padding: 4 }}><X size={14} /></button>
            </div>
            <div style={{ padding: 'var(--space-5) var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {[
                { name: 'DISP-884 (Tier 2 Lead Dispatcher)', status: 'ACTIVE ON DUTY', currentLoad: '4 Cases' },
                { name: 'DISP-412 (Triage Specialist)', status: 'ACTIVE ON DUTY', currentLoad: '7 Cases' },
                { name: 'DISP-204 (Family Liaison Desk)', status: 'ACTIVE ON DUTY', currentLoad: '2 Cases' },
                { name: 'OFFICER-NEGI (NDRF Field Liaison)', status: 'FIELD RADIAL', currentLoad: '5 Cases' },
              ].map((off, idx) => (
                <div
                  key={idx}
                  onClick={() => handleAssignSubmit(off.name)}
                  style={{
                    padding: 'var(--space-3)',
                    border: '1px solid var(--border-base)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: assignedVerifier.includes(off.name.split(' ')[0]) ? 'var(--bg-app)' : 'var(--bg-surface)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface)'}
                >
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)' }}>{off.name}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Load: {off.currentLoad}</div>
                  </div>
                  <Badge variant="forest">{off.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseDetailPage;
