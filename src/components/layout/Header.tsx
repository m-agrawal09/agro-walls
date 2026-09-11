import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Plus, 
  Clock,
  User
} from 'lucide-react';
import { StatusDot } from '../common/StatusDot';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  onToggleSidebar,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isOverview = location.pathname === '/' || location.pathname === '/overview';
  const [timeDisplay, setTimeDisplay] = useState('');

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      setTimeDisplay(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const [headerSearch, setHeaderSearch] = useState('');

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      navigate(`/cases?search=${encodeURIComponent(headerSearch.trim())}`);
    } else {
      navigate('/cases');
    }
  };

  return (
    <header
      style={{
        height: 'var(--header-height)',
        backgroundColor: 'rgba(255, 255, 255, 0.42)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.52)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(20px) saturate(150%)',
        WebkitBackdropFilter: 'blur(20px) saturate(150%)',
      }}
    >
      {/* Left Area: Toggle & Incident Scope */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
          gap: '8px',
          paddingLeft: '12px',
          borderLeft: '1px solid rgba(0, 0, 0, 0.08)',
        }}>
          <StatusDot variant="forest" pulse size={7} />
          <span style={{
            fontSize: '14.5px',
            fontWeight: 650,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.015em',
          }}>
            Central India Response
          </span>
        </div>
      </div>

      {/* Center Area: Global Search (Hidden on Overview Page) */}
      {!isOverview ? (
        <div style={{
          flex: 1,
          maxWidth: '460px',
          margin: '0 20px',
        }}>
          <form onSubmit={handleHeaderSearch} style={{ position: 'relative', width: '100%' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              placeholder="Search cases, names, locations..."
              style={{
                width: '100%',
                height: '36px',
                paddingLeft: '36px',
                paddingRight: '16px',
                fontSize: '14px',
                fontFamily: 'var(--font-sans)',
                backgroundColor: 'rgba(255, 255, 255, 0.55)',
                borderColor: 'rgba(255, 255, 255, 0.65)',
                borderRadius: '8px',
              }}
            />
          </form>
        </div>
      ) : (
        <div style={{ flex: 1 }} />
      )}

      {/* Right Area: Time, Family Portal, Actions, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Clock */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: 'var(--font-sans)',
          fontSize: '13px',
          color: 'var(--text-muted)',
          padding: '4px 8px',
        }}>
          <Clock size={14} color="var(--text-muted)" />
          <span style={{ fontWeight: 550 }}>{timeDisplay}</span>
        </div>

        {/* Public Family Status Portal Link */}
        <button
          onClick={() => navigate('/status')}
          className="btn btn-secondary"
          style={{ height: '34px', fontSize: '13px', borderRadius: '7px' }}
        >
          <span>Family Portal</span>
        </button>

        {/* Primary Action Button */}
        <button
          onClick={() => navigate('/report/new')}
          className="btn btn-primary"
          style={{ height: '34px', borderRadius: '7px', fontSize: '13px' }}
        >
          <Plus size={15} />
          <span>New Report</span>
        </button>

        {/* Profile Avatar */}
        <div
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            border: '1px solid var(--border-base)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
          title="Dispatcher Account"
        >
          <User size={15} />
        </div>
      </div>
    </header>
  );
};
