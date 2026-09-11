import React, { useState } from 'react';
import { 
  GitMerge, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  XCircle, 
  User, 
  Check, 
  X 
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { StatusDot } from '../components/common/StatusDot';

interface DuplicateReport {
  id: string;
  caseId: string;
  name: string;
  ageGender: string;
  photoType: string;
  location: string;
  clothing: string;
  marks: string;
  source: string;
  timestamp: string;
  contact: string;
  isRecommendedCanonical?: boolean;
}

interface AttributeRow {
  dimension: string;
  category: 'MATCHING' | 'CONFLICTING' | 'MISSING';
  repA: string;
  repB: string;
  repC: string;
  reconciliationNote: string;
}

export const DuplicateResolutionPage: React.FC = () => {
  const [canonicalId, setCanonicalId] = useState<string>('MP-2026-00421');
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
  const [mergedState, setMergedState] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [operatorNotes, setOperatorNotes] = useState<string>('');

  const reports: DuplicateReport[] = [
    {
      id: 'rep-1',
      caseId: 'MP-2026-00421',
      name: 'Rahul Agrawal',
      ageGender: '24 years · Male',
      photoType: 'Gov ID Photo (Aadhaar)',
      location: 'Relief Zone B (Sector 4 Narmada Riverfront)',
      clothing: 'Navy blue collared polo shirt, beige cargo pants, dark sandals',
      marks: 'Healed scar on right chin (~2cm), small mole below left eye',
      source: 'State Disaster Helpline 1070',
      timestamp: '11 Sep, 09:15 LOC',
      contact: 'Sumeet Agrawal (Elder Brother) — +91 98261 44102',
      isRecommendedCanonical: true,
    },
    {
      id: 'rep-2',
      caseId: 'DUP-2026-0089',
      name: 'Rahul Agarwal',
      ageGender: '24 years · Male',
      photoType: 'Family WhatsApp Snapshot',
      location: 'Sethani Ghat Evacuation Point, Hoshangabad',
      clothing: 'Dark blue polo t-shirt, khaki trousers',
      marks: 'Cut mark on chin, fair/wheatish complexion',
      source: 'Vidisha Disaster Help Desk Ingest',
      timestamp: '11 Sep, 11:20 LOC',
      contact: 'Mahesh Agrawal (Maternal Uncle) — +91 94250 11928',
    },
    {
      id: 'rep-3',
      caseId: 'DUP-2026-0114',
      name: 'R. Agrawal',
      ageGender: 'Approx 22-25 · Male',
      photoType: 'No photo provided (Field verbal note)',
      location: 'Old Temple Steps near Sector 4 Bund',
      clothing: 'Navy blue shirt, light colored pants',
      marks: 'Not recorded in field observation log',
      source: 'NDRF Boat 3 Observation Log',
      timestamp: '11 Sep, 12:45 LOC',
      contact: 'Commandant R. S. Negi (NDRF 11 Bn)',
    },
  ];

  const attributeMatrix: AttributeRow[] = [
    {
      dimension: 'Subject Name',
      category: 'CONFLICTING',
      repA: 'Rahul Agrawal',
      repB: 'Rahul Agarwal',
      repC: 'R. Agrawal',
      reconciliationNote: 'Phonetic variant ("Agrawal" vs "Agarwal") and abbreviated initial. Double metaphone algorithm confirms 98% linguistic alignment.',
    },
    {
      dimension: 'Age & Gender',
      category: 'MATCHING',
      repA: '24 years · Male (DOB: 14 Aug 2002)',
      repB: '24 years · Male',
      repC: 'Approx 22-25 · Male',
      reconciliationNote: 'Exact age alignment across family sources; NDRF observational bracket encompasses 24 years.',
    },
    {
      dimension: 'Photograph',
      category: 'CONFLICTING',
      repA: 'Aadhaar DigiLocker reference portrait',
      repB: 'Family group photo crop',
      repC: 'Missing (Field verbal log)',
      reconciliationNote: 'Aadhaar ID provides clearest biometric ground truth. Both photo sources visually corroborate the same individual.',
    },
    {
      dimension: 'Last Known Location',
      category: 'MATCHING',
      repA: 'Relief Zone B (Sector 4 Narmada Bank)',
      repB: 'Sethani Ghat Evacuation Point',
      repC: 'Old Temple Steps near Sector 4 Bund',
      reconciliationNote: 'All three locations describe contiguous sectors along the Sethani Ghat riverfront within 350 meters.',
    },
    {
      dimension: 'Clothing Description',
      category: 'MATCHING',
      repA: 'Navy blue collared polo, beige cargo pants',
      repB: 'Dark blue polo t-shirt, khaki trousers',
      repC: 'Navy blue shirt, light colored pants',
      reconciliationNote: 'Strong cross-witness corroboration: Navy blue polo shirt and beige/khaki trousers noted by all 3 reporting sources.',
    },
    {
      dimension: 'Physical Marks',
      category: 'CONFLICTING',
      repA: 'Scar on right chin (~2cm), mole below left eye',
      repB: 'Cut mark on chin, wheatish complexion',
      repC: 'Missing / unrecorded',
      reconciliationNote: 'Chin scar is confirmed by both family reports. Mole is uniquely noted in primary intake.',
    },
    {
      dimension: 'Reporting Source',
      category: 'MATCHING',
      repA: 'State Helpline 1070',
      repB: 'Vidisha Help Desk Ingest',
      repC: 'NDRF Boat 3 Field Log',
      reconciliationNote: 'Multi-agency reporting: State call center, district desk, and field SAR boat.',
    },
    {
      dimension: 'Filing Timestamp',
      category: 'MATCHING',
      repA: '09:15 LOC (T+0h)',
      repB: '11:20 LOC (T+2h 05m)',
      repC: '12:45 LOC (T+3h 30m)',
      reconciliationNote: 'Chronological sequence of family alert followed by SAR field observation.',
    },
  ];

  const handleMergeSubmit = () => {
    setMergedState(true);
    setConfirmModalOpen(false);
    setActionMessage(`REPORTS CONSOLIDATED: Canonical master record established under ${canonicalId}. Non-destructive merge complete: DUP-2026-0089 and DUP-2026-0114 preserved as verified historical references with full audit provenance.`);
  };

  const handleKeepSeparate = () => {
    setActionMessage('RECORD INDEPENDENCE LOGGED: Reports marked as distinct entities. Disambiguation flag dismissed for this cycle.');
  };

  const handleRequestReview = () => {
    setActionMessage('SUPERVISORY REVIEW DISPATCHED: Escalated to Incident Lead Dispatcher for manual field interview validation.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', width: '100%' }}>
      {/* Header Bar */}
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
              <span>RECORDS RECONCILIATION WORKBENCH</span>
              <span>/</span>
              <span>ENTITY DISAMBIGUATION</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <h1 style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 600,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}>
                Duplicate Resolution
              </h1>
              <Badge variant="amber">
                3 DUPLICATE GROUPS IDENTIFIED
              </Badge>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                Consolidate multi-source reports of the same individual without losing evidentiary history.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-app)',
              padding: '4px 10px',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
            }}>
              <StatusDot variant="forest" pulse size={6} />
              <span>DEDUP ENGINE: EDXL-V2 ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div
          style={{
            margin: 'var(--space-3) var(--space-8) 0 var(--space-8)',
            padding: 'var(--space-3) var(--space-4)',
            backgroundColor: mergedState ? 'var(--color-forest-bg)' : 'var(--color-amber-bg)',
            border: `1px solid ${mergedState ? 'var(--color-forest-border)' : 'var(--color-amber-border)'}`,
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-sm)',
            color: mergedState ? 'var(--color-forest-text)' : 'var(--color-amber-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {mergedState ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            <strong>{actionMessage}</strong>
          </div>
          <button onClick={() => setActionMessage(null)} className="btn btn-ghost" style={{ padding: 2 }}>
            <X size={12} />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div style={{
        padding: 'var(--space-5) var(--space-8)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
        maxWidth: '1240px',
        width: '100%',
        margin: '0 auto',
      }}>
        {/* =========================================================================
            TOP BANNER: POSSIBLE DUPLICATE GROUP & SIMILARITY METRIC
            ========================================================================= */}
        <div
          className="surface-card"
          style={{
            padding: 'var(--space-5) var(--space-6)',
            borderLeft: '4px solid var(--color-amber)',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-amber-text)', letterSpacing: '0.06em' }}>
                  POSSIBLE DUPLICATE GROUP #01
                </span>
                <span style={{ color: 'var(--border-strong)' }}>•</span>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  INCIDENT: CENTRAL INDIA FLOOD RESPONSE
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: '4px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Rahul Agrawal / Rahul Agarwal / R. Agrawal
                </h2>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 10px',
                  backgroundColor: 'var(--color-forest-bg)',
                  border: '1px solid var(--color-forest-border)',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: 'var(--color-forest-text)',
                }}>
                  <CheckCircle2 size={13} color="var(--color-forest)" />
                  <span>Likely same individual — 92% similarity</span>
                </div>
              </div>

              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Automated heuristic correlation detected 3 overlapping missing person intakes filed by different family branches and search teams.
              </p>
            </div>

            {/* Quick Summary Pill */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
            }}>
              <span>ALGORITHM: LEVENSHTEIN + GEO-RADIAL</span>
              <span>CONFIDENCE: 92.4% HEURISTIC MATCH</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SIDE-BY-SIDE 3-REPORT COMPARISON CARDS
            ========================================================================= */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--space-4)',
        }}>
          {reports.map((rep, idx) => {
            const isCanonical = canonicalId === rep.caseId;

            return (
              <div
                key={rep.id}
                className="surface-card"
                style={{
                  padding: 'var(--space-4) var(--space-5)',
                  border: isCanonical ? '2px solid var(--color-charcoal-900)' : '1px solid var(--border-base)',
                  backgroundColor: isCanonical ? 'var(--bg-surface)' : 'var(--bg-app)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-3)',
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-2)' }}>
                  <div>
                    <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      REPORT 0{idx + 1}
                    </span>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {rep.caseId}
                    </div>
                  </div>

                  {isCanonical ? (
                    <Badge variant="charcoal">CANONICAL PRIMARY</Badge>
                  ) : (
                    <Badge variant="default">CANDIDATE DUPLICATE</Badge>
                  )}
                </div>

                {/* Person Photo & Core Demographics */}
                <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                  <div style={{
                    width: '64px',
                    height: '76px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-base)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <User size={22} color="var(--text-muted)" />
                    <span style={{ fontSize: '8px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '2px', textAlign: 'center', padding: '0 2px' }}>
                      {rep.photoType.split(' ')[0]}
                    </span>
                  </div>

                  <div>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {rep.name}
                    </h3>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                      {rep.ageGender}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                      {rep.timestamp}
                    </div>
                  </div>
                </div>

                {/* Key Summary Rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: 'var(--text-xs)' }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>LOCATION</span>
                    <span style={{ color: 'var(--text-primary)' }}>{rep.location}</span>
                  </div>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>CLOTHING</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{rep.clothing}</span>
                  </div>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>REPORTING SOURCE</span>
                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{rep.source}</span>
                    <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)' }}>{rep.contact}</span>
                  </div>
                </div>

                {/* Make Canonical Radio Button */}
                <div style={{ marginTop: 'auto', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--border-subtle)' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    color: isCanonical ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: isCanonical ? 700 : 500,
                    cursor: 'pointer',
                  }}>
                    <input
                      type="radio"
                      name="canonicalRecord"
                      checked={isCanonical}
                      onChange={() => setCanonicalId(rep.caseId)}
                    />
                    <span>{isCanonical ? 'DESIGNATED AS PRIMARY' : 'SELECT AS CANONICAL'}</span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================================================
            DETAILED EVIDENCE COMPARISON MATRIX
            ========================================================================= */}
        <div className="surface-card">
          <div style={{
            padding: 'var(--space-4) var(--space-6)',
            borderBottom: '1px solid var(--border-base)',
            backgroundColor: 'var(--bg-app)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-2)',
          }}>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                ATTRIBUTE CORRELATION ENGINE
              </span>
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)' }}>
                Field-by-Field Evidence Reconciliation Matrix
              </h3>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-forest-text)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--color-forest)' }} />
                MATCHING INFORMATION
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-amber-text)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--color-amber)' }} />
                CONFLICTING INFORMATION
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--text-muted)' }} />
                MISSING INFORMATION
              </span>
            </div>
          </div>

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
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}>
                  <th style={{ padding: '8px 14px', width: '130px' }}>Attribute</th>
                  <th style={{ padding: '8px 14px', width: '110px' }}>Alignment</th>
                  <th style={{ padding: '8px 14px' }}>MP-2026-00421 (Report 1)</th>
                  <th style={{ padding: '8px 14px' }}>DUP-2026-0089 (Report 2)</th>
                  <th style={{ padding: '8px 14px' }}>DUP-2026-0114 (Report 3)</th>
                  <th style={{ padding: '8px 14px', width: '220px' }}>Disambiguation Analysis</th>
                </tr>
              </thead>
              <tbody>
                {attributeMatrix.map((row, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: idx === attributeMatrix.length - 1 ? 'none' : '1px solid var(--border-subtle)',
                      backgroundColor: row.category === 'CONFLICTING' ? 'var(--color-amber-bg)' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                      {row.dimension}
                    </td>

                    <td style={{ padding: '10px 14px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-xs)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9px',
                        fontWeight: 700,
                        backgroundColor: row.category === 'MATCHING' ? 'var(--color-forest-bg)' : row.category === 'CONFLICTING' ? 'var(--color-amber-bg)' : 'var(--bg-subtle)',
                        color: row.category === 'MATCHING' ? 'var(--color-forest-text)' : row.category === 'CONFLICTING' ? 'var(--color-amber-text)' : 'var(--text-secondary)',
                        border: `1px solid ${row.category === 'MATCHING' ? 'var(--color-forest-border)' : row.category === 'CONFLICTING' ? 'var(--color-amber-border)' : 'var(--border-base)'}`,
                      }}>
                        {row.category}
                      </span>
                    </td>

                    <td style={{ padding: '10px 14px', color: 'var(--text-primary)', fontWeight: canonicalId === 'MP-2026-00421' ? 600 : 400 }}>
                      {row.repA}
                    </td>

                    <td style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontWeight: canonicalId === 'DUP-2026-0089' ? 600 : 400 }}>
                      {row.repB}
                    </td>

                    <td style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontWeight: canonicalId === 'DUP-2026-0114' ? 600 : 400 }}>
                      {row.repC}
                    </td>

                    <td style={{ padding: '10px 14px', fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                      {row.reconciliationNote}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* =========================================================================
            CANONICAL RECORD SECTION & ACTIONS
            ========================================================================= */}
        <div className="surface-card" style={{ padding: 'var(--space-5) var(--space-6)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-4)',
            paddingBottom: 'var(--space-3)',
            borderBottom: '1px solid var(--border-subtle)',
            flexWrap: 'wrap',
            gap: 'var(--space-2)',
          }}>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                MASTER PATIENT / PERSON INDEX (MPI) CONSOLIDATION
              </span>
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)' }}>
                Canonical Master Record Definition
              </h3>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-forest-text)',
              backgroundColor: 'var(--color-forest-bg)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-forest-border)',
            }}>
              <CheckCircle2 size={13} />
              <span>NON-DESTRUCTIVE RECONCILIATION GUARANTEED</span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: 'var(--space-6)',
            alignItems: 'start',
          }}>
            {/* Left: Policy Guarantee & Field Mapping */}
            <div style={{ fontSize: 'var(--text-xs)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{
                padding: 'var(--space-3) var(--space-4)',
                backgroundColor: 'var(--bg-app)',
                border: '1px solid var(--border-base)',
                borderRadius: 'var(--radius-sm)',
              }}>
                <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Non-Destructive Merge Policy
                </h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  Merging records links candidate files under a single designated canonical identity (<strong>{canonicalId}</strong>) while preserving all original Case IDs, ingest sources, timestamps, and conflicting notes in the immutable audit ledger.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>• <strong>Primary Canonical Record:</strong> {canonicalId} (Rahul Agrawal)</div>
                <div>• <strong>Consolidated Child Records:</strong> {reports.filter(r => r.caseId !== canonicalId).map(r => `${r.caseId} (${r.name})`).join(', ')}</div>
                <div>• <strong>Preserved Identifiers:</strong> Forearm chin scar, Aadhaar token, Family phone lines (+91 98261 44102 / +91 94250 11928)</div>
              </div>
            </div>

            {/* Right: Actions */}
            <div style={{
              padding: 'var(--space-4)',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-base)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
            }}>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-muted)' }}>
                DISPATCH OFFICER RECONCILIATION ACTIONS
              </div>

              <button
                onClick={() => setConfirmModalOpen(true)}
                className="btn btn-danger"
                style={{
                  height: '38px',
                  backgroundColor: 'var(--color-crimson)',
                  borderColor: 'var(--color-crimson)',
                  fontWeight: 600,
                  fontSize: 'var(--text-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                }}
              >
                <GitMerge size={15} />
                <span>MERGE REPORTS (NON-DESTRUCTIVE)</span>
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
                <button
                  onClick={handleKeepSeparate}
                  className="btn btn-secondary"
                  style={{ height: '34px', fontSize: '11px' }}
                >
                  <XCircle size={13} color="var(--color-crimson)" />
                  <span>KEEP SEPARATE</span>
                </button>

                <button
                  onClick={handleRequestReview}
                  className="btn btn-secondary"
                  style={{ height: '34px', fontSize: '11px' }}
                >
                  <HelpCircle size={13} />
                  <span>REQUEST REVIEW</span>
                </button>
              </div>

              <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textAlign: 'center' }}>
                Requires sworn dispatcher credentials (DISP-884)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          CONFIRMATION DIALOG MODAL (NON-DESTRUCTIVE MERGE)
          ========================================================================= */}
      {confirmModalOpen && (
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
          <div className="surface-card" style={{ width: '100%', maxWidth: '580px', display: 'flex', flexDirection: 'column' }}>
            {/* Modal Header */}
            <div style={{
              padding: 'var(--space-4) var(--space-6)',
              borderBottom: '1px solid var(--border-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--bg-app)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <GitMerge size={18} color="var(--color-crimson)" />
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Confirm Non-Destructive Report Consolidation
                </h3>
              </div>
              <button onClick={() => setConfirmModalOpen(false)} className="btn btn-ghost" style={{ padding: 4 }}>
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{
                padding: 'var(--space-3) var(--space-4)',
                backgroundColor: 'var(--color-forest-bg)',
                border: '1px solid var(--color-forest-border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-forest-text)',
                lineHeight: 1.4,
              }}>
                <strong>All 3 original reports will be permanently linked without deleting underlying records.</strong>
                <div style={{ fontSize: '11px', marginTop: '4px' }}>
                  Canonical Master established as: <strong>{canonicalId}</strong>
                </div>
              </div>

              {/* Preservation checklist */}
              <div style={{
                border: '1px solid var(--border-base)',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-3) var(--space-4)',
                backgroundColor: 'var(--bg-app)',
                fontSize: 'var(--text-xs)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                  Preserved Audit Items:
                </div>
                <div>✓ <strong>Original Case IDs:</strong> MP-2026-00421, DUP-2026-0089, DUP-2026-0114 remain searchable.</div>
                <div>✓ <strong>Source Tracking:</strong> Helpline 1070, Vidisha Desk, NDRF Boat 3 retained.</div>
                <div>✓ <strong>Conflicting Information:</strong> Spelling variants and clothing notes archived in historical docket.</div>
                <div>✓ <strong>Cryptographic Proof:</strong> SHA-256 ledger block committed with Operator DISP-884 signature.</div>
              </div>

              {/* Operator Notes */}
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Reconciliation Justification (Mandatory for ledger)
                </label>
                <textarea
                  rows={3}
                  required
                  value={operatorNotes}
                  onChange={(e) => setOperatorNotes(e.target.value)}
                  placeholder="e.g. Phone confirmation with Sumeet (brother) and Mahesh (uncle) confirms they are seeking the same individual. NDRF sighting matches Sethani Ghat corridor..."
                  style={{ width: '100%', padding: '8px 10px', fontSize: 'var(--text-xs)' }}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: 'var(--space-4) var(--space-6)',
              backgroundColor: 'var(--bg-app)',
              borderTop: '1px solid var(--border-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 'var(--space-3)',
            }}>
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleMergeSubmit}
                className="btn btn-danger"
                style={{
                  backgroundColor: 'var(--color-crimson)',
                  borderColor: 'var(--color-crimson)',
                }}
              >
                <Check size={14} />
                <span>Execute Non-Destructive Merge</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DuplicateResolutionPage;
