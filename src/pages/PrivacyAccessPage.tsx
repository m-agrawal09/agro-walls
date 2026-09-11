import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const PrivacyAccessPage: React.FC = () => {
  const [minorLock, setMinorLock] = useState(true);
  const [phoneMask, setPhoneMask] = useState(true);
  const [addressMask, setAddressMask] = useState(true);
  const [alertNotice, setAlertNotice] = useState<string | null>(null);

  const roleMatrix = [
    { role: 'CONTROL ROOM', clearance: 'TIER 1 (MAX)', photoAccess: 'FULL', piiAccess: 'FULL', minorProtection: 'BYPASS WITH LOG', mergeAccess: 'PERMITTED' },
    { role: 'ADMIN', clearance: 'TIER 1 (ROOT)', photoAccess: 'FULL', piiAccess: 'FULL', minorProtection: 'BYPASS WITH LOG', mergeAccess: 'PERMITTED' },
    { role: 'VERIFIER', clearance: 'TIER 2 (OPERATIONAL)', photoAccess: 'RESTRICTED TO CASE', piiAccess: 'MASKED CONTACTS', minorProtection: 'ENFORCED', mergeAccess: 'RECOMMEND ONLY' },
    { role: 'HOSPITAL', clearance: 'TIER 2 (CLINICAL)', photoAccess: 'MEDICAL ONLY', piiAccess: 'PATIENT DATA ONLY', minorProtection: 'ENFORCED', mergeAccess: 'RESTRICTED' },
    { role: 'RELIEF CAMP', clearance: 'TIER 3 (SHELTER)', photoAccess: 'SHELTER ROSTER', piiAccess: 'REDACTED CONTACTS', minorProtection: 'ENFORCED', mergeAccess: 'RESTRICTED' },
    { role: 'PUBLIC', clearance: 'TIER 4 (ANONYMOUS)', photoAccess: 'WATERMARKED PREVIEW', piiAccess: 'ALL PII MASKED', minorProtection: 'FULL REDACTION', mergeAccess: 'NONE' },
  ];

  const handlePolicyToggle = (policy: string, current: boolean, setter: (val: boolean) => void) => {
    setter(!current);
    setAlertNotice(`Policy updated: "${policy}" set to ${!current ? 'ENABLED' : 'DISABLED'}. Audit log appended.`);
  };

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
        padding: '32px 40px 24px 40px',
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
              <span>SYSTEM GOVERNANCE</span>
              <span>•</span>
              <span>ACCESS CONTROL & PRIVACY</span>
              <span>•</span>
              <span style={{ color: 'var(--color-forest-text)', fontWeight: 600 }}>CJIS / HIPAA COMPLIANT</span>
            </div>
            <h1 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              margin: '2px 0 0 0',
            }}>
              Privacy & Role-Based Access Control
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Multi-agency clearance matrix, minor child protection protocols, and personally identifiable information (PII) masking.
            </p>
          </div>
        </div>
      </div>

      {alertNotice && (
        <div style={{
          maxWidth: '1280px',
          margin: 'var(--space-4) auto 0',
          padding: '0 40px',
          width: '100%',
        }}>
          <div style={{
            padding: 'var(--space-3) var(--space-4)',
            backgroundColor: 'var(--color-forest-bg)',
            border: '1px solid var(--color-forest-border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            color: 'var(--color-forest-text)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <CheckCircle2 size={16} />
            <span>{alertNotice}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div style={{
        maxWidth: '1280px',
        margin: 'var(--space-5) auto 0',
        padding: '0 40px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
      }}>
        {/* Policy Toggles Card */}
        <div className="surface-card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
            EMERGENCY PII MASKING & SENSITIVE DATA ENFORCEMENT
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
            <div style={{ border: '1px solid var(--border-subtle)', padding: 'var(--space-4)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-primary)' }}>Minor Child Protection Protocol</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Auto-redacts address, school, and photo for subjects under 18</div>
              </div>
              <button
                onClick={() => handlePolicyToggle('Minor Protection', minorLock, setMinorLock)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  backgroundColor: minorLock ? 'var(--color-forest)' : 'var(--bg-app)',
                  color: minorLock ? '#ffffff' : 'var(--text-muted)',
                  border: '1px solid var(--border-base)',
                  cursor: 'pointer',
                }}
              >
                {minorLock ? 'ENFORCED' : 'OFF'}
              </button>
            </div>

            <div style={{ border: '1px solid var(--border-subtle)', padding: 'var(--space-4)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-primary)' }}>Phone Number Masking</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Masks contact digits (+91 98261 *****) for public/volunteers</div>
              </div>
              <button
                onClick={() => handlePolicyToggle('Phone Masking', phoneMask, setPhoneMask)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  backgroundColor: phoneMask ? 'var(--color-forest)' : 'var(--bg-app)',
                  color: phoneMask ? '#ffffff' : 'var(--text-muted)',
                  border: '1px solid var(--border-base)',
                  cursor: 'pointer',
                }}
              >
                {phoneMask ? 'MASKED' : 'OFF'}
              </button>
            </div>

            <div style={{ border: '1px solid var(--border-subtle)', padding: 'var(--space-4)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-primary)' }}>Exact Street Address Redaction</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Limits public visibility to general disaster sector radius</div>
              </div>
              <button
                onClick={() => handlePolicyToggle('Address Redaction', addressMask, setAddressMask)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  backgroundColor: addressMask ? 'var(--color-forest)' : 'var(--bg-app)',
                  color: addressMask ? '#ffffff' : 'var(--text-muted)',
                  border: '1px solid var(--border-base)',
                  cursor: 'pointer',
                }}
              >
                {addressMask ? 'REDACTED' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        {/* Clearance Matrix Table */}
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
              MULTI-AGENCY ROLE CLEARANCE MATRIX
            </span>
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              MANDATORY ROLE ACCESS
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-base)', color: 'var(--text-muted)', fontSize: '10px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 14px' }}>User Role</th>
                  <th style={{ padding: '10px 14px' }}>Clearance Tier</th>
                  <th style={{ padding: '10px 14px' }}>Photo Access</th>
                  <th style={{ padding: '10px 14px' }}>PII & Contact Visibility</th>
                  <th style={{ padding: '10px 14px' }}>Minor Protection</th>
                  <th style={{ padding: '10px 14px' }}>Duplicate Merge Authority</th>
                </tr>
              </thead>
              <tbody>
                {roleMatrix.map((rm, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                      {rm.role}
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                      <Badge variant="default">{rm.clearance}</Badge>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {rm.photoAccess}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {rm.piiAccess}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '11px', color: rm.minorProtection === 'ENFORCED' ? 'var(--color-forest-text)' : 'var(--text-primary)', fontWeight: 600 }}>
                      {rm.minorProtection}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '11px', color: rm.mergeAccess === 'PERMITTED' ? 'var(--color-forest-text)' : 'var(--text-muted)', fontWeight: 600 }}>
                      {rm.mergeAccess}
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
