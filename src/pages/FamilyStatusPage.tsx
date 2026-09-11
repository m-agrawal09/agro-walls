import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Phone, 
  Info, 
  ArrowRight, 
  X 
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCaseContext } from '../context/CaseContext';

export type CaseStatusType = 
  | 'Report Received'
  | 'Looking for a Match'
  | 'Potential Match — Verification in Progress'
  | 'More Information Required'
  | 'Verified Match'
  | 'Resolved';

interface StatusProfile {
  status: CaseStatusType;
  headline: string;
  reassuranceNote: string;
  currentStepIndex: number; // 1 to 6
  alertVariant: 'neutral' | 'amber' | 'forest' | 'crimson';
}

const statusProfiles: Record<CaseStatusType, StatusProfile> = {
  'Report Received': {
    status: 'Report Received',
    headline: 'REPORT RECEIVED & ENTERED',
    reassuranceNote: 'Your report has entered our disaster coordination network. Intake officers are currently verifying spelling, contact details, and location coordinates before running the first search pass.',
    currentStepIndex: 1,
    alertVariant: 'neutral',
  },
  'Looking for a Match': {
    status: 'Looking for a Match',
    headline: 'LOOKING FOR A MATCH',
    reassuranceNote: 'No verified match has been found yet. This does not mean that no information exists. Your case remains active and will continue to be reviewed.',
    currentStepIndex: 4,
    alertVariant: 'amber',
  },
  'Potential Match — Verification in Progress': {
    status: 'Potential Match — Verification in Progress',
    headline: 'POTENTIAL MATCH — VERIFICATION IN PROGRESS',
    reassuranceNote: 'A potential record matching this description has been located at a regional facility. An authorized dispatcher is currently conducting human verification to protect your family from false confirmations.',
    currentStepIndex: 5,
    alertVariant: 'amber',
  },
  'More Information Required': {
    status: 'More Information Required',
    headline: 'MORE INFORMATION REQUIRED',
    reassuranceNote: 'Our verification team has identified candidate sightings but needs an additional photograph or detail regarding clothing/scars to proceed safely. Please contact your family liaison.',
    currentStepIndex: 4,
    alertVariant: 'amber',
  },
  'Verified Match': {
    status: 'Verified Match',
    headline: 'VERIFIED MATCH — CONFIRMATION COMPLETE',
    reassuranceNote: 'Identity has been verified by sworn officers. A family liaison coordinator is reaching out directly to the primary contact number on file.',
    currentStepIndex: 6,
    alertVariant: 'forest',
  },
  'Resolved': {
    status: 'Resolved',
    headline: 'REUNITED & CASE RESOLVED',
    reassuranceNote: 'Safe reunification has been confirmed and registered with regional disaster authorities. The family liaison desk has completed final welfare closure.',
    currentStepIndex: 6,
    alertVariant: 'forest',
  },
};

