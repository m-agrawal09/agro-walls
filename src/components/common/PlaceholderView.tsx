import React from 'react';
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
  CheckCircle2 
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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
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
            <button className="btn btn-secondary" title="Export Operational Log">
              <Download size={14} />
              <span>Export CSV</span>
            </button>
            <button className="btn btn-secondary" title="Sync CAD Feed">
              <RefreshCw size={14} />
              <span>Sync</span>
            </button>
            <button className="btn btn-primary">
              <span>{actionButtonText}</span>
            </button>
          </>
        }
      />

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
                placeholder="Filter by Case ID, name, or incident code..."
                style={{
                  width: '100%',
                  height: '32px',
                  paddingLeft: '32px',
                  paddingRight: '12px',
                }}
              />
            </div>
            <button className="btn btn-secondary" style={{ height: '32px' }}>
              <Filter size={13} />
              <span>Filters</span>
            </button>
            <button className="btn btn-secondary" style={{ height: '32px' }}>
              <ArrowUpDown size={13} />
              <span>Sort</span>
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
    </div>
  );
};
