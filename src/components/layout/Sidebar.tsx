import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { navigationConfig } from '../../routes/navigationConfig';
import { Badge } from '../common/Badge';
import { StatusDot } from '../common/StatusDot';
import { Shield } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();

  return (
    <aside
      style={{
        width: isOpen ? 'var(--sidebar-width)' : 'var(--sidebar-width-collapsed)',
        backgroundColor: 'var(--sidebar-bg)',
        backdropFilter: 'blur(24px) saturate(150%)',
        WebkitBackdropFilter: 'blur(24px) saturate(150%)',
        borderRight: '1px solid var(--sidebar-border)',
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'width 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
        userSelect: 'none',
        overflow: 'hidden',
        zIndex: 40,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: isOpen ? '0 16px' : '0 12px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          height: 'var(--header-height)',
          minHeight: 'var(--header-height)',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 2px 6px rgba(18, 20, 23, 0.15)',
          }}
        >
          <Shield size={16} strokeWidth={2.4} />
        </div>

        {isOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '16.5px',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                color: 'var(--text-primary)',
                lineHeight: 1.15,
              }}
            >
              Reconnect
            </span>
          </div>
        )}
      </div>

      {/* Navigation Sections */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '12px 0',
        }}
      >
        {navigationConfig.map((section, sIndex) => (
          <div
            key={sIndex}
            style={{
              marginBottom: '16px',
            }}
          >
            {isOpen ? (
              <div
                style={{
                  padding: '4px 16px',
                  fontSize: '12px',
                  fontWeight: 650,
                  letterSpacing: '0.01em',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-sans)',
                  marginBottom: '4px',
                }}
              >
                {section.title}
              </div>
            ) : (
              <div
                style={{
                  margin: '8px 12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.4)',
                }}
              />
            )}

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {section.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.path || 
                  (item.path === '/overview' && location.pathname === '/');

                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    title={!isOpen ? item.label : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: isOpen ? 'space-between' : 'center',
                      margin: '1px 8px',
                      padding: isOpen ? '7px 12px' : '8px 0',
                      borderRadius: '7px',
                      backgroundColor: isActive ? 'var(--bg-surface-active)' : 'transparent',
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '14px',
                      fontFamily: 'var(--font-sans)',
                      letterSpacing: '-0.01em',
                      textDecoration: 'none',
                      position: 'relative',
                      boxShadow: isActive ? '0 1px 3px rgba(0, 0, 0, 0.10)' : 'none',
                      transition: 'all 0.12s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        minWidth: 0,
                      }}
                    >
                      <IconComponent
                        size={17}
                        strokeWidth={isActive ? 2.2 : 1.8}
                        style={{
                          color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                          flexShrink: 0,
                        }}
                      />
                      {isOpen && (
                        <span
                          style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.label}
                        </span>
                      )}
                    </div>

                    {isOpen && item.badge && (
                      <Badge variant={item.badge.variant}>
                        {item.badge.text}
                      </Badge>
                    )}

                    {!isOpen && item.badge && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 8,
                          width: 5,
                          height: 5,
                          borderRadius: '50%',
                          backgroundColor:
                            item.badge.variant === 'crimson'
                              ? 'var(--color-crimson)'
                              : item.badge.variant === 'amber'
                              ? 'var(--color-amber)'
                              : 'var(--color-forest)',
                        }}
                      />
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer / System status */}
      <div
        style={{
          padding: isOpen ? '12px 16px' : '12px 8px',
          borderTop: '1px solid rgba(255, 255, 255, 0.45)',
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isOpen ? 'space-between' : 'center',
        }}
      >
        {isOpen ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <StatusDot variant="forest" pulse size={7} />
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 550,
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Operational
              </span>
            </div>
            <span
              style={{
                fontSize: '12px',
                color: 'var(--text-disabled)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              v2.4
            </span>
          </>
        ) : (
          <div title="System Operational">
            <StatusDot variant="forest" pulse size={7} />
          </div>
        )}
      </div>
    </aside>
  );
};
