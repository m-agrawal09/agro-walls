import React, { useState } from 'react';
import { 
  Save, 
  CheckCircle2 
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [matchThreshold, setMatchThreshold] = useState(85);
  const [geoRadius, setGeoRadius] = useState(5.0);
  const [smsRelay, setSmsRelay] = useState(true);
  const [autoEnrichment, setAutoEnrichment] = useState(true);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice('Incident dispatch settings saved successfully. Thresholds broadcasted to all cluster nodes.');
    setTimeout(() => setSavedNotice(null), 4000);
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
          maxWidth: '960px',
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
              <span>SYSTEM CONFIGURATION</span>
              <span>•</span>
              <span>CAD GATEWAY PARAMETERS</span>
            </div>
            <h1 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              margin: '2px 0 0 0',
            }}>
              System Settings & Incident Thresholds
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Operational parameters, correlation tolerances, SMS relay endpoints, and local node data buffering.
            </p>
          </div>
        </div>
      </div>

      {savedNotice && (
        <div style={{
          maxWidth: '960px',
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
            <span>{savedNotice}</span>
          </div>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} style={{
        maxWidth: '960px',
        margin: 'var(--space-5) auto 0',
        padding: '0 40px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
      }}>
        {/* Incident Thresholds */}
        <div className="surface-card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
            1. MATCH INTELLIGENCE & CORRELATION TOLERANCES
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Heuristic Confidence Threshold for Verification Queue</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-amber-text)' }}>{matchThreshold}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="98"
                value={matchThreshold}
                onChange={(e) => setMatchThreshold(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-charcoal-900)' }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Candidates scoring above this threshold are automatically routed into the officer Verification Queue.
              </span>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Geospatial Search Proximity Radius</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>{geoRadius} km</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="25.0"
                step="0.5"
                value={geoRadius}
                onChange={(e) => setGeoRadius(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-charcoal-900)' }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Radial distance from last-seen coordinates to evaluate candidate shelter intakes.
              </span>
            </div>
          </div>
        </div>

        {/* Relay and Communications */}
        <div className="surface-card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
            2. DISASTER NOTIFICATION & EMERGENCY RELAYS
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: 'var(--text-primary)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={smsRelay}
                onChange={(e) => setSmsRelay(e.target.checked)}
                style={{ accentColor: 'var(--color-charcoal-900)' }}
              />
              <div>
                <strong>Automated SMS Liaison Notification upon Verification</strong>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Dispatches verified case update to reporting family phone via Twilio Gov Relay.</div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: 'var(--text-primary)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={autoEnrichment}
                onChange={(e) => setAutoEnrichment(e.target.checked)}
                style={{ accentColor: 'var(--color-charcoal-900)' }}
              />
              <div>
                <strong>DigiLocker / Aadhaar Automated Biometric Enrichment</strong>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Retrieves official reference photographs for verified citizen identification numbers.</div>
              </div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              backgroundColor: 'var(--color-charcoal-900)',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              padding: '8px 18px',
            }}
          >
            <Save size={14} />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
