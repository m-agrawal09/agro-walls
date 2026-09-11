import React from 'react';
import { Download } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {

  const sectorData = [
    { sector: 'Sector B-4 (Narmada Riverfront)', missing: 384, located: 298, rate: 77.6, avgHours: 3.8, status: 'HIGH RESCUE ACTIVITY' },
    { sector: 'Sector A-1 (Hoshangabad Ghats)', missing: 312, located: 246, rate: 78.8, avgHours: 4.1, status: 'STABILIZING' },
    { sector: 'Sector C-2 (Vidisha Basin)', missing: 289, located: 198, rate: 68.5, avgHours: 5.2, status: 'ACTIVE INTAKE' },
    { sector: 'Sector S-1 (Sehore Lowlands)', missing: 178, located: 142, rate: 79.7, avgHours: 4.4, status: 'STABILIZING' },
    { sector: 'Sector P-3 (Pipariya Outflow)', missing: 121, located: 88, rate: 72.7, avgHours: 5.9, status: 'MONITORING' },
  ];

  const demographicData = [
    { group: 'Adult Males (18–59)', total: 612, reunited: 462, pending: 150, rate: 75.4 },
    { group: 'Adult Females (18–59)', total: 428, reunited: 334, pending: 94, rate: 78.0 },
    { group: 'Unaccompanied Minors (0–17)', total: 118, reunited: 98, pending: 20, rate: 83.0 },
    { group: 'Elderly / Vulnerable (60+)', total: 126, reunited: 78, pending: 48, rate: 61.9 },
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      backgroundColor: 'var(--bg-app)',
      paddingBottom: 'var(--space-12)',
    }}>
      {/* Top Header */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-base)',
        padding: 'var(--space-5) var(--space-8)',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
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
              <span>OPERATIONS</span>
              <span>•</span>
              <span>SITUATIONAL METRICS</span>
              <span>•</span>
              <span>INCIDENT SITREP</span>
            </div>
            <h1 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              margin: '2px 0 0 0',
            }}>
              Disaster Analytics & Sector Velocity
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Aggregate reunification velocity, demographic vulnerability breakdown, and search sector density metrics.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <button
              onClick={() => alert('Executive Situation Report generated & queued for print export.')}
              className="btn btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                padding: '7px 14px',
              }}
            >
              <Download size={13} />
              <span>Export SitRep Brief (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div style={{
        maxWidth: '1280px',
        margin: 'var(--space-5) auto 0',
        padding: '0 var(--space-8)',
        width: '100%',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--space-4)',
        }}>
          <div className="surface-card" style={{ padding: 'var(--space-4)' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>TOTAL INCIDENT INTAKES</div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>1,284</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Since disaster declaration</div>
          </div>
          <div className="surface-card" style={{ padding: 'var(--space-4)' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>LOCATED & REUNITED</div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-forest-text)', marginTop: '2px' }}>972 (75.7%)</div>
            <div style={{ fontSize: '11px', color: 'var(--color-forest-text)', marginTop: '2px' }}>Exceeding 70% emergency SLA</div>
          </div>
          <div className="surface-card" style={{ padding: 'var(--space-4)' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>AVG TIME TO LOCATE</div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>4.2 HOURS</div>
            <div style={{ fontSize: '11px', color: 'var(--color-forest-text)', marginTop: '2px' }}>-1.6h faster than 2024 flood</div>
          </div>
          <div className="surface-card" style={{ padding: 'var(--space-4)' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>VERIFICATION ACCURACY</div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>99.4%</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Zero misidentifications</div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div style={{
        maxWidth: '1280px',
        margin: 'var(--space-5) auto 0',
        padding: '0 var(--space-8)',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: 'var(--space-5)',
      }}>
        {/* Sector Table */}
        <div className="surface-card" style={{ overflow: 'hidden' }}>
          <div style={{
            padding: 'var(--space-3) var(--space-5)',
            backgroundColor: 'var(--bg-app)',
            borderBottom: '1px solid var(--border-base)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
              GEOSPATIAL SECTOR PERFORMANCE
            </span>
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              SAR SECTOR MAPPING
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-base)', color: 'var(--text-muted)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                  <th style={{ padding: '10px 14px' }}>Sector</th>
                  <th style={{ padding: '10px 14px' }}>Reported</th>
                  <th style={{ padding: '10px 14px' }}>Located</th>
                  <th style={{ padding: '10px 14px' }}>Resolution Rate</th>
                  <th style={{ padding: '10px 14px' }}>Avg Time</th>
                </tr>
              </thead>
              <tbody>
                {sectorData.map((s, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {s.sector}
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{s.missing}</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: 'var(--color-forest-text)', fontWeight: 600 }}>{s.located}</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '50px', height: '6px', backgroundColor: 'var(--border-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: `${s.rate}%`, height: '100%', backgroundColor: 'var(--color-forest)' }} />
                        </div>
                        <span>{s.rate}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{s.avgHours}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Demographic Breakdown */}
        <div className="surface-card" style={{ overflow: 'hidden' }}>
          <div style={{
            padding: 'var(--space-3) var(--space-5)',
            backgroundColor: 'var(--bg-app)',
            borderBottom: '1px solid var(--border-base)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
              VULNERABILITY & DEMOGRAPHIC COHORTS
            </span>
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              CWC / DISASTER RELIEF
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-base)', color: 'var(--text-muted)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                  <th style={{ padding: '10px 14px' }}>Demographic Cohort</th>
                  <th style={{ padding: '10px 14px' }}>Total</th>
                  <th style={{ padding: '10px 14px' }}>Reunited</th>
                  <th style={{ padding: '10px 14px' }}>Pending</th>
                  <th style={{ padding: '10px 14px' }}>Recovery %</th>
                </tr>
              </thead>
              <tbody>
                {demographicData.map((d, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {d.group}
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{d.total}</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: 'var(--color-forest-text)' }}>{d.reunited}</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: d.pending > 30 ? 'var(--color-crimson-text)' : 'var(--color-amber-text)', fontWeight: 600 }}>
                      {d.pending}
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '50px', height: '6px', backgroundColor: 'var(--border-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: `${d.rate}%`, height: '100%', backgroundColor: 'var(--color-charcoal-700)' }} />
                        </div>
                        <span>{d.rate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
