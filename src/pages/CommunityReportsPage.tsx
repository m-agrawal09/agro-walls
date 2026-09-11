import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  HelpCircle, 
  Lock, 
  User, 
  MapPin, 
  ArrowRight, 
  X, 
  Link2 
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { StatusDot } from '../components/common/StatusDot';
import { PublicContributionSection } from '../components/common/PublicContributionSection';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export type CommunityTab = 'New Submissions' | 'Under Review' | 'Accepted' | 'Rejected' | 'Potential Duplicate';

export type UserRole = 'CONTROL ROOM' | 'HOSPITAL' | 'RELIEF CAMP' | 'VERIFIER' | 'ADMIN' | 'PUBLIC';

interface CommunityReport {
  id: string;
  reportId: string;
  personDescription: string;
  ageGender: string;
  isMinor: boolean;
  location: string;
  submittedBy: string;
  reporterPhone: string;
  reporterAddress: string;
  source: string;
  timeAgo: string;
  status: 'NEW' | 'UNDER REVIEW' | 'ACCEPTED' | 'REJECTED' | 'DUPLICATE';
  tabCategory: CommunityTab;
  narrative: string;
  clothing: string;
  photoType: string;
  possibleMatchingCase?: {
    caseId: string;
    person: string;
    confidence: number;
  };
  duplicateWarning?: string;
}

