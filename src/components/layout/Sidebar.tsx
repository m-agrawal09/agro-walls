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
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-base)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'width 0.15s ease-in-out',
        userSelect: 'none',
        overflow: 'hidden',
        zIndex: 40,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: isOpen ? 'var(--space-4) var(--space-4)' : 'var(--space-4) var(--space-2)',
          borderBottom: '1px solid var(--border-base)',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          minHeight: 'var(--header-height)',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-charcoal-900)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-inverse)',
            flexShrink: 0,
          }}
        >
          <Shield size={18} strokeWidth={2.2} />
        </div>

        {isOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
              <span
                style={{
                  fontSize: 'var(--text-md)',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  color: 'var(--text-primary)',
                  lineHeight: 1.1,
                }}
              >
                RECONNECT
              </span>
            </div>
            <span
              style={{
                fontSize: '9px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
                whiteSpace: 'nowrap',
              }}
            >
              Coordination Network
            </span>
          </div>
        )}
      </div>

      {/* Incident Status Banner */}
      {isOpen && (
        <div
          style={{
            padding: 'var(--space-2) var(--space-4)',
            backgroundColor: 'var(--bg-app)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 'var(--text-xs)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <StatusDot variant="forest" pulse size={6} />
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontWeight: 500 }}>
              DISPATCH CAD-CORE
            </span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-forest-text)', fontSize: '10px' }}>
            ACTIVE
          </span>
        </div>
      )}

      {/* Navigation Sections */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: 'var(--space-3) 0',
        }}
      >
        {navigationConfig.map((section, sIndex) => (
          <div
            key={sIndex}
            style={{
              marginBottom: 'var(--space-4)',
            }}
          >
            {isOpen ? (
              <div
                style={{
                  padding: 'var(--space-1) var(--space-4)',
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-mono)',
                  marginBottom: 'var(--space-1)',
                }}
              >
                {section.title}
              </div>
            ) : (
              <div
                style={{
                  margin: 'var(--space-2) var(--space-2)',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              />
            )}

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {section.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.path || 
                  (item.path === '/overview' && location.pathname === '/');

                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    title={!isOpen ? `${item.label} (${item.description})` : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: isOpen ? 'space-between' : 'center',
                      padding: isOpen ? '7px 16px' : '9px 0',
                      backgroundColor: isActive ? 'var(--bg-surface-active)' : 'transparent',
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontWeight: isActive ? 600 : 500,
                      fontSize: 'var(--text-sm)',
                      borderLeft: isActive ? '3px solid var(--color-charcoal-900)' : '3px solid transparent',
                      textDecoration: 'none',
                      position: 'relative',
                      transition: 'background-color 0.1s ease',
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
                        gap: 'var(--space-3)',
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
                          width: 6,
                          height: 6,
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

      {/* Footer / System Health info */}
      <div
        style={{
          padding: isOpen ? 'var(--space-3) var(--space-4)' : 'var(--space-3) var(--space-2)',
          borderTop: '1px solid var(--border-base)',
          backgroundColor: 'var(--bg-app)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-1)',
        }}
      >
        {isOpen ? (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-muted)',
              }}
            >
              <span>NODE-US-EAST-02</span>
              <span style={{ color: 'var(--color-forest-text)' }}>ONLINE</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--text-disabled)',
              }}
            >
              <span>CAP-EDXL v1.2</span>
              <span>AES-256</span>
            </div>
          </>
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            title="NODE-US-EAST-02 ONLINE"
          >
            <StatusDot variant="forest" size={8} />
          </div>
        )}
      </div>
    </aside>
  );
};
