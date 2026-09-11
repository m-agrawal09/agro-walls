import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  User, 
  FileText, 
  Printer, 
  HelpCircle 
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { StatusDot } from '../components/common/StatusDot';
import { useNavigate } from 'react-router-dom';

interface EvidenceRow {
  parameter: string;
  missingRecord: string;
  candidateRecord: string;
  evaluation: string;
  matchGrade: 'MATCH' | 'HIGH' | 'PARTIAL' | 'CONFLICT';
}

interface Candidate {
  id: string;
  caseRef: string;
  name: string;
  age: string;
  gender: string;
  source: string;
  sourceStation: string;
  currentLocation: string;
  distanceKm: string;
  ingestTimestamp: string;
  overallConfidence: number;
  confidenceGrade: 'STRONG' | 'ELEVATED' | 'MODERATE';
  condition: string;
  photoLabel: string;
  evidence: EvidenceRow[];
}

export const MatchIntelligencePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('cand-1');
  const [actionNotice, setActionNotice] = useState<{ type: 'VERIFIED' | 'REJECTED' | 'REQUESTED' | null; message: string }>({ type: null, message: '' });

  const missingPerson = {
    caseId: 'MP-2026-00421',
    name: 'Rahul Agrawal',
    age: '24 years',
    gender: 'Male',
    lastKnownLocation: 'Relief Zone B (Sector 4 Narmada Bank)',
    coordinates: '22.7533° N, 77.7289° E',
    clothing: 'Navy blue collared t-shirt, beige cargo pants, black digital watch, dark sandals',
    physicalMarks: 'Scar on right chin (~2cm from childhood fall), small mole below left eye',
    otherTraits: 'Speaks Hindi and fluent English; carrying water bottle, no wallet found',
    source: 'State Disaster Helpline 1070',
    reportedBy: 'Sumeet Agrawal (Elder Brother) — +91 98261 44102',
    reportTimestamp: '11 Sep 2026, 09:15 LOC (8h 51m ago)',
    incidentZone: 'Central India Flood Response — Sector B-4',
    photoLabel: 'Reference Photo (Uploaded via Aadhaar Digilocker)',
  };

  const candidates: Candidate[] = [
    {
      id: 'cand-1',
      caseRef: 'FND-2026-01892',
      name: 'Rahul Agarwal',
      age: '24 years',
      gender: 'Male',
      source: 'Disaster Relief Camp Ward 6',
      sourceStation: 'Camp Triage Desk #4 (Hoshangabad Polytechnic Ground)',
      currentLocation: 'Polytechnic Relief Shelter Ward 6, Bed #42',
      distanceKm: '3.2 km',
      ingestTimestamp: '11 Sep 2026, 15:42 LOC (2h 24m ago)',
      overallConfidence: 94,
      confidenceGrade: 'STRONG',
      condition: 'Alive · Mild dehydration & foot abrasion · Stable',
      photoLabel: 'Field Intake Portrait (Camp Ward 6 Webcam)',
      evidence: [
        {
          parameter: 'Name Similarity',
          missingRecord: 'Rahul Agrawal',
          candidateRecord: 'Rahul Agarwal',
          evaluation: 'High similarity (Double metaphone match, phonetic variant)',
          matchGrade: 'MATCH',
        },
        {
          parameter: 'Age / Gender',
          missingRecord: '24 years · Male',
          candidateRecord: '24 years · Male',
          evaluation: 'Exact match (Self-reported DOB: 14 Aug 2002)',
          matchGrade: 'MATCH',
        },
        {
          parameter: 'Location Proximity',
          missingRecord: 'Relief Zone B (Sector 4)',
          candidateRecord: 'Polytechnic Shelter Ward 6',
          evaluation: '3.2 km from last seen along primary evacuation route',
          matchGrade: 'HIGH',
        },
        {
          parameter: 'Clothing',
          missingRecord: 'Navy blue collared t-shirt, beige cargo pants',
          candidateRecord: 'Dark blue polo shirt, wet beige trousers',
          evaluation: 'High consistency (Color & garment types align)',
          matchGrade: 'HIGH',
        },
        {
          parameter: 'Physical Marks',
          missingRecord: 'Scar on right chin (~2cm), mole below left eye',
          candidateRecord: 'Noted: Healed scar on right lower jaw/chin',
          evaluation: 'Match (Verified by intake nurse Sister Vandana)',
          matchGrade: 'MATCH',
        },
        {
          parameter: 'Photograph',
          missingRecord: 'Available (Gov ID Reference)',
          candidateRecord: 'Available (Camp Intake Camera)',
          evaluation: 'Facial geometry & facial hair distribution correlate',
          matchGrade: 'HIGH',
        },
      ],
    },
    {
      id: 'cand-2',
      caseRef: 'HOS-2026-00634',
      name: 'Rahool Agrawal',
      age: '25 years',
      gender: 'Male',
      source: 'District Civil Hospital Casualty List',
      sourceStation: 'Emergency Trauma Ward B, Hoshangabad',
      currentLocation: 'District Civil Hospital Trauma Ward Bed 18',
      distanceKm: '5.8 km',
      ingestTimestamp: '11 Sep 2026, 14:10 LOC (3h 56m ago)',
      overallConfidence: 87,
      confidenceGrade: 'ELEVATED',
      condition: 'Alive · Concussion & shoulder sprain · Conscious',
      photoLabel: 'Casualty Ingest Snapshot (Ward B Desk)',
      evidence: [
        {
          parameter: 'Name Similarity',
          missingRecord: 'Rahul Agrawal',
          candidateRecord: 'Rahool Agrawal',
          evaluation: 'High similarity (Spelling variation in phonetic hospital intake)',
          matchGrade: 'HIGH',
        },
        {
          parameter: 'Age / Gender',
          missingRecord: '24 years · Male',
          candidateRecord: '25 years (approx) · Male',
          evaluation: '±1 year difference (Admitting doctor estimation)',
          matchGrade: 'HIGH',
        },
        {
          parameter: 'Location Proximity',
          missingRecord: 'Relief Zone B (Sector 4)',
          candidateRecord: 'District Civil Hospital',
          evaluation: '5.8 km via ambulance transit from Sector 3 Ghat',
          matchGrade: 'HIGH',
        },
        {
          parameter: 'Clothing',
          missingRecord: 'Navy blue collared t-shirt, beige cargo pants',
          candidateRecord: 'Blue cotton shirt, black trousers',
          evaluation: 'Partial consistency (Shirt color matches, pants conflict)',
          matchGrade: 'PARTIAL',
        },
        {
          parameter: 'Physical Marks',
          missingRecord: 'Scar on right chin (~2cm), mole below left eye',
          candidateRecord: 'Facial abrasion right side, bandage on forehead',
          evaluation: 'Pending visual check beneath dressing',
          matchGrade: 'PARTIAL',
        },
        {
          parameter: 'Photograph',
          missingRecord: 'Available (Gov ID Reference)',
          candidateRecord: 'Available (Hospital Admission photo)',
          evaluation: 'Moderate correlation (Partial facial obstruction)',
          matchGrade: 'PARTIAL',
        },
      ],
    },
    {
      id: 'cand-3',
      caseRef: 'SGT-2026-00419',
      name: 'R. Agrawal',
      age: '23 years',
      gender: 'Male',
      source: 'NGO SEEDS Volunteer Sighting Log',
      sourceStation: 'Bus Stand Evacuation Point Mobile Team',
      currentLocation: 'Interstate Bus Terminal Assembly Point',
      distanceKm: '7.1 km',
      ingestTimestamp: '11 Sep 2026, 12:35 LOC (5h 31m ago)',
      overallConfidence: 79,
      confidenceGrade: 'MODERATE',
      condition: 'Alive · Displaced evacuee in transit',
      photoLabel: 'Volunteer Sighting Photo (Handheld)',
      evidence: [
        {
          parameter: 'Name Similarity',
          missingRecord: 'Rahul Agrawal',
          candidateRecord: 'R. Agrawal',
          evaluation: 'Abbreviated initial match with matching surname',
          matchGrade: 'PARTIAL',
        },
        {
          parameter: 'Age / Gender',
          missingRecord: '24 years · Male',
          candidateRecord: '23 years · Male',
          evaluation: '±1 year consistent demographic cohort',
          matchGrade: 'HIGH',
        },
        {
          parameter: 'Location Proximity',
          missingRecord: 'Relief Zone B (Sector 4)',
          candidateRecord: 'Interstate Bus Terminal',
          evaluation: '7.1 km north-west of incident zone',
          matchGrade: 'PARTIAL',
        },
        {
          parameter: 'Clothing',
          missingRecord: 'Navy blue collared t-shirt, beige cargo pants',
          candidateRecord: 'Grey hoodie over dark blue t-shirt, jeans',
          evaluation: 'Layered clothing consistent with evening temperature drop',
          matchGrade: 'PARTIAL',
        },
        {
          parameter: 'Physical Marks',
          missingRecord: 'Scar on right chin (~2cm), mole below left eye',
          candidateRecord: 'No marks documented by volunteer team',
          evaluation: 'Unverified by field observer',
          matchGrade: 'CONFLICT',
        },
        {
          parameter: 'Photograph',
          missingRecord: 'Available (Gov ID Reference)',
          candidateRecord: 'Low-resolution mobile photo from 10m distance',
          evaluation: 'Coarse contour similarity only',
          matchGrade: 'PARTIAL',
        },
      ],
    },
  ];

  const currentCandidate = candidates.find(c => c.id === selectedCandidateId) || candidates[0];

  const handleVerify = () => {
    setActionNotice({
      type: 'VERIFIED',
      message: `POSITIVE IDENTIFICATION RECORDED: ${currentCandidate.name} (${currentCandidate.caseRef}) has been linked to Case MP-2026-00421. Verification logged under Operator DISP-884. Family liaison notified.`,
    });
  };

  const handleReject = () => {
    setActionNotice({
      type: 'REJECTED',
      message: `DISCORRELATED: Candidate ${currentCandidate.name} (${currentCandidate.caseRef}) marked as NON-MATCH for Case MP-2026-00421. Record retained in audit ledger.`,
    });
  };

  const handleRequestInfo = () => {
    setActionNotice({
      type: 'REQUESTED',
      message: `FIELD INQUIRY DISPATCHED: Request sent to ${currentCandidate.sourceStation} for secondary verification of chin scar and Aadhaar biometric verification.`,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', width: '100%' }}>
      {/* Workspace Subheader / Context Bar */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-base)',
          padding: 'var(--space-4) var(--space-8)',
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
              <span>MATCH INTELLIGENCE WORKSPACE</span>
              <span>/</span>
              <span>CASE {missingPerson.caseId}</span>
              <span>/</span>
              <span>3 CANDIDATES INDEXED</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <h1 style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 600,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}>
                Identity Correlation Workspace
              </h1>
              <Badge variant="charcoal">
                CASE {missingPerson.caseId}
              </Badge>
              <Badge variant="crimson" dot>
                HIGH PRIORITY INQUIRY
              </Badge>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <button
              onClick={() => navigate('/verification')}
              className="btn btn-secondary"
              style={{ height: '32px' }}
            >
              <span>Verification Queue</span>
            </button>
            <button
              onClick={() => window.print()}
              className="btn btn-secondary"
              style={{ height: '32px' }}
            >
              <Printer size={13} />
              <span>Print Evidence Docket</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Emergency Operations Banner & Disclaimer */}
      <div
        style={{
          backgroundColor: 'var(--color-amber-bg)',
          borderBottom: '1px solid var(--color-amber-border)',
          padding: 'var(--space-3) var(--space-8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            color: 'var(--color-amber-text)',
            letterSpacing: '0.04em',
            backgroundColor: 'var(--bg-surface)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-xs)',
            border: '1px solid var(--color-amber-border)',
          }}>
            <StatusDot variant="amber" pulse size={7} />
            <span>POTENTIAL MATCH — HUMAN VERIFICATION REQUIRED</span>
          </div>

          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-amber-text)' }}>
            Automated matching is advisory. A human verifier must confirm the identity before family notification.
          </span>
        </div>

        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-amber-text)', opacity: 0.9 }}>
          POLICY: DISASTER-ID-SOP-V4
        </span>
      </div>

      {/* Action Notification Message if triggered */}
      {actionNotice.type && (
        <div
          style={{
            margin: 'var(--space-4) var(--space-8) 0 var(--space-8)',
            padding: 'var(--space-3) var(--space-4)',
            backgroundColor: actionNotice.type === 'VERIFIED' ? 'var(--color-forest-bg)' : actionNotice.type === 'REJECTED' ? 'var(--color-crimson-bg)' : 'var(--color-amber-bg)',
            border: `1px solid ${actionNotice.type === 'VERIFIED' ? 'var(--color-forest-border)' : actionNotice.type === 'REJECTED' ? 'var(--color-crimson-border)' : 'var(--color-amber-border)'}`,
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-sm)',
            color: actionNotice.type === 'VERIFIED' ? 'var(--color-forest-text)' : actionNotice.type === 'REJECTED' ? 'var(--color-crimson-text)' : 'var(--color-amber-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {actionNotice.type === 'VERIFIED' && <CheckCircle2 size={16} />}
            {actionNotice.type === 'REJECTED' && <XCircle size={16} />}
            {actionNotice.type === 'REQUESTED' && <HelpCircle size={16} />}
            <strong>{actionNotice.message}</strong>
          </div>
          <button
            onClick={() => setActionNotice({ type: null, message: '' })}
            className="btn btn-ghost"
            style={{ height: '24px', padding: '0 6px', fontSize: '11px' }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Two-Column Evidence Workspace */}
      <div style={{
        padding: 'var(--space-5) var(--space-8)',
        display: 'grid',
        gridTemplateColumns: 'minmax(340px, 420px) 1fr',
        gap: 'var(--space-6)',
        alignItems: 'start',
      }}>
        {/* =========================================================================
            LEFT COLUMN: MISSING PERSON REPORT
            ========================================================================= */}
        <div className="surface-card" style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Left Column Header */}
          <div style={{
            padding: 'var(--space-4) var(--space-5)',
            borderBottom: '1px solid var(--border-base)',
            backgroundColor: 'var(--bg-app)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                PRIMARY INTAKE RECORD
              </div>
              <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--text-primary)' }}>
                MISSING PERSON REPORT
              </h2>
            </div>
            <Badge variant="crimson" dot>
              UNRESOLVED
            </Badge>
          </div>

          {/* Person Summary Banner */}
          <div style={{ padding: 'var(--space-5)', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
              {/* Photo Area */}
              <div style={{
                width: '92px',
                height: '110px',
                backgroundColor: 'var(--bg-app)',
                border: '1px solid var(--border-base)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: 'var(--space-2)',
                flexShrink: 0,
                position: 'relative',
              }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--border-strong)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-inverse)',
                  marginBottom: '4px',
                }}>
                  <User size={24} />
                </div>
                <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', lineHeight: 1.1 }}>
                  REF PHOTO
                </span>
                <span style={{ fontSize: '8px', fontFamily: 'var(--font-mono)', color: 'var(--color-forest-text)' }}>
                  AADHAAR ID
                </span>
              </div>

              {/* Core Demographics */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {missingPerson.caseId}
                </span>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                  {missingPerson.name}
                </h3>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
                  {missingPerson.age} · {missingPerson.gender}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                  <MapPin size={12} color="var(--color-crimson)" />
                  <span>Last Seen: <strong>{missingPerson.lastKnownLocation}</strong></span>
                </div>

                <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '2px' }}>
                  COORDINATES: {missingPerson.coordinates}
                </div>
              </div>
            </div>
          </div>

          {/* Structured Evidence List */}
          <div style={{ padding: 'var(--space-4) var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontSize: '10px' }}>
                Clothing Worn
              </span>
              <p style={{ color: 'var(--text-primary)', marginTop: '2px', lineHeight: 1.4 }}>
                {missingPerson.clothing}
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-2)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontSize: '10px' }}>
                Physical Body Marks
              </span>
              <p style={{ color: 'var(--text-primary)', marginTop: '2px', lineHeight: 1.4 }}>
                {missingPerson.physicalMarks}
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-2)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontSize: '10px' }}>
                Other Identifying Traits
              </span>
              <p style={{ color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                {missingPerson.otherTraits}
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-2)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontSize: '10px' }}>
                Reporting Source &amp; Authority
              </span>
              <p style={{ color: 'var(--text-primary)', fontWeight: 500, marginTop: '2px' }}>
                {missingPerson.source}
              </p>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>
                Reported by: {missingPerson.reportedBy}
              </span>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-2)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontSize: '10px' }}>
                Intake Timestamp
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                <Clock size={12} color="var(--text-muted)" />
                <span>{missingPerson.reportTimestamp}</span>
              </div>
            </div>
          </div>

          {/* Left Column Footer */}
          <div style={{
            padding: 'var(--space-3) var(--space-5)',
            backgroundColor: 'var(--bg-app)',
            borderTop: '1px solid var(--border-base)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
          }}>
            <span>ENCRYPTED RECORD #00421</span>
            <span>EDXL-CAP v1.2</span>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: POTENTIAL MATCHES & EVIDENCE EVALUATION
            ========================================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Header & Candidate Selector Bar */}
          <div className="surface-card" style={{ padding: 'var(--space-4) var(--space-5)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-3)',
              paddingBottom: 'var(--space-2)',
              borderBottom: '1px solid var(--border-subtle)',
            }}>
              <div>
                <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  CORRELATION PIPELINE
                </div>
                <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  POTENTIAL MATCHES (3 CANDIDATES)
                </h2>
              </div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                CORRELATION MODEL: EDXL-MULTI-MATCH
              </span>
            </div>

            {/* 3 Candidate Cards Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
              {candidates.map((cand) => {
                const isSelected = cand.id === selectedCandidateId;

                return (
                  <div
                    key={cand.id}
                    onClick={() => setSelectedCandidateId(cand.id)}
                    style={{
                      padding: 'var(--space-3) var(--space-4)',
                      border: isSelected ? '2px solid var(--color-crimson)' : '1px solid var(--border-base)',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isSelected ? 'var(--bg-surface)' : 'var(--bg-app)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      transition: 'border-color 0.1s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                        {cand.caseRef}
                      </span>
                      {/* Simple Non-AI Confidence Indicator */}
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-xs)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: cand.overallConfidence >= 90 ? 'var(--color-forest-bg)' : cand.overallConfidence >= 80 ? 'var(--color-amber-bg)' : 'var(--bg-subtle)',
                        color: cand.overallConfidence >= 90 ? 'var(--color-forest-text)' : cand.overallConfidence >= 80 ? 'var(--color-amber-text)' : 'var(--text-secondary)',
                        border: `1px solid ${cand.overallConfidence >= 90 ? 'var(--color-forest-border)' : cand.overallConfidence >= 80 ? 'var(--color-amber-border)' : 'var(--border-base)'}`,
                      }}>
                        {cand.overallConfidence}% MATCH
                      </span>
                    </div>

                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {cand.name}
                    </div>

                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {cand.source}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Candidate Detailed Evidence Profile */}
          <div className="surface-card">
            {/* Candidate Header */}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {currentCandidate.name}
                  </h3>
                  <Badge variant={currentCandidate.overallConfidence >= 90 ? 'forest' : 'amber'}>
                    {currentCandidate.overallConfidence}% CORRELATION
                  </Badge>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    REF: {currentCandidate.caseRef}
                  </span>
                </div>

                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {currentCandidate.source} · Located at {currentCandidate.currentLocation} ({currentCandidate.distanceKm} from Relief Zone B)
                </div>
              </div>

              {/* Status pill */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                backgroundColor: 'var(--color-forest-bg)',
                border: '1px solid var(--color-forest-border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-forest-text)',
              }}>
                <CheckCircle2 size={13} color="var(--color-forest)" />
                <span>{currentCandidate.condition}</span>
              </div>
            </div>

            {/* Side-by-Side Photo & Station Context */}
            <div style={{
              padding: 'var(--space-4) var(--space-6)',
              borderBottom: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-app)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-5)',
              flexWrap: 'wrap',
            }}>
              <div style={{
                width: '72px',
                height: '84px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-base)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '4px',
                flexShrink: 0,
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--border-strong)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-inverse)',
                  marginBottom: '4px',
                }}>
                  <User size={18} />
                </div>
                <span style={{ fontSize: '8px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  MATCH PHOTO
                </span>
                <span style={{ fontSize: '8px', fontFamily: 'var(--font-mono)', color: 'var(--color-forest-text)' }}>
                  FIELD WEBCAM
                </span>
              </div>

              <div style={{ flex: 1, minWidth: '240px', fontSize: 'var(--text-xs)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div><strong>Current Facility:</strong> {currentCandidate.sourceStation}</div>
                <div><strong>Timestamp Logged:</strong> <span style={{ fontFamily: 'var(--font-mono)' }}>{currentCandidate.ingestTimestamp}</span></div>
                <div><strong>Current Health Status:</strong> {currentCandidate.condition}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '2px' }}>
                  Photo verification tag: {currentCandidate.photoLabel}
                </div>
              </div>
            </div>

            {/* "WHY THIS MATCH?" SECTION */}
            <div style={{ padding: 'var(--space-5) var(--space-6)' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 'var(--space-3)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <FileText size={15} color="var(--text-secondary)" />
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-primary)' }}>
                    WHY THIS MATCH?
                  </h4>
                </div>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  6 VERIFIABLE CRITERIA
                </span>
              </div>

              {/* Evidence Comparison Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: 'var(--text-xs)',
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
                      <th style={{ padding: '8px 12px', fontWeight: 600, width: '130px' }}>Evidence Dimension</th>
                      <th style={{ padding: '8px 12px', fontWeight: 600 }}>Missing Report Record</th>
                      <th style={{ padding: '8px 12px', fontWeight: 600 }}>Candidate Match Record</th>
                      <th style={{ padding: '8px 12px', fontWeight: 600 }}>Cross-Check Analysis</th>
                      <th style={{ padding: '8px 12px', fontWeight: 600, textAlign: 'right', width: '90px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCandidate.evidence.map((ev, idx) => (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: idx === currentCandidate.evidence.length - 1 ? 'none' : '1px solid var(--border-subtle)',
                        }}
                      >
                        <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                          {ev.parameter}
                        </td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>
                          {ev.missingRecord}
                        </td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-primary)', fontWeight: 500 }}>
                          {ev.candidateRecord}
                        </td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>
                          {ev.evaluation}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '10px',
                            fontWeight: 700,
                            color: ev.matchGrade === 'MATCH' ? 'var(--color-forest-text)' : ev.matchGrade === 'HIGH' ? 'var(--color-forest-text)' : ev.matchGrade === 'PARTIAL' ? 'var(--color-amber-text)' : 'var(--color-crimson-text)',
                            backgroundColor: ev.matchGrade === 'MATCH' ? 'var(--color-forest-bg)' : ev.matchGrade === 'HIGH' ? 'var(--color-forest-bg)' : ev.matchGrade === 'PARTIAL' ? 'var(--color-amber-bg)' : 'var(--color-crimson-bg)',
                            padding: '2px 6px',
                            borderRadius: 'var(--radius-xs)',
                            border: `1px solid ${ev.matchGrade === 'MATCH' || ev.matchGrade === 'HIGH' ? 'var(--color-forest-border)' : ev.matchGrade === 'PARTIAL' ? 'var(--color-amber-border)' : 'var(--color-crimson-border)'}`,
                          }}>
                            {ev.matchGrade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Bar (Verify, Reject, Request More Info) */}
            <div style={{
              padding: 'var(--space-4) var(--space-6)',
              backgroundColor: 'var(--bg-app)',
              borderTop: '1px solid var(--border-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 'var(--space-3)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <button
                  onClick={handleReject}
                  className="btn btn-secondary"
                  style={{ height: '36px' }}
                >
                  <XCircle size={14} color="var(--color-crimson)" />
                  <span>Reject Match</span>
                </button>

                <button
                  onClick={handleRequestInfo}
                  className="btn btn-secondary"
                  style={{ height: '36px' }}
                >
                  <HelpCircle size={14} />
                  <span>Request More Information</span>
                </button>
              </div>

              {/* Primary Verification Action */}
              <button
                onClick={handleVerify}
                className="btn btn-danger"
                style={{
                  height: '38px',
                  padding: '0 24px',
                  backgroundColor: 'var(--color-crimson)',
                  borderColor: 'var(--color-crimson)',
                  fontWeight: 600,
                  fontSize: 'var(--text-sm)',
                }}
              >
                <CheckCircle2 size={16} />
                <span>VERIFY MATCH</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchIntelligencePage;