const mockCommunityReports: CommunityReport[] = [
  {
    id: 'cr-1',
    reportId: 'CR-2026-0814',
    personDescription: 'Young man in navy blue t-shirt sitting near Sethani temple steps',
    ageGender: '23-25 yrs · Male',
    isMinor: false,
    location: 'Hoshangabad Ghat, Sector 4',
    submittedBy: 'Anand Prakash Sharma',
    reporterPhone: '+91 98261 55902',
    reporterAddress: 'Sethani Mohalla, Ward 12, Hoshangabad',
    source: 'Citizen Portal (Mobile Upload)',
    timeAgo: '12m ago',
    status: 'NEW',
    tabCategory: 'New Submissions',
    narrative: 'Saw him sitting on the high temple steps when the boat rescue was loading. He looked exhausted, had a small mark on his chin. Said he was waiting for family from Pipariya.',
    clothing: 'Dark navy blue polo shirt, khaki/beige pants, no footwear',
    photoType: 'Handheld Mobile Photo (1.4 MB)',
    possibleMatchingCase: {
      caseId: 'MP-2026-00421',
      person: 'Rahul Agrawal (24 M)',
      confidence: 88,
    },
    duplicateWarning: 'High overlap with SMS tip #TIP-984 received 25m ago describing same temple location.',
  },
  {
    id: 'cr-2',
    reportId: 'CR-2026-0811',
    personDescription: 'Lost toddler found wandering near community kitchen',
    ageGender: 'Approx 3-4 yrs · Female',
    isMinor: true,
    location: 'Vidisha Relief Camp Sector 2 Kitchen',
    submittedBy: 'Smt. Kamla Bai (Shelter Volunteer)',
    reporterPhone: '+91 94250 88319',
    reporterAddress: 'Govt Higher Secondary Camp, Vidisha',
    source: 'Relief Camp WhatsApp Tip Line',
    timeAgo: '24m ago',
    status: 'NEW',
    tabCategory: 'New Submissions',
    narrative: 'Child was crying near food distribution tent. Wearing small silver anklet on left foot and yellow frock. Speaks in single words calling for "Maa". Under care of volunteer team.',
    clothing: 'Yellow frock with floral print, silver single anklet, no shoes',
    photoType: 'Camp Volunteer Phone Portrait',
    possibleMatchingCase: {
      caseId: 'MP-2026-00398',
      person: 'Ananya Yadav (3.5 F)',
      confidence: 93,
    },
  },
  {
    id: 'cr-3',
    reportId: 'CR-2026-0808',
    personDescription: 'Elderly gentleman with walking stick at bus depot',
    ageGender: 'Approx 65-70 yrs · Male',
    isMinor: false,
    location: 'Sehore Old Bus Stand Waiting Shed',
    submittedBy: 'Rajendra Solanki (Auto Driver)',
    reporterPhone: '+91 97552 44108',
    reporterAddress: 'Auto Stand #3, Sehore Railway Link',
    source: 'SMS Hotline (1070 Shortcode)',
    timeAgo: '48m ago',
    status: 'UNDER REVIEW',
    tabCategory: 'Under Review',
    narrative: 'Elderly man seemed disoriented, asked where the Bhopal evacuation bus was going. Wearing grey kurta. Says his house in Budhni was flooded.',
    clothing: 'Grey cotton kurta, white dhoti, wooden walking cane',
    photoType: 'No photo provided (Voice/SMS tip)',
    possibleMatchingCase: {
      caseId: 'MP-2026-00412',
      person: 'Deendayal Upadhyay (71 M)',
      confidence: 84,
    },
  },
  {
    id: 'cr-4',
    reportId: 'CR-2026-0802',
    personDescription: 'Woman admitted with minor injuries at primary health center',
    ageGender: '32-35 yrs · Female',
    isMinor: false,
    location: 'Pipariya Community Health Center',
    submittedBy: 'Dr. Neeraj Bansal (PHC Medical Officer)',
    reporterPhone: '+91 94065 77112',
    reporterAddress: 'Pipariya CHC Campus, Hoshangabad',
    source: 'Helpline Web Form (Clinical Ingest)',
    timeAgo: '1h 15m ago',
    status: 'ACCEPTED',
    tabCategory: 'Accepted',
    narrative: 'Admitted from rescue boat Sector 8. Mild dehydration, laceration on right arm treated. Able to communicate clearly. Name given as Sunita Ahirwar.',
    clothing: 'Green saree, red glass bangles',
    photoType: 'Clinical Webcam ID Snapshot',
    possibleMatchingCase: {
      caseId: 'RC-CIF-0938',
      person: 'Sunita Devi Ahirwar (34 F)',
      confidence: 96,
    },
  },
  {
    id: 'cr-5',
    reportId: 'CR-2026-0796',
    personDescription: 'Duplicate tip: same sighting of boy at temple reported twice',
    ageGender: '24 yrs · Male',
    isMinor: false,
    location: 'Sethani Ghat Temple Verandah',
    submittedBy: 'Vikram Joshi (Local Resident)',
    reporterPhone: '+91 93011 22904',
    reporterAddress: 'Ghat Road, Hoshangabad',
    source: 'Citizen Portal',
    timeAgo: '2h 10m ago',
    status: 'DUPLICATE',
    tabCategory: 'Potential Duplicate',
    narrative: 'Saw young man near the temple when water receded 2 inches.',
    clothing: 'Navy blue shirt',
    photoType: 'Low-res photo from 15m away',
    duplicateWarning: 'Exact duplicate of CR-2026-0814 submitted 1 hour later by neighbor.',
  },
  {
    id: 'cr-6',
    reportId: 'CR-2026-0789',
    personDescription: 'Spam/Advertisement submission: commercial boat rental promotion',
    ageGender: 'N/A',
    isMinor: false,
    location: 'Narmada Valley Online Feed',
    submittedBy: 'Unknown Commercial Vendor',
    reporterPhone: '+91 99999 00000',
    reporterAddress: 'Unverified IP address',
    source: 'Public Web Portal',
    timeAgo: '3h 30m ago',
    status: 'REJECTED',
    tabCategory: 'Rejected',
    narrative: 'Commercial private boat rescue service promotional text. No missing person data.',
    clothing: 'N/A',
    photoType: 'Promotional Flyer Graphic',
  },
];