export const FamilyStatusPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { caseStatus, verifiedCandidate } = useCaseContext();
  const initialCaseId = id || 'MP-2026-00421';
  const [searchInput, setSearchInput] = useState<string>(initialCaseId);
  const [activeCaseId, setActiveCaseId] = useState<string>(initialCaseId);

  const isContextVerified = caseStatus === 'VERIFIED MATCH' || caseStatus === 'FAMILY NOTIFIED';
  const [currentStatus, setCurrentStatus] = useState<CaseStatusType>(
    initialCaseId === 'MP-2026-00421' && isContextVerified ? 'Verified Match' : 'Looking for a Match'
  );
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  useEffect(() => {
    if (activeCaseId === 'MP-2026-00421') {
      if (isContextVerified) {
        setCurrentStatus('Verified Match');
      }
    }
  }, [caseStatus, activeCaseId, isContextVerified]);

  const profile = statusProfiles[currentStatus];

  const timelineSteps = [
    { num: 1, label: 'Report received', desc: 'Case logged via State Disaster Helpline 1070', completed: profile.currentStepIndex > 1, active: profile.currentStepIndex === 1 },
    { num: 2, label: 'Information processed', desc: 'Physical descriptions, clothing and photos indexed', completed: profile.currentStepIndex > 2, active: profile.currentStepIndex === 2 },
    { num: 3, label: 'Cross-source search completed', desc: 'Checked across relief camps, field hospitals and rescue boat logs', completed: profile.currentStepIndex > 3, active: profile.currentStepIndex === 3 },
    { num: 4, label: 'Looking for a verified match', desc: 'Continuous hourly scanning as new shelter rosters arrive', completed: profile.currentStepIndex > 4, active: profile.currentStepIndex === 4 },
    { num: 5, label: 'Human verification', desc: 'On-site officer or medical staff confirms physical identity', completed: profile.currentStepIndex > 5, active: profile.currentStepIndex === 5 },
    { num: 6, label: 'Family notification', desc: 'Direct voice call and liaison support to family member', completed: profile.currentStepIndex >= 6 && (currentStatus === 'Verified Match' || currentStatus === 'Resolved'), active: profile.currentStepIndex === 6 },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const cid = searchInput.trim().toUpperCase();
    setActiveCaseId(cid);
    if (cid === 'MP-2026-00421' && isContextVerified) {
      setCurrentStatus('Verified Match');
    }
    setFeedbackNotice(`Showing live operational status for Case ${cid}`);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      backgroundColor: 'var(--bg-app)',
      color: 'var(--text-primary)',
      paddingBottom: 'var(--space-12)',
    }}>
      {/* Calm, Public-Facing Top Header */}
      <header
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-base)',
          padding: 'var(--space-5) var(--space-6)',
        }}
      >
        <div style={{
          maxWidth: '720px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>
              <span>RECONNECT</span>
              <span>•</span>
              <span>PUBLIC FAMILY PORTAL</span>
            </div>
            <h1 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 600,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              marginTop: '2px',
            }}>
              Missing Person Case Status
            </h1>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-secondary)',
          }}>
            <Phone size={13} color="var(--text-secondary)" />
            <span>24/7 Helpline: <strong>1070</strong></span>
          </div>
        </div>
      </header>

      {/* Main Family Container */}
      <main style={{
        maxWidth: '720px',
        margin: '0 auto',
        width: '100%',
        padding: 'var(--space-6) var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
      }}>
        {/* Search Box Card */}
        <div
          className="surface-card"
          style={{
            padding: 'var(--space-5) var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
          }}
        >
          <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
            Enter your Case ID or Reference Number
          </label>

          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="e.g. MP-2026-00421"
                style={{
                  width: '100%',
                  height: '42px',
                  paddingLeft: '38px',
                  paddingRight: '12px',
                  fontSize: 'var(--text-base)',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.04em',
                }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                height: '42px',
                padding: '0 20px',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
              }}
            >
              <span>Search Status</span>
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span>Example cases:</span>
            <button
              type="button"
              onClick={() => {
                setSearchInput('MP-2026-00421');
                setActiveCaseId('MP-2026-00421');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
              }}
            >
              MP-2026-00421 (Rahul Agrawal)
            </button>
          </div>
        </div>

        {/* Feedback Alert if any */}
        {feedbackNotice && (
          <div style={{
            padding: 'var(--space-2) var(--space-4)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-base)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span>{feedbackNotice}</span>
            <button onClick={() => setFeedbackNotice(null)} className="btn btn-ghost" style={{ padding: 2 }}><X size={12} /></button>
          </div>
        )}

        {/* =========================================================================
            CASE STATUS CARD
            ========================================================================= */}
        <div
          className="surface-card"
          style={{
            padding: 'var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-5)',
          }}
        >
          {/* Person Header */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            paddingBottom: 'var(--space-4)',
            borderBottom: '1px solid var(--border-base)',
            flexWrap: 'wrap',
            gap: 'var(--space-3)',
          }}>
            <div>
              <div style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}>
                Case Reference: {activeCaseId}
              </div>
              <h2 style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                marginTop: '2px',
              }}>
                RAHUL AGRAWAL
              </h2>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Reported by Sumeet Agrawal · Incident: Central India Flood Response
              </div>
            </div>

            {/* Current Status Callout */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '2px',
            }}>
              <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                CURRENT STATUS
              </span>
              <div style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-xs)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                backgroundColor: profile.alertVariant === 'forest' ? 'var(--color-forest-bg)' : 'var(--color-amber-bg)',
                color: profile.alertVariant === 'forest' ? 'var(--color-forest-text)' : 'var(--color-amber-text)',
                border: `1px solid ${profile.alertVariant === 'forest' ? 'var(--color-forest-border)' : 'var(--color-amber-border)'}`,
              }}>
                {profile.headline}
              </div>
            </div>
          </div>

          {/* If verified, show verified confirmation note */}
          {currentStatus === 'Verified Match' && (
            <div style={{
              backgroundColor: 'var(--color-forest-bg)',
              border: '1px solid var(--color-forest-border)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-3) var(--space-4)',
              fontSize: '12px',
              color: 'var(--color-forest-text)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}>
              <strong>OFFICIAL VERIFICATION CONFIRMED:</strong>
              <span>
                {verifiedCandidate 
                  ? `Correlated with candidate record ${verifiedCandidate.ref} (${verifiedCandidate.name}) at ${verifiedCandidate.location}. Verified by ${verifiedCandidate.verifiedBy}.` 
                  : 'Positive identification corroborated by sworn dispatch officers at Relief Camp Ward 6. A dedicated family liaison is contacting your registered phone number.'}
              </span>
            </div>
          )}

          {/* Essential Reassurance Message (Calm, Trustworthy Box) */}
          <div
            style={{
              padding: 'var(--space-4) var(--space-5)',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-base)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={16} color="var(--color-amber)" />
              <p style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                color: 'var(--text-primary)',
                lineHeight: 1.4,
              }}>
                "{profile.reassuranceNote}"
              </p>
            </div>
            <p style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)',
              paddingLeft: '24px',
              lineHeight: 1.45,
            }}>
              Our field coordination centers receive new evacuee rosters from relief camps and hospitals every hour. A sworn officer examines each record individually before any family notification.
            </p>
          </div>

          {/* Simple Vertical Progress Timeline */}
          <div>
            <h3 style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: 'var(--space-4)',
            }}>
              VERIFICATION PROGRESS TIMELINE
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', paddingLeft: 'var(--space-1)' }}>
              {timelineSteps.map((step) => {
                return (
                  <div key={step.num} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                    {/* Status Dot / Checkmark Icon */}
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: step.completed 
                        ? 'var(--color-forest-bg)' 
                        : step.active 
                        ? 'var(--color-amber-bg)' 
                        : 'var(--bg-app)',
                      border: `1px solid ${step.completed ? 'var(--color-forest-border)' : step.active ? 'var(--color-amber-border)' : 'var(--border-base)'}`,
                      color: step.completed 
                        ? 'var(--color-forest)' 
                        : step.active 
                        ? 'var(--color-amber)' 
                        : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}>
                      {step.completed ? (
                        <span>✓</span>
                      ) : step.active ? (
                        <span>●</span>
                      ) : (
                        <span>○</span>
                      )}
                    </div>

                    {/* Step Text */}
                    <div style={{ flex: 1, paddingTop: '1px' }}>
                      <div style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: step.active || step.completed ? 600 : 400,
                        color: step.active 
                          ? 'var(--color-amber-text)' 
                          : step.completed 
                          ? 'var(--text-primary)' 
                          : 'var(--text-muted)',
                      }}>
                        {step.label}
                        {step.active && (
                          <span style={{
                            marginLeft: '8px',
                            fontSize: '10px',
                            fontFamily: 'var(--font-mono)',
                            padding: '1px 6px',
                            backgroundColor: 'var(--color-amber-bg)',
                            color: 'var(--color-amber-text)',
                            borderRadius: '2px',
                            border: '1px solid var(--color-amber-border)',
                          }}>
                            IN PROGRESS NOW
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {step.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Honest Public Guidance Note */}
          <div style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: 'var(--space-4)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-secondary)',
            lineHeight: 1.45,
          }}>
            <strong>Important guidance for families:</strong> Information travels at different speeds across flood-affected zones with limited cell connectivity. A status of "Looking for a Match" simply means cross-referencing is ongoing. It never implies that your family member is in danger or deceased.
          </div>
        </div>

        {/* =========================================================================
            STATUS PREVIEW PICKER (Allows Family/Reviewers to Test All 6 Statuses)
            ========================================================================= */}
        <div
          className="surface-card"
          style={{
            padding: 'var(--space-4) var(--space-5)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              PREVIEW ALL 6 EMERGENCY VERIFICATION STATES
            </span>
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              CLICK ANY STATUS TO INSPECT GUIDANCE
            </span>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {(Object.keys(statusProfiles) as CaseStatusType[]).map((st) => (
              <button
                key={st}
                onClick={() => {
                  setCurrentStatus(st);
                  setFeedbackNotice(`Previewing state: ${st}`);
                }}
                className={`btn ${currentStatus === st ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  height: '28px',
                  fontSize: '11px',
                  padding: '0 10px',
                }}
              >
                <span>{st}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Family Support Contact Card */}
        <div
          className="surface-card"
          style={{
            padding: 'var(--space-5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Phone size={16} color="var(--text-secondary)" />
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                Have new information or need to speak with an officer?
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                State Disaster Hotline (Toll-Free): <strong>1070</strong> · Field Desk WhatsApp: <strong>+91 94251 09822</strong>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/report/new')}
            className="btn btn-secondary"
            style={{ height: '34px' }}
          >
            <span>Submit Sighting / Update</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default FamilyStatusPage;
