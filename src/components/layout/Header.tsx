import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Plus, 
  Radio, 
  Clock 
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { StatusDot } from '../common/StatusDot';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  onToggleSidebar,
}) => {
  const navigate = useNavigate();
  const [timeUtc, setTimeUtc] = useState('');
  const [timeLocal, setTimeLocal] = useState('');

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      setTimeUtc(now.toUTCString().slice(17, 25) + ' UTC');
      setTimeLocal(now.toTimeString().slice(0, 8) + ' LOC');
    };
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      style={{
        height: 'var(--header-height)',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-4)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Left Area: Toggle & Incident Scope */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <button
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? 'Collapse navigation' : 'Expand navigation'}
          className="btn btn-ghost"
          style={{
            width: '32px',
            height: '32px',
            padding: 0,
            color: 'var(--text-secondary)',
          }}
        >
          <Menu size={18} />
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          paddingLeft: 'var(--space-2)',
          borderLeft: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <StatusDot variant="forest" pulse size={8} />
            <span style={{
              fontSize: 'var(--text-xs)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              color: 'var(--text-primary)',
              letterSpacing: '0.04em',
            }}>
              INCIDENT ALPHA-04
            </span>
          </div>

          <Badge variant="amber">
            LEVEL 2 OPS
          </Badge>

          <span style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            display: 'none',
          }}>
            COASTAL SURGE DISPATCH
          </span>
        </div>
      </div>

      {/* Center Area: Global Search */}
      <div style={{
        flex: 1,
        maxWidth: '520px',
        margin: '0 var(--space-4)',
      }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder="Search Case ID (RC-2026-XXXX), Person Name, or Location..."
            style={{
              width: '100%',
              height: '34px',
              paddingLeft: '32px',
              paddingRight: '60px',
              fontSize: 'var(--text-sm)',
              backgroundColor: 'var(--bg-app)',
              borderColor: 'var(--border-subtle)',
            }}
          />
          <div style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 'var(--text-xs)',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            padding: '1px 5px',
            borderRadius: 'var(--radius-xs)',
            pointerEvents: 'none',
          }}>
            /
          </div>
        </div>
      </div>

      {/* Right Area: Telemetry Clocks, CAD status, Action */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        {/* Operational Clocks */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-secondary)',
          backgroundColor: 'var(--bg-app)',
          border: '1px solid var(--border-subtle)',
          padding: '4px 10px',
          borderRadius: 'var(--radius-sm)',
        }}>
          <Clock size={13} color="var(--text-muted)" />
          <span style={{ fontWeight: 600 }}>{timeUtc || '00:00:00 UTC'}</span>
          <span style={{ color: 'var(--border-strong)' }}>|</span>
          <span>{timeLocal || '00:00:00 LOC'}</span>
        </div>

        {/* CAD Live Feed Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 8px',
          borderRadius: 'var(--radius-sm)',
          fontSize: 'var(--text-xs)',
          fontFamily: 'var(--font-mono)',
          color: 'var(--color-forest-text)',
          backgroundColor: 'var(--color-forest-bg)',
          border: '1px solid var(--color-forest-border)',
        }}>
          <Radio size={12} color="var(--color-forest)" />
          <span>CAD: LIVE</span>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => navigate('/report/new')}
          className="btn btn-primary"
          style={{ height: '34px' }}
        >
          <Plus size={15} />
          <span>Rapid Intake</span>
        </button>

        {/* Operator Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          paddingLeft: 'var(--space-2)',
          borderLeft: '1px solid var(--border-subtle)',
        }}>
          <div
            style={{
              width: '30px',
              height: '30px',
              backgroundColor: 'var(--color-charcoal-800)',
              color: 'var(--text-inverse)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
            }}
            title="Operator ID: DISP-884"
          >
            D8
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)' }}>
              DISP-884
            </span>
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              TIER 2
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