export const CommunityReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<CommunityTab>('New Submissions');
  const [selectedReportId, setSelectedReportId] = useState<string>('CR-2026-0814');
  const [userRole, setUserRole] = useState<UserRole>('CONTROL ROOM');
  const [actionAlert, setActionAlert] = useState<{ type: string; message: string } | null>(null);
  const [dbReports, setDbReports] = useState<CommunityReport[] | null>(null);

  useEffect(() => {
    api.getCommunityReports()
      .then((items) => {
        if (Array.isArray(items) && items.length > 0) {
          const mapped: CommunityReport[] = items.map((r: any) => ({
            id: r._id || r.reportId,
            reportId: r.reportId,
            personDescription: r.personName || r.narrativeDescription || 'Citizen Tip',
            ageGender: r.age ? `${r.age} yrs · ${r.gender || 'Unknown'}` : 'Unknown',
            isMinor: Boolean(r.isMinor),
            location: r.lastKnownLocation || 'Flood Zone',
            submittedBy: r.fullName || 'Anonymous Reporter',
            reporterPhone: r.phoneNumber || '+91 94000 00000',
            reporterAddress: r.address || 'Field Location',
            source: r.source || 'Citizen Portal',
            timeAgo: 'Recent',
            status: r.status || 'NEW',
            tabCategory: r.tabCategory || 'New Submissions',
            narrative: r.narrativeDescription || '',
            clothing: r.clothing || '',
            photoType: r.photoFileName || 'Mobile Photo',
            possibleMatchingCase: r.possibleMatchingCase,
            duplicateWarning: r.duplicateWarning,
          }));
          setDbReports(mapped);
        }
      })
      .catch(() => {
        // Fallback gracefully
      });
  }, []);

  const reportsPool = dbReports && dbReports.length > 0 ? dbReports : mockCommunityReports;
  const selectedReport = reportsPool.find(r => r.reportId === selectedReportId) || reportsPool[0];

  const filteredReports = reportsPool.filter(r => {
    if (activeTab === 'New Submissions') return r.status === 'NEW';
    if (activeTab === 'Under Review') return r.status === 'UNDER REVIEW';
    if (activeTab === 'Accepted') return r.status === 'ACCEPTED';
    if (activeTab === 'Rejected') return r.status === 'REJECTED';
    if (activeTab === 'Potential Duplicate') return r.status === 'DUPLICATE';
    return true;
  });

  // Role-based privacy masking rules
  const isPiiMasked = userRole === 'PUBLIC' || userRole === 'RELIEF CAMP';
  const isMinorMasked = userRole === 'PUBLIC';

  const maskPhone = (phone: string) => {
    if (!isPiiMasked) return phone;
    return phone.slice(0, 7) + '••••••';
  };

  const maskAddress = (address: string) => {
    if (!isPiiMasked) return address;
    return address.split(',')[0] + ', [REDACTED FOR PUBLIC PRIVACY]';
  };

  const maskReporter = (name: string) => {
    if (!isPiiMasked) return name;
    return name.split(' ')[0] + ' [CONFIDENTIAL CITIZEN]';
  };

  const handleAction = (actionType: 'ACCEPT' | 'LINK' | 'REJECT' | 'REQUEST_INFO') => {
    if (actionType === 'ACCEPT') {
      setActionAlert({
        type: 'ACCEPTED',
        message: `SUBMISSION ACCEPTED FOR VERIFICATION: Report ${selectedReport.reportId} routed to Sworn Verification Queue. A dispatcher must verify before final ledger inclusion.`,
      });
      api.updateCommunityReport(selectedReport.reportId, 'ACCEPTED', 'Accepted').catch(() => {});
    } else if (actionType === 'LINK') {
      setActionAlert({
        type: 'LINKED',
        message: `LINKED TO CASE: Sighting ${selectedReport.reportId} attached as supplemental evidence to Case ${selectedReport.possibleMatchingCase?.caseId || 'MP-2026-00421'}.`,
      });
    } else if (actionType === 'REJECT') {
      setActionAlert({
        type: 'REJECTED',
        message: `REPORT REJECTED: ${selectedReport.reportId} marked as invalid or duplicate. Archived in crowdsource audit stream.`,
      });
      api.updateCommunityReport(selectedReport.reportId, 'REJECTED', 'Rejected').catch(() => {});
    } else if (actionType === 'REQUEST_INFO') {
      setActionAlert({
        type: 'REQUESTED',
        message: `SMS INQUIRY SENT: Automated disaster relay dispatched to ${selectedReport.submittedBy} requesting clearer landmark or photo.`,
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', width: '100%' }}>
      {/* Header Bar */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-base)',
          padding: '32px 40px 24px 40px',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              marginBottom: '2px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>
              <span>CONTROLLED CROWDSOURCING INGESTION</span>
              <span>/</span>
              <span>COMMUNITY TIP-LINE</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <h1 style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 600,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}>
                Community Reports
              </h1>
              <Badge variant="forest">
                18 INCOMING TIPS TODAY
              </Badge>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                Citizen submissions remain unverified until sworn dispatcher validation.
              </span>
            </div>
          </div>

          {/* Role-Based Privacy Switcher */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            backgroundColor: 'var(--bg-app)',
            padding: '4px 10px',
            border: '1px solid var(--border-base)',
            borderRadius: 'var(--radius-sm)',
          }}>
            <Lock size={13} color="var(--text-muted)" />
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
              ROLE CLEARANCE:
            </span>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as UserRole)}
              style={{
                height: '24px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-strong)',
                padding: '0 6px',
                cursor: 'pointer',
              }}
            >
              <option value="CONTROL ROOM">CONTROL ROOM (Full Access)</option>
              <option value="VERIFIER">VERIFIER (Sworn Triage)</option>
              <option value="HOSPITAL">HOSPITAL (Clinical Data)</option>
              <option value="RELIEF CAMP">RELIEF CAMP (Masked PII)</option>
              <option value="ADMIN">ADMIN (System Logs)</option>
              <option value="PUBLIC">PUBLIC (Strict Privacy)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mandatory Unverified Label Banner */}
      <div
        style={{
          backgroundColor: 'var(--color-amber-bg)',
          borderBottom: '1px solid var(--color-amber-border)',
          padding: '10px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            color: 'var(--color-amber-text)',
            letterSpacing: '0.04em',
            backgroundColor: 'var(--bg-surface)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-xs)',
            border: '1px solid var(--color-amber-border)',
          }}>
            <StatusDot variant="amber" pulse size={7} />
            <span>UNVERIFIED COMMUNITY REPORT</span>
          </div>

          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-amber-text)' }}>
            Public and citizen submissions do not modify active missing person records directly. All accepted data enters the verification queue.
          </span>
        </div>

        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-amber-text)', opacity: 0.9 }}>
          FIREWALL: ISOLATED INGEST BUFFER
        </span>
      </div>

      {/* Action Notification Alert */}
      {actionAlert && (
        <div
          style={{
            margin: 'var(--space-3) 40px 0 40px',
            padding: 'var(--space-3) var(--space-4)',
            backgroundColor: actionAlert.type === 'ACCEPTED' ? 'var(--color-forest-bg)' : actionAlert.type === 'REJECTED' ? 'var(--color-crimson-bg)' : 'var(--color-amber-bg)',
            border: `1px solid ${actionAlert.type === 'ACCEPTED' ? 'var(--color-forest-border)' : actionAlert.type === 'REJECTED' ? 'var(--color-crimson-border)' : 'var(--color-amber-border)'}`,
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-sm)',
            color: actionAlert.type === 'ACCEPTED' ? 'var(--color-forest-text)' : actionAlert.type === 'REJECTED' ? 'var(--color-crimson-text)' : 'var(--color-amber-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {actionAlert.type === 'ACCEPTED' && <CheckCircle2 size={16} />}
            {actionAlert.type === 'REJECTED' && <XCircle size={16} />}
            {(actionAlert.type === 'LINKED' || actionAlert.type === 'REQUESTED') && <AlertTriangle size={16} />}
            <strong>{actionAlert.message}</strong>
          </div>
          <button onClick={() => setActionAlert(null)} className="btn btn-ghost" style={{ padding: 2 }}>
            <X size={12} />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div style={{
        padding: '24px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
        maxWidth: '1240px',
        width: '100%',
        margin: '0 auto',
      }}>
        {/* Public Contribution Architecture & Workflow */}
        <PublicContributionSection />

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {(['New Submissions', 'Under Review', 'Accepted', 'Rejected', 'Potential Duplicate'] as CommunityTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                height: '32px',
                fontSize: '12px',
                padding: '0 14px',
                backgroundColor: activeTab === tab ? 'var(--color-charcoal-900)' : 'var(--bg-surface)',
              }}
            >
              <span>{tab}</span>
              {tab === 'New Submissions' && (
                <span style={{
                  padding: '1px 5px',
                  backgroundColor: 'var(--color-crimson)',
                  color: 'var(--text-inverse)',
                  borderRadius: '2px',
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  marginLeft: '4px',
                }}>
                  2
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Submissions Table */}
        <div className="surface-card">
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 'var(--text-xs)',
              textAlign: 'left',
            }}>
              <thead>
                <tr style={{
                  backgroundColor: 'var(--bg-app)',
                  borderBottom: '1px solid var(--border-base)',
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}>
                  <th style={{ padding: '8px 12px', width: '110px' }}>Report ID</th>
                  <th style={{ padding: '8px 12px' }}>Person / Description</th>
                  <th style={{ padding: '8px 12px' }}>Location</th>
                  <th style={{ padding: '8px 12px' }}>Submitted By</th>
                  <th style={{ padding: '8px 12px' }}>Source Channel</th>
                  <th style={{ padding: '8px 12px', width: '80px' }}>Time</th>
                  <th style={{ padding: '8px 12px', width: '110px' }}>Status</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right', width: '90px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((r) => {
                  const isSelected = r.reportId === selectedReportId;

                  return (
                    <tr
                      key={r.id}
                      onClick={() => setSelectedReportId(r.reportId)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: isSelected ? 'var(--bg-surface-active)' : 'transparent',
                        borderBottom: '1px solid var(--border-subtle)',
                        borderLeft: isSelected ? '3px solid var(--color-charcoal-900)' : '3px solid transparent',
                        transition: 'background-color 0.1s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <td style={{ padding: '9px 12px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {r.reportId}
                      </td>

                      <td style={{ padding: '9px 12px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{r.personDescription}</span>
                          {r.isMinor && (
                            <span style={{
                              padding: '1px 5px',
                              backgroundColor: 'var(--color-crimson-bg)',
                              color: 'var(--color-crimson-text)',
                              fontSize: '9px',
                              fontFamily: 'var(--font-mono)',
                              borderRadius: '2px',
                              border: '1px solid var(--color-crimson-border)',
                            }}>
                              MINOR
                            </span>
                          )}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{r.ageGender}</div>
                      </td>

                      <td style={{ padding: '9px 12px', color: 'var(--text-secondary)' }}>
                        {r.location}
                      </td>

                      <td style={{ padding: '9px 12px', color: 'var(--text-primary)' }}>
                        {maskReporter(r.submittedBy)}
                      </td>

                      <td style={{ padding: '9px 12px', color: 'var(--text-secondary)' }}>
                        {r.source}
                      </td>

                      <td style={{ padding: '9px 12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        {r.timeAgo}
                      </td>

                      <td style={{ padding: '9px 12px' }}>
                        <Badge variant={r.status === 'NEW' ? 'crimson' : r.status === 'ACCEPTED' ? 'forest' : r.status === 'DUPLICATE' ? 'amber' : 'default'} dot={r.status === 'NEW'}>
                          {r.status}
                        </Badge>
                      </td>

                      <td style={{ padding: '9px 12px', textAlign: 'right' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReportId(r.reportId);
                          }}
                          className="btn btn-secondary"
                          style={{ height: '22px', padding: '0 8px', fontSize: '10px' }}
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* =========================================================================
            DETAILED SUBMISSION REVIEW PANEL
            ========================================================================= */}
        <div className="surface-card" style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Review Header */}
          <div style={{
            padding: 'var(--space-4) var(--space-6)',
            borderBottom: '1px solid var(--border-base)',
            backgroundColor: 'var(--bg-app)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-3)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div>
                <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  CROWDSOURCE INTAKE REVIEW
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: '2px' }}>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Submission {selectedReport.reportId}
                  </h3>
                  <Badge variant="amber">UNVERIFIED PUBLIC RECORD</Badge>
                </div>
              </div>

              {selectedReport.isMinor && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 8px',
                  backgroundColor: 'var(--color-crimson-bg)',
                  border: '1px solid var(--color-crimson-border)',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: 'var(--color-crimson-text)',
                }}>
                  <AlertTriangle size={13} color="var(--color-crimson)" />
                  <span>PRIVACY RESTRICTED — MINOR PROTECTION PROTOCOL</span>
                </div>
              )}
            </div>

            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              SOURCE: {selectedReport.source} · {selectedReport.timeAgo}
            </div>
          </div>

          {/* Submission Details Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            borderBottom: '1px solid var(--border-base)',
          }}>
            {/* Left: Narrative & Description */}
            <div style={{ padding: 'var(--space-5) var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', borderRight: '1px solid var(--border-base)' }}>
              <div>
                <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  OBSERVATIONAL NARRATIVE
                </span>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginTop: '4px', lineHeight: 1.45, fontWeight: 500 }}>
                  "{selectedReport.narrative}"
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px', display: 'block' }}>LOCATION OF SIGHTING</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    <MapPin size={12} color="var(--color-crimson)" />
                    <span>{selectedReport.location}</span>
                  </div>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px', display: 'block' }}>CLOTHING OBSERVED</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{selectedReport.clothing}</span>
                </div>
              </div>

              {/* Photo Area */}
              <div style={{ marginTop: 'var(--space-2)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px', display: 'block', marginBottom: '6px' }}>
                  ATTACHED PHOTOGRAPH
                </span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-4)',
                  padding: 'var(--space-3)',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                }}>
                  <div style={{
                    width: '64px',
                    height: '76px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-base)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <User size={24} color="var(--text-muted)" />
                    <span style={{ fontSize: '8px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>PHOTO</span>
                  </div>

                  <div style={{ fontSize: 'var(--text-xs)' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>{selectedReport.photoType}</strong>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {isMinorMasked ? 'Facial blurring applied automatically under minor privacy regulation.' : 'Raw photographic upload verified by automated malware scan.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Reporter Details & Privacy Masking */}
            <div style={{ padding: 'var(--space-5) var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', backgroundColor: 'var(--bg-surface)' }}>
              {/* Reporter Privacy Box */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    REPORTER DETAILS (ROLE RESTRICTED)
                  </span>
                  <Badge variant={isPiiMasked ? 'amber' : 'forest'}>
                    {isPiiMasked ? 'PII MASKED' : 'UNMASKED CLEARANCE'}
                  </Badge>
                </div>

                <div style={{
                  padding: 'var(--space-3) var(--space-4)',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-base)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  fontSize: 'var(--text-xs)',
                }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Reporter Name: </span>
                    <strong style={{ color: 'var(--text-primary)' }}>{maskReporter(selectedReport.submittedBy)}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Callback Phone: </span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{maskPhone(selectedReport.reporterPhone)}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Residence Address: </span>
                    <span style={{ color: 'var(--text-secondary)' }}>{maskAddress(selectedReport.reporterAddress)}</span>
                  </div>
                </div>
              </div>

              {/* Possible Matching Cases */}
              {selectedReport.possibleMatchingCase && (
                <div>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    CORRELATED ACTIVE CASE
                  </span>
                  <div style={{
                    padding: 'var(--space-3) var(--space-4)',
                    backgroundColor: 'var(--color-forest-bg)',
                    border: '1px solid var(--color-forest-border)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-forest-text)' }}>
                        {selectedReport.possibleMatchingCase.caseId} · {selectedReport.possibleMatchingCase.person}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-forest-text)', opacity: 0.85 }}>
                        Correlation Confidence: {selectedReport.possibleMatchingCase.confidence}%
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/cases/${selectedReport.possibleMatchingCase?.caseId}`)}
                      className="btn btn-secondary"
                      style={{ height: '26px', fontSize: '11px', borderColor: 'var(--color-forest-border)' }}
                    >
                      <span>View Case</span>
                      <ArrowRight size={11} />
                    </button>
                  </div>
                </div>
              )}

              {/* Duplicate Warning if any */}
              {selectedReport.duplicateWarning && (
                <div style={{
                  padding: 'var(--space-3) var(--space-4)',
                  backgroundColor: 'var(--color-amber-bg)',
                  border: '1px solid var(--color-amber-border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-amber-text)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '6px',
                }}>
                  <AlertTriangle size={14} color="var(--color-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Duplicate Warning:</strong> {selectedReport.duplicateWarning}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Bar (Accept, Link, Reject, Request Info) */}
          <div style={{
            padding: 'var(--space-4) var(--space-6)',
            backgroundColor: 'var(--bg-app)',
            borderTop: '1px solid var(--border-base)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-3)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <button
                onClick={() => handleAction('REJECT')}
                className="btn btn-secondary"
                style={{ height: '36px' }}
              >
                <XCircle size={14} color="var(--color-crimson)" />
                <span>REJECT REPORT</span>
              </button>

              <button
                onClick={() => handleAction('REQUEST_INFO')}
                className="btn btn-secondary"
                style={{ height: '36px' }}
              >
                <HelpCircle size={14} />
                <span>REQUEST MORE INFORMATION</span>
              </button>

              {selectedReport.possibleMatchingCase && (
                <button
                  onClick={() => handleAction('LINK')}
                  className="btn btn-secondary"
                  style={{ height: '36px' }}
                >
                  <Link2 size={14} />
                  <span>LINK TO EXISTING CASE</span>
                </button>
              )}
            </div>

            {/* Primary Action (Accept for verification) */}
            <button
              onClick={() => handleAction('ACCEPT')}
              className="btn btn-danger"
              style={{
                height: '38px',
                padding: '0 24px',
                backgroundColor: 'var(--color-crimson)',
                borderColor: 'var(--color-crimson)',
                fontWeight: 600,
                fontSize: 'var(--text-sm)',
              }}
            >
              <CheckCircle2 size={16} />
              <span>ACCEPT FOR VERIFICATION</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            PRIVACY & ACCESS CONTROL GOVERNANCE MATRIX
            ========================================================================= */}
        <div className="surface-card" style={{ padding: 'var(--space-5) var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                SECURITY &amp; ETHICAL DATA GOVERNANCE
              </span>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>
                Role-Based Clearance &amp; Privacy Masking Policy
              </h4>
            </div>
            <Badge variant="default">CJIS / HIPAA COMPLIANT</Badge>
          </div>

          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: 'var(--space-3)' }}>
            To safeguard displaced citizens and children, personally identifiable information (PII) is dynamically masked based on verified operational clearance:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 'var(--space-2)', fontSize: '11px' }}>
            {[
              { role: 'CONTROL ROOM', clearance: 'Unrestricted', phone: 'Visible', minor: 'Full ID Access' },
              { role: 'VERIFIER', clearance: 'Sworn Triage', phone: 'Visible', minor: 'Protected Review' },
              { role: 'HOSPITAL', clearance: 'Clinical Only', phone: 'Masked', minor: 'Medical Data Only' },
              { role: 'RELIEF CAMP', clearance: 'Shelter Ops', phone: 'Masked', minor: 'Camp Triage Only' },
              { role: 'ADMIN', clearance: 'System Audit', phone: 'Masked', minor: 'Ledger Hash Only' },
              { role: 'PUBLIC', clearance: 'Zero PII', phone: 'Redacted', minor: 'Blurred & Protected' },
            ].map((r, idx) => (
              <div
                key={idx}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  backgroundColor: userRole === r.role ? 'var(--bg-app)' : 'var(--bg-surface)',
                  border: userRole === r.role ? '2px solid var(--color-charcoal-900)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{r.role}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '10px', marginTop: '2px' }}>{r.clearance}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '10px', marginTop: '4px' }}>Phones: {r.phone}</div>
                <div style={{ color: 'var(--color-crimson-text)', fontSize: '10px' }}>Minors: {r.minor}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityReportsPage;
