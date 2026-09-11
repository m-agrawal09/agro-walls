import React from 'react';
import { ArrowRight, ShieldAlert, Check, FileText, User, Inbox, UserCheck } from 'lucide-react';

interface PublicContributionSectionProps {
  className?: string;
  style?: React.CSSProperties;
}

export const PublicContributionSection: React.FC<PublicContributionSectionProps> = ({
  className = '',
  style = {},
}) => {
  const processSteps = [
    {
      id: '01',
      name: 'Public',
      role: 'Citizen / Field Witness',
      detail: 'Anonymous web, SMS or camp desk submission',
      status: 'SOURCE',
      icon: User,
    },
    {
      id: '02',
      name: 'Contribution',
      role: 'Inbound Sighting Data',
      detail: '"Seen at XYZ relief camp"',
      status: 'UNVERIFIED TIP',
      isAmber: true,
      icon: FileText,
    },
    {
      id: '03',
      name: 'Moderation Queue',
      role: 'Isolated Staging Buffer',
      detail: 'Spam, abuse & duplicate deduplication',
      status: 'HOLDING',
      icon: Inbox,
    },
    {
      id: '04',
      name: 'Volunteer / Officer Review',
      role: 'Sworn Dispatch Triage',
      detail: 'Phone callback & physical roster check',
      status: 'HUMAN REVIEW',
      icon: UserCheck,
    },
    {
      id: '05',
      name: 'Verified / Rejected',
      role: 'Audit-Logged Outcome',
      detail: 'Committed to master case or discarded',
      status: 'FINAL DISPOSITION',
      isTerminal: true,
      icon: Check,
    },
  ];

  return (
    <section
      className={`public-contribution-section ${className}`}
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-base)',
        borderRadius: 'var(--radius-sm)',
        padding: 'var(--space-5) var(--space-6)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      aria-label="Public Contribution Workflow"
    >
      {/* Top Meta Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
          paddingBottom: 'var(--space-4)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <div>
            <div
              style={{
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '2px',
              }}
            >
              DISASTER INGESTION ARCHITECTURE // PROTOCOL 04-B
            </div>
            <h2
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 600,
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em',
                margin: 0,
                textTransform: 'uppercase',
              }}
            >
              PUBLIC CONTRIBUTION
            </h2>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '2px 8px',
              backgroundColor: 'var(--color-amber-bg)',
              border: '1px solid var(--color-amber-border)',
              borderRadius: 'var(--radius-xs)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              color: 'var(--color-amber-text)',
              letterSpacing: '0.04em',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-amber)',
                display: 'inline-block',
              }}
            />
            UNVERIFIED TIP
          </div>
        </div>

        <div
          style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
          }}
        >
          BUFFER: ISOLATED_INGEST_V2 • ZERO DIRECT DB WRITES
        </div>
      </div>

      {/* Narrative Sighting Example */}
      <div
        style={{
          marginTop: 'var(--space-4)',
          padding: 'var(--space-3) var(--space-4)',
          backgroundColor: 'var(--bg-app)',
          border: '1px solid var(--border-base)',
          borderRadius: 'var(--radius-xs)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 'var(--space-2)',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Someone submits:
          </span>
          <span
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-primary)',
              fontWeight: 500,
              fontStyle: 'italic',
            }}
          >
            "I may have seen this person at XYZ relief camp."
          </span>
        </div>

        <div
          style={{
            marginTop: '6px',
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
            flexWrap: 'wrap',
          }}
        >
          <span>INGEST_SOURCE: CITIZEN_WEB_FORM</span>
          <span>LOCATION_REF: XYZ_RELIEF_CAMP</span>
          <span>INTEGRITY_CHECK: PENDING_TRIAGE</span>
        </div>
      </div>

      {/* Horizontal / Stacked Process Flow */}
      <div style={{ marginTop: 'var(--space-4)' }}>
        <div
          style={{
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 'var(--space-3)',
          }}
        >
          VERIFICATION &amp; MODERATION PIPELINE:
        </div>

        {/* Desktop Process Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 'var(--space-3)',
            position: 'relative',
          }}
        >
          {processSteps.map((step, idx) => {
            const isLast = idx === processSteps.length - 1;

            return (
              <div
                key={step.id}
                style={{
                  position: 'relative',
                  backgroundColor: 'var(--bg-app)',
                  border: `1px solid ${step.isAmber ? 'var(--color-amber-border)' : 'var(--border-base)'}`,
                  borderRadius: 'var(--radius-xs)',
                  padding: 'var(--space-3)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '124px',
                }}
              >
                {/* Step Header */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '6px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-muted)',
                        fontWeight: 600,
                      }}
                    >
                      {step.id}
                    </span>

                    <span
                      style={{
                        fontSize: '9px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                        padding: '1px 5px',
                        borderRadius: '2px',
                        backgroundColor: step.isAmber
                          ? 'var(--color-amber-bg)'
                          : 'var(--bg-surface)',
                        color: step.isAmber
                          ? 'var(--color-amber-text)'
                          : 'var(--text-muted)',
                        border: `1px solid ${step.isAmber ? 'var(--color-amber-border)' : 'var(--border-subtle)'}`,
                      }}
                    >
                      {step.status}
                    </span>
                  </div>

                  {/* Step Title */}
                  <div
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      lineHeight: 1.3,
                    }}
                  >
                    {step.name}
                  </div>

                  {/* Role / Subtitle */}
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                      marginTop: '2px',
                      lineHeight: 1.35,
                    }}
                  >
                    {step.role}
                  </div>
                </div>

                {/* Step Detail */}
                <div
                  style={{
                    marginTop: 'var(--space-2)',
                    paddingTop: 'var(--space-2)',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '10px',
                    color: 'var(--text-muted)',
                    lineHeight: 1.3,
                  }}
                >
                  {step.detail}
                </div>

                {/* Subtle Right Connector Arrow (Desktop) */}
                {!isLast && (
                  <div
                    style={{
                      position: 'absolute',
                      right: '-11px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 2,
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-base)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-muted)',
                      pointerEvents: 'none',
                    }}
                    aria-hidden="true"
                  >
                    <ArrowRight size={10} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Operational Protocol Guarantee Footer */}
      <div
        style={{
          marginTop: 'var(--space-4)',
          paddingTop: 'var(--space-3)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-2)',
          fontSize: '11px',
          color: 'var(--text-secondary)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldAlert size={14} color="var(--color-amber)" />
          <span>
            <strong>Data Integrity Protocol:</strong> All crowdsourced sightings remain marked as <strong>UNVERIFIED</strong> in the staging buffer until validated by sworn dispatch staff.
          </span>
        </div>

        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
          CJIS COMPLIANT // NO DIRECT CITIZEN COMMITS
        </span>
      </div>
    </section>
  );
};

export default PublicContributionSection;
