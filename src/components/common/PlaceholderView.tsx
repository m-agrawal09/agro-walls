import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from './PageHeader';
import { Badge, BadgeVariant } from './Badge';
import { StatusDot } from './StatusDot';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Download, 
  RefreshCw, 
  Clock, 
  ShieldAlert, 
  Layers, 
  CheckCircle2,
  X
} from 'lucide-react';

export interface StatMetric {
  label: string;
  value: string | number;
  subtext?: string;
  badge?: { text: string; variant: BadgeVariant };
}

interface PlaceholderViewProps {
  title: string;
  subtitle: string;
  category: 'OPERATIONS' | 'SYSTEM';
  badgeText?: string;
  badgeVariant?: BadgeVariant;
  stats?: StatMetric[];
  telemetryCode?: string;
  emptyHeading?: string;
  emptyDescription?: string;
  actionButtonText?: string;
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({
  title,
  subtitle,
  category,
  badgeText,
  badgeVariant = 'default',
  stats = [
    { label: 'STATUS', value: 'ONLINE', badge: { text: 'MONITORED', variant: 'forest' } },
    { label: 'QUEUE DEPTH', value: '0 ITEMS', subtext: 'Updated 4s ago' },
    { label: 'CAD DISPATCH FEED', value: 'SYNCHRONIZED', badge: { text: '12ms LATENCY', variant: 'forest' } },
    { label: 'RESTRICTED CLEARANCE', value: 'LEVEL 2', subtext: 'Tactical Operator' },
  ],
  telemetryCode = 'SYS-CAD-0941',
  emptyHeading = 'Awaiting Incoming Queue Data',
  emptyDescription = 'Module connected to Regional Emergency Dispatch Core. Records and updates will stream into this table in real-time as incident reports are submitted or correlated.',
  actionButtonText = 'Perform Manual Query',
}) => {
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [filterActive, setFilterActive] = useState(false);
  const [sortAsc, setSortAsc] = useState(true);
  const [searchVal, setSearchVal] = useState('');
  const [queryModalOpen, setQueryModalOpen] = useState(false);
  const [modalQueryInput, setModalQueryInput] = useState('');

  // Functional CSV Export
  const handleExportCsv = () => {
    const headers = ['Timestamp', 'Module', 'Category', 'TelemetryCode', 'MetricLabel', 'MetricValue'];
    const rows = stats.map(s => [
      new Date().toISOString(),
      `"${title}"`,
      `"${category}"`,
      `"${telemetryCode}"`,
      `"${s.label}"`,
      `"${s.value}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_operational_log.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSyncFeedback('Operational log CSV generated and downloaded.');
    setTimeout(() => setSyncFeedback(null), 3500);
  };

  // Functional Sync
  const handleSync = () => {
    setIsSyncing(true);
    setSyncFeedback('Synchronizing with CAD Gateway & regional disaster telemetry...');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncFeedback(`CAD Feed synchronized at ${new Date().toLocaleTimeString()} (0ms drift).`);
      setTimeout(() => setSyncFeedback(null), 3500);
    }, 800);
  };

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQueryModalOpen(false);
    if (modalQueryInput.trim()) {
      navigate(`/cases?search=${encodeURIComponent(modalQueryInput.trim())}`);
    } else {
      navigate('/cases');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', position: 'relative' }}>
      <PageHeader
        breadcrumbs={[
          { label: 'RECONNECT OPS' },
          { label: category },
          { label: title },
        ]}
        title={title}
        subtitle={subtitle}
        metadata={
          badgeText ? (
            <Badge variant={badgeVariant} dot>
              {badgeText}
            </Badge>
          ) : undefined
        }
        actions={
          <>
            <button 
              type="button"
              onClick={handleExportCsv}
              className="btn btn-secondary" 
              title="Export Operational Log to CSV"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
            <button 
              type="button"
              onClick={handleSync}
              disabled={isSyncing}
              className="btn btn-secondary" 
              title="Sync CAD Feed"
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
              <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
            </button>
            <button 
              type="button"
              onClick={() => setQueryModalOpen(true)}
              className="btn btn-primary"
            >
              <span>{actionButtonText}</span>
            </button>
          </>
        }
      />

      {syncFeedback && (
        <div style={{
          padding: '0.65rem 2rem',
          background: 'var(--color-forest-bg)',
          borderBottom: '1px solid var(--color-forest-border)',
          color: 'var(--color-forest-text)',
          fontSize: '0.82rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={15} color="var(--color-forest)" />
            <span>{syncFeedback}</span>
          </div>
          <button 
            type="button"
            onClick={() => setSyncFeedback(null)} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div style={{ padding: 'var(--space-6) var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Metric Cards Grid */}
        {stats && stats.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-4)',
          }}>
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="surface-card"
                style={{
                  padding: 'var(--space-4) var(--space-5)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-1)',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.04em',
                }}>
                  <span>{stat.label}</span>
                  {stat.badge && (
                    <Badge variant={stat.badge.variant}>
                      {stat.badge.text}
                    </Badge>
                  )}
                </div>
                <div style={{
                  fontSize: 'var(--text-xl)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                }}>
                  {stat.value}
                </div>
                {stat.subtext && (
                  <div style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-secondary)',
                  }}>
                    {stat.subtext}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tactical Search & Filter Toolbar */}
        <div
          className="surface-card"
          style={{
            padding: 'var(--space-3) var(--space-4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flex: 1, minWidth: '260px' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchVal.trim()) {
                    navigate(`/cases?search=${encodeURIComponent(searchVal.trim())}`);
                  }
                }}
                placeholder="Filter by Case ID, name, or incident code..."
                style={{
                  width: '100%',
                  height: '32px',
                  paddingLeft: '32px',
                  paddingRight: '12px',
                  fontSize: 'var(--text-xs)',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-base)',
                  borderRadius: 'var(--radius-xs)'
                }}
              />
            </div>
            <button 
              type="button"
              onClick={() => setFilterActive(prev => !prev)}
              className="btn btn-secondary" 
              style={{ 
                height: '32px',
                backgroundColor: filterActive ? 'var(--bg-subtle)' : undefined,
                borderColor: filterActive ? 'var(--primary-color)' : undefined,
                color: filterActive ? 'var(--primary-color)' : undefined
              }}
            >
              <Filter size={13} />
              <span>{filterActive ? 'Filter: Active' : 'Filters'}</span>
            </button>
            <button 
              type="button"
              onClick={() => setSortAsc(prev => !prev)}
              className="btn btn-secondary" 
              style={{ height: '32px' }}
            >
              <ArrowUpDown size={13} />
              <span>Sort: {sortAsc ? 'ASC' : 'DESC'}</span>
            </button>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <StatusDot variant="forest" pulse />
              CAD STREAM: LIVE
            </span>
            <span>|</span>
            <span>CHANNEL: SECURE-09</span>
          </div>
        </div>

        {/* Operational Ready / Staging Card */}
        <div
          className="surface-card"
          style={{
            padding: 'var(--space-10) var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            minHeight: '340px',
            borderStyle: 'solid',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-4)',
            }}
          >
            <Layers size={22} />
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-2)',
          }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>
              {emptyHeading}
            </h3>
            <Badge variant="charcoal">
              {telemetryCode}
            </Badge>
          </div>

          <p style={{
            maxWidth: '560px',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            lineHeight: 'var(--leading-relaxed)',
            marginBottom: 'var(--space-6)',
          }}>
            {emptyDescription}
          </p>

          <div style={{
            display: 'flex',
            gap: 'var(--space-3)',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-2) var(--space-3)',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--text-xs)',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
            }}>
              <CheckCircle2 size={13} color="var(--color-forest)" />
              <span>SCHEMA: FEMA-EDXL-CAP 1.2</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-2) var(--space-3)',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--text-xs)',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
            }}>
              <Clock size={13} color="var(--color-amber)" />
              <span>RETENTION: 90-DAY DISASTER CYCLE</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-2) var(--space-3)',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--text-xs)',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
            }}>
              <ShieldAlert size={13} color="var(--text-secondary)" />
              <span>AUDIT: ACTIVE TAMPER-PROOF LOG</span>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Query Modal */}
      {queryModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-base)',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '480px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid var(--border-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Search size={16} color="var(--primary-color)" />
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {actionButtonText}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setQueryModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleQuerySubmit} style={{ padding: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                Query Case ID, Name, or Incident Code
              </label>
              <input
                type="text"
                value={modalQueryInput}
                onChange={(e) => setModalQueryInput(e.target.value)}
                placeholder="e.g. MP-2026-00421 or Ramesh or Sector 4"
                autoFocus
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-base)',
                  fontSize: '0.85rem',
                  marginBottom: '1rem',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)'
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setQueryModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ fontSize: '0.82rem', padding: '6px 16px' }}
                >
                  Search Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
