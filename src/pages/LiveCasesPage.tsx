import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCaseContext, IncidentCaseStatus } from '../context/CaseContext';
import { api } from '../services/api';
import { 
  Search, 
  ArrowRight, 
  MapPin, 
  AlertTriangle, 
  PlusCircle 
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { StatusDot } from '../components/common/StatusDot';

interface LiveCaseItem {
  caseId: string;
  name: string;
  aliases?: string[];
  age: number;
  gender: 'M' | 'F' | 'Other';
  lastSeenLocation: string;
  sector: string;
  reportedAgo: string;
  source: string;
  priority: 'CRITICAL' | 'HIGH' | 'ROUTINE';
  status: IncidentCaseStatus | 'RESOLVED';
  isMinor?: boolean;
  hasPhoto: boolean;
  keyMarks: string;
}

export const LiveCasesPage: React.FC = () => {
  const navigate = useNavigate();
  const { caseStatus, priority: contextPriority } = useCaseContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Critical' | 'High Priority' | 'Minors' | 'Awaiting Verification' | 'Verified'>('All');
  const [sortBy, setSortBy] = useState<'reported' | 'priority' | 'name'>('priority');
  const [dbCases, setDbCases] = useState<LiveCaseItem[] | null>(null);

  useEffect(() => {
    api.getCases()
      .then((cases) => {
        if (Array.isArray(cases) && cases.length > 0) {
          const mapped: LiveCaseItem[] = cases.map((c) => ({
            caseId: c.caseId,
            name: c.name,
            aliases: c.aliases,
            age: c.age,
            gender: c.gender,
            lastSeenLocation: c.lastSeenLocation,
            sector: c.sector,
            reportedAgo: c.reportedAgo || 'Recent',
            source: c.source,
            priority: c.priority,
            status: c.status,
            isMinor: c.isMinor,
            hasPhoto: c.hasPhoto,
            keyMarks: c.keyMarks || '',
          }));
          setDbCases(mapped);
        }
      })
      .catch(() => {
        // Fallback to baseCases seamlessly
      });
  }, []);

  const baseCases: LiveCaseItem[] = useMemo(() => [
    {
      caseId: 'MP-2026-00421',
      name: 'Rahul Agrawal',
      aliases: ['Rahul Agarwal', 'R. Agrawal'],
      age: 24,
      gender: 'M',
      lastSeenLocation: 'Relief Zone B (Sector 4 Narmada Riverfront)',
      sector: 'Sector B-4',
      reportedAgo: '9h ago',
      source: 'Helpline 1070',
      priority: contextPriority,
      status: caseStatus,
      hasPhoto: true,
      keyMarks: 'Healed scar on right chin (~2cm), small mole below left eye',
    },
    {
      caseId: 'MP-2026-00388',
      name: 'Ananya Sharma',
      aliases: ['Chhoti'],
      age: 4,
      gender: 'F',
      lastSeenLocation: 'Hoshangabad Bus Stand Triage Point',
      sector: 'Sector A-1',
      reportedAgo: '2h 15m ago',
      source: 'Citizen Tip (Smt. Rekha)',
      priority: 'CRITICAL',
      status: 'AWAITING VERIFICATION',
      isMinor: true,
      hasPhoto: true,
      keyMarks: 'Red hair ribbon, small birthmark on left elbow, floral frock',
    },
    {
      caseId: 'MP-2026-00392',
      name: 'Ramesh Chandra Verma',
      age: 58,
      gender: 'M',
      lastSeenLocation: 'Sethani Ghat Evacuation Point',
      sector: 'Sector B-2',
      reportedAgo: '4h ago',
      source: 'District Hospital Ward 3',
      priority: 'CRITICAL',
      status: 'AWAITING VERIFICATION',
      hasPhoto: true,
      keyMarks: 'Healed scar on left forearm, spectacles',
    },
    {
      caseId: 'MP-2026-00395',
      name: 'Sunita Devi Ahirwar',
      age: 34,
      gender: 'F',
      lastSeenLocation: 'Vidisha Relief Camp #2',
      sector: 'Sector C-3',
      reportedAgo: '6h ago',
      source: 'Red Cross Field Team B',
      priority: 'HIGH',
      status: 'LOOKING FOR A MATCH',
      hasPhoto: true,
      keyMarks: 'Green printed saree, silver payal anklet',
    },
    {
      caseId: 'MP-2026-00399',
      name: 'Aarav Sharma',
      age: 8,
      gender: 'M',
      lastSeenLocation: 'Sehore Govt High School Shelter',
      sector: 'Sector S-1',
      reportedAgo: '7h ago',
      source: 'Childline 1098 Ingest',
      priority: 'CRITICAL',
      status: 'AWAITING VERIFICATION',
      isMinor: true,
      hasPhoto: true,
      keyMarks: 'Yellow cartoon print t-shirt, oval birthmark on right shoulder',
    },
    {
      caseId: 'MP-2026-00405',
      name: 'Mohammad Farooq Siddiqui',
      age: 62,
      gender: 'M',
      lastSeenLocation: 'Narmada Valley Rescue Sector 9',
      sector: 'Sector B-9',
      reportedAgo: '8h ago',
      source: 'NDRF 11 Bn Field Log',
      priority: 'HIGH',
      status: 'LOOKING FOR A MATCH',
      hasPhoto: false,
      keyMarks: 'Grey pathani suit, surgical chest scar',
    },
    {
      caseId: 'MP-2026-00412',
      name: 'Kavita Patel',
      age: 29,
      gender: 'F',
      lastSeenLocation: 'Pipariya Sub-divisional Hospital Area',
      sector: 'Sector P-2',
      reportedAgo: '11h ago',
      source: 'State Disaster Helpline 1070',
      priority: 'ROUTINE',
      status: 'LOOKING FOR A MATCH',
      hasPhoto: true,
      keyMarks: 'Maroon salwar suit, gold nose ring',
    },
    {
      caseId: 'MP-2026-00371',
      name: 'Dinesh Prasad Shukla',
      age: 47,
      gender: 'M',
      lastSeenLocation: 'Budhni Railway Bridge Outflow',
      sector: 'Sector B-1',
      reportedAgo: '14h ago',
      source: 'Police Station Budhni Desk',
      priority: 'HIGH',
      status: 'RESOLVED',
      hasPhoto: true,
      keyMarks: 'Blue striped shirt, black watch',
    },
  ], [caseStatus, contextPriority]);

  // Filtering
  const filteredCases = useMemo(() => {
    const casePool = dbCases && dbCases.length > 0 ? dbCases : baseCases;
    return casePool.filter((c) => {
      // Filter tab
      if (activeFilter === 'Critical' && c.priority !== 'CRITICAL') return false;
      if (activeFilter === 'High Priority' && c.priority !== 'HIGH') return false;
      if (activeFilter === 'Minors' && !c.isMinor && c.age >= 18) return false;
      if (activeFilter === 'Awaiting Verification' && c.status !== 'AWAITING VERIFICATION') return false;
      if (activeFilter === 'Verified' && c.status !== 'VERIFIED MATCH' && c.status !== 'RESOLVED') return false;

      // Text search
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        c.caseId.toLowerCase().includes(query) ||
        c.name.toLowerCase().includes(query) ||
        c.lastSeenLocation.toLowerCase().includes(query) ||
        c.sector.toLowerCase().includes(query) ||
        c.keyMarks.toLowerCase().includes(query) ||
        (c.aliases && c.aliases.some((a) => a.toLowerCase().includes(query)))
      );
    });
  }, [baseCases, activeFilter, searchQuery]);

  // Sorting
  const sortedCases = useMemo(() => {
    return [...filteredCases].sort((a, b) => {
      if (sortBy === 'priority') {
        const pOrder = { CRITICAL: 0, HIGH: 1, ROUTINE: 2 };
        return pOrder[a.priority] - pOrder[b.priority];
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0; // default order
    });
  }, [filteredCases, sortBy]);

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
              <span>LIVE REGISTRY</span>
              <span>•</span>
              <span style={{ color: 'var(--color-crimson-text)', fontWeight: 600 }}>DISASTER ZONE ACTIVE</span>
            </div>
            <h1 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              margin: '2px 0 0 0',
            }}>
              Live Cases Tracking Board
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Centralized disaster registry across Regional CAD 911, Emergency Shelters, and Citizen Intakes.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <button
              onClick={() => navigate('/report/new')}
              className="btn btn-primary"
              style={{
                backgroundColor: 'var(--color-charcoal-900)',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                padding: '7px 14px',
              }}
            >
              <PlusCircle size={14} />
              <span>Intake New Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Quick Telemetry Stats */}
      <div style={{
        maxWidth: '1280px',
        margin: 'var(--space-5) auto 0',
        padding: '0 var(--space-8)',
        width: '100%',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-4)',
        }}>
          <div className="surface-card" style={{ padding: 'var(--space-3) var(--space-4)' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>ACTIVE MISSING</div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>42</div>
            <div style={{ fontSize: '11px', color: 'var(--color-crimson-text)', marginTop: '2px' }}>12 in critical 24h window</div>
          </div>
          <div className="surface-card" style={{ padding: 'var(--space-3) var(--space-4)' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>AWAITING VERIFICATION</div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-amber-text)', marginTop: '2px' }}>5</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>In dispatcher review queue</div>
          </div>
          <div className="surface-card" style={{ padding: 'var(--space-3) var(--space-4)' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>UNACCOMPANIED MINORS</div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>7</div>
            <div style={{ fontSize: '11px', color: 'var(--color-forest-text)', marginTop: '2px' }}>CWC specialized liaison</div>
          </div>
          <div className="surface-card" style={{ padding: 'var(--space-3) var(--space-4)' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>REUNITED / SAFE</div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-forest-text)', marginTop: '2px' }}>118</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Confirmed across 6 shelters</div>
          </div>
        </div>
      </div>

      {/* Main Table Workspace */}
      <div style={{
        maxWidth: '1280px',
        margin: 'var(--space-5) auto 0',
        padding: '0 var(--space-8)',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}>
        {/* Filter and Search Bar */}
        <div className="surface-card" style={{ padding: 'var(--space-4) var(--space-5)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
          }}>
            {/* Search Input */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-base)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 12px',
              minWidth: '320px',
              flex: 1,
            }}>
              <Search size={14} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Name, Case ID (e.g. MP-2026-00421), sector, or clothing..."
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '12px',
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--text-primary)',
                  width: '100%',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '11px',
                  }}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
              {(['All', 'Critical', 'High Priority', 'Minors', 'Awaiting Verification', 'Verified'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: activeFilter === tab ? 600 : 400,
                    border: activeFilter === tab ? '1px solid var(--color-charcoal-900)' : '1px solid var(--border-subtle)',
                    backgroundColor: activeFilter === tab ? 'var(--color-charcoal-900)' : 'var(--bg-surface)',
                    color: activeFilter === tab ? '#ffffff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Sort Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>SORT:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-base)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '4px 8px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              >
                <option value="priority">Priority (Urgent First)</option>
                <option value="name">Name (A-Z)</option>
                <option value="reported">Recent Ingest</option>
              </select>
            </div>
          </div>
        </div>

        {/* CAD Cases Table */}
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
              ACTIVE INCIDENT ROSTER ({sortedCases.length} RECORDS DISPLAYED)
            </span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              LIVE CAD SYNCED
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-base)', color: 'var(--text-muted)', fontSize: '10px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 14px' }}>Case ID</th>
                  <th style={{ padding: '10px 14px' }}>Person / Demographic</th>
                  <th style={{ padding: '10px 14px' }}>Last Seen Location</th>
                  <th style={{ padding: '10px 14px' }}>Key Identifiers & Marks</th>
                  <th style={{ padding: '10px 14px' }}>Source</th>
                  <th style={{ padding: '10px 14px' }}>Priority</th>
                  <th style={{ padding: '10px 14px' }}>Status</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedCases.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle size={24} style={{ color: 'var(--color-amber-text)' }} />
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>No matching missing person records found</span>
                        <span style={{ fontSize: '11px' }}>Try adjusting your search keywords or priority filter tabs.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedCases.map((c) => {
                    const isDemoCase = c.caseId === 'MP-2026-00421';
                    return (
                      <tr
                        key={c.caseId}
                        onClick={() => navigate(`/cases/${c.caseId}`)}
                        style={{
                          borderBottom: '1px solid var(--border-subtle)',
                          backgroundColor: isDemoCase ? 'var(--color-amber-bg)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'background-color 0.1s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (!isDemoCase) e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isDemoCase) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        {/* Case ID */}
                        <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>
                              {c.caseId}
                            </span>
                            {isDemoCase && (
                              <Badge variant="amber">DEMO CASE</Badge>
                            )}
                          </div>
                          <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                            {c.reportedAgo}
                          </span>
                        </td>

                        {/* Person Name & Demographics */}
                        <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px' }}>
                            {c.name}
                            {c.isMinor && (
                              <span style={{
                                marginLeft: '6px',
                                fontSize: '9px',
                                fontFamily: 'var(--font-mono)',
                                color: 'var(--color-crimson-text)',
                                backgroundColor: 'var(--color-crimson-bg)',
                                border: '1px solid var(--color-crimson-border)',
                                padding: '1px 5px',
                                borderRadius: '2px',
                              }}>
                                MINOR
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {c.age} yrs · {c.gender === 'M' ? 'Male' : c.gender === 'F' ? 'Female' : 'Other'}
                            {c.aliases && c.aliases.length > 0 && (
                              <span> · Alt: {c.aliases.join(', ')}</span>
                            )}
                          </div>
                        </td>

                        {/* Last Seen Location */}
                        <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                            <MapPin size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                            <span>{c.lastSeenLocation}</span>
                          </div>
                          <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                            Sector: {c.sector}
                          </span>
                        </td>

                        {/* Key Identifiers */}
                        <td style={{ padding: '12px 14px', verticalAlign: 'middle', maxWidth: '240px' }}>
                          <div style={{
                            fontSize: '11px',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.3,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {c.keyMarks}
                          </div>
                        </td>

                        {/* Source */}
                        <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                            {c.source}
                          </span>
                        </td>

                        {/* Priority */}
                        <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                          <Badge variant={c.priority === 'CRITICAL' ? 'crimson' : c.priority === 'HIGH' ? 'amber' : 'default'} dot>
                            {c.priority}
                          </Badge>
                        </td>

                        {/* Status */}
                        <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 600,
                            color: c.status === 'VERIFIED MATCH' || c.status === 'RESOLVED' 
                              ? 'var(--color-forest-text)' 
                              : c.status === 'AWAITING VERIFICATION' 
                              ? 'var(--color-amber-text)' 
                              : 'var(--text-secondary)',
                          }}>
                            <StatusDot
                              variant={c.status === 'VERIFIED MATCH' || c.status === 'RESOLVED' ? 'forest' : c.status === 'AWAITING VERIFICATION' ? 'amber' : 'neutral'}
                              size={6}
                            />
                            {c.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '12px 14px', verticalAlign: 'middle', textAlign: 'right' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/cases/${c.caseId}`);
                            }}
                            className="btn btn-secondary"
                            style={{
                              fontSize: '11px',
                              padding: '4px 8px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span>Dossier</span>
                            <ArrowRight size={11} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
