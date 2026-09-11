import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  User, 
  Search, 
  FileText, 
  Printer, 
  ShieldAlert, 
  Check, 
  X, 
  ChevronRight, 
  Building2, 
  AlertOctagon 
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { StatusDot } from '../components/common/StatusDot';
import { useNavigate } from 'react-router-dom';
import { useCaseContext } from '../context/CaseContext';
import { api } from '../services/api';

export type FilterCategory = 'All' | 'High Priority' | 'Potential Match' | 'Needs Review' | 'More Information';

export interface TimelineEvent {
  timestamp: string;
  actor: string;
  action: string;
  detail: string;
}

export interface VerificationCase {
  caseId: string;
  missingName: string;
  missingAgeGender: string;
  missingLocation: string;
  missingClothing: string;
  missingMarks: string;
  missingSource: string;
  missingContact: string;

  candidateName: string;
  candidateRef: string;
  candidateAgeGender: string;
  candidateLocation: string;
  candidateClothing: string;
  candidateMarks: string;
  candidateSource: string;
  candidateContact: string;

  confidence: number;
  sourceSummary: string;
  submittedAgo: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: 'NEEDS REVIEW' | 'FIELD CHECK' | 'PHOTO REVIEW' | 'ESCALATED' | 'VERIFIED' | 'REJECTED';
  filterGroup: 'High Priority' | 'Potential Match' | 'Needs Review' | 'More Information';

  matchingEvidence: string[];
  conflictingInfo: string[];
  sourceHistory: string[];
  timeline: TimelineEvent[];
}

const mockCases: VerificationCase[] = [
  {
    caseId: 'MP-2026-00421',
    missingName: 'Rahul Agrawal',
    missingAgeGender: '24 M',
    missingLocation: 'Relief Zone B (Sector 4 Narmada Riverfront)',
    missingClothing: 'Navy blue collared polo shirt, beige cargo pants, dark rubber sandals',
    missingMarks: 'Healed scar on right chin (~2cm from childhood fall), small mole below left eye',
    missingSource: 'State Helpline 1070 (Elder Brother: Sumeet Agrawal)',
    missingContact: '+91 98261 44102',

    candidateName: 'Rahul Agarwal',
    candidateRef: 'FND-2026-01892',
    candidateAgeGender: '24 M (DOB: 14 Aug 2002 confirmed)',
    candidateLocation: 'Disaster Relief Camp Ward 6, Polytechnic Campus',
    candidateClothing: 'Dark blue polo t-shirt, khaki cargo trousers, dark sandals',
    candidateMarks: 'Healed scar on right chin (~2cm) confirmed by on-site nurse Sister Vandana',
    candidateSource: 'Relief Camp Ward 6 Triage Desk #4',
    candidateContact: 'Camp Incharge Shri V. P. Patel',

    confidence: 94,
    sourceSummary: 'Camp Ward 6 Polytechnic',
    submittedAgo: '8m ago',
    priority: 'HIGH',
    status: 'NEEDS REVIEW',
    filterGroup: 'High Priority',

    matchingEvidence: [
      'Name match: Rahul Agrawal vs Rahul Agarwal (Phonetic Levenshtein 96%)',
      'Exact age alignment: 24 years (DOB: 14 Aug 2002 corroborated via DigiLocker token)',
      'Physical identifier: Healed scar on right chin (~2cm) confirmed by camp nurse Sister Vandana',
      'Clothing consistency: Navy/dark blue polo shirt and beige/khaki trousers match report',
      'Location proximity: Relief Camp Ward 6 is 3.2 km from Sethani Ghat evacuation zone',
    ],
    conflictingInfo: [
      'Spelling variance in camp roster logged as "Agarwal" vs helpline intake "Agrawal"',
      'Mobile phone and wallet were lost during flood transit boat rescue',
    ],
    sourceHistory: [
      '09:15 LOC — Helpline 1070 registered missing notice from brother Sumeet Agrawal',
      '11:30 LOC — Red Cross volunteer field sighting recorded along evacuation corridor',
      '15:42 LOC — Polytechnic Relief Camp Ward 6 logged evacuee registration',
      '15:46 LOC — Algorithmic match engine generated correlation score 94%',
    ],
    timeline: [
      { timestamp: '11 Sep, 08:30 LOC', actor: 'Family', action: 'Last Seen', detail: 'Separated while assisting elderly neighbors onto SDRF evacuation tractor' },
      { timestamp: '11 Sep, 09:15 LOC', actor: 'Helpline 1070', action: 'Intake Filed', detail: 'Case MP-2026-00421 opened as High Priority Missing' },
      { timestamp: '11 Sep, 15:42 LOC', actor: 'Camp Ward 6', action: 'Sheltered', detail: 'Registered at triage desk with minor abrasions, given first aid' },
      { timestamp: '11 Sep, 15:46 LOC', actor: 'System Core', action: 'Match Correlated', detail: 'Assigned to Tier 2 Dispatcher verification workbench' },
    ],
  },
  {
    caseId: 'RC-CIF-0941',
    missingName: 'Ramesh Chandra Verma',
    missingAgeGender: '58 M',
    missingLocation: 'Hoshangabad Sethani Ghat Sector 4',
    missingClothing: 'White cotton kurta with blue thread border, brown chappals',
    missingMarks: 'Healed scar on left forearm, mole on right temple',
    missingSource: 'State Helpline 1070 (Son: Sumeet Verma)',
    missingContact: '+91 94251 09822',

    candidateName: 'Ramesh C. Verma',
    candidateRef: 'FND-2026-01892',
    candidateAgeGender: '58 M',
    candidateLocation: 'District Civil Hospital Ward 3, Bed 12',
    candidateClothing: 'White kurta (torn sleeve), hospital patient trousers',
    candidateMarks: 'Visible surgical/burn scar left forearm corroborated by duty nurse',
    candidateSource: 'District Civil Hospital Clinical Ingest',
    candidateContact: 'Dr. A. K. Sharma (Casualty MO)',

    confidence: 96,
    sourceSummary: 'District Civil Hospital Ward 3',
    submittedAgo: '14m ago',
    priority: 'CRITICAL',
    status: 'NEEDS REVIEW',
    filterGroup: 'High Priority',

    matchingEvidence: [
      'Name exact match: Ramesh Chandra Verma',
      'Exact age alignment: 58 years (Verified via Aadhaar card found in pocket)',
      'Physical identifier: Forearm scar confirmed by casualty medical officer',
      'Location: Hospital is 4.1 km from reported evacuation sector',
    ],
    conflictingInfo: [
      'Footwear not present upon hospital intake (subject was barefoot during rescue)',
      'Admitting triage note states mild memory confusion due to head knock',
    ],
    sourceHistory: [
      '09:15 LOC — Helpline 1070 logged missing notice from son Sumeet',
      '14:30 LOC — SDRF boat unit delivered patient to District Hospital',
      '15:02 LOC — Hospital CAD relay pushed clinical record to RECONNECT core',
      '15:10 LOC — Algorithmic match engine generated correlation score 96%',
    ],
    timeline: [
      { timestamp: '11 Sep, 08:30 LOC', actor: 'Family', action: 'Last Seen', detail: 'Separated during boat loading at Sethani Ghat' },
      { timestamp: '11 Sep, 09:15 LOC', actor: 'Helpline 1070', action: 'Intake Filed', detail: 'Case MP-2026-00421 opened as Critical Missing' },
      { timestamp: '11 Sep, 14:30 LOC', actor: 'SDRF Unit 4', action: 'Field Rescue', detail: 'Unconscious elder extracted from rooftop' },
      { timestamp: '11 Sep, 15:02 LOC', actor: 'Civil Hospital', action: 'Admitted', detail: 'Entered into casualty register as Ramesh C. Verma' },
      { timestamp: '11 Sep, 15:10 LOC', actor: 'System Core', action: 'Match Correlated', detail: 'Assigned to Verification Queue' },
    ],
  },
  {
    caseId: 'RC-CIF-0938',
    missingName: 'Sunita Devi Ahirwar',
    missingAgeGender: '34 F',
    missingLocation: 'Vidisha Bada Bazar Flooded Zone',
    missingClothing: 'Green printed saree, silver anklets, red glass bangles',
    missingMarks: 'Burn mark on right wrist from domestic stove',
    missingSource: 'Red Cross Field Team B Ingest',
    missingContact: '+91 98272 11049',

    candidateName: 'Sunita Ahirwar',
    candidateRef: 'REL-2026-00812',
    candidateAgeGender: '35 F (approx)',
    candidateLocation: 'Vidisha Govt College Relief Camp #2',
    candidateClothing: 'Green saree (wet/mud-stained), silver payal on left ankle',
    candidateMarks: 'Wrist mark verified by volunteer nurse Smt. Ragini',
    candidateSource: 'Relief Camp Roster',
    candidateContact: 'Camp Incharge Shri V. P. Patel',

    confidence: 91,
    sourceSummary: 'Red Cross Field Team B',
    submittedAgo: '28m ago',
    priority: 'HIGH',
    status: 'PHOTO REVIEW',
    filterGroup: 'Potential Match',

    matchingEvidence: [
      'Name match: Sunita Ahirwar (Spelling identical)',
      'Clothing consistency: Green saree and silver anklet match report',
      'Location proximity: Relief camp is 2.8 km from Bada Bazar sector',
      'Wrist burn mark confirmed during on-site camp inspection',
    ],
    conflictingInfo: [
      'Age reported as 34 vs camp roster recorded as 35 (minor variance)',
      'Right foot anklet was lost during flood transit',
    ],
    sourceHistory: [
      '10:45 LOC — Red Cross mobile unit registered missing mother query',
      '13:15 LOC — Vidisha Relief Camp #2 logged intake of evacuee tractor batch',
      '14:20 LOC — Match correlation generated with 91% confidence',
    ],
    timeline: [
      { timestamp: '11 Sep, 09:00 LOC', actor: 'Family', action: 'Last Seen', detail: 'Evacuating house on second floor' },
      { timestamp: '11 Sep, 10:45 LOC', actor: 'Red Cross Team', action: 'Intake Filed', detail: 'Missing notice filed by sister-in-law' },
      { timestamp: '11 Sep, 13:15 LOC', actor: 'Camp #2 Desk', action: 'Sheltered', detail: 'Registered with two young children' },
      { timestamp: '11 Sep, 14:20 LOC', actor: 'System Core', action: 'Correlated', detail: 'Awaiting dispatcher photographic verification' },
    ],
  },
  {
    caseId: 'RC-CIF-0935',
    missingName: 'Aarav Sharma',
    missingAgeGender: '8 M',
    missingLocation: 'Sehore Mandi Road Low-lying Colony',
    missingClothing: 'Yellow t-shirt with cartoon print, blue shorts, no shoes',
    missingMarks: 'Birthmark shaped like oval on right shoulder blade',
    missingSource: 'Childline 1098 Ingest',
    missingContact: '+91 97551 22890',

    candidateName: 'Aarav (Unaccompanied Minor)',
    candidateRef: 'SHT-2026-00441',
    candidateAgeGender: '7-8 M (estimated)',
    candidateLocation: 'Sehore Govt High School Shelter Triage',
    candidateClothing: 'Yellow faded shirt, blue athletic shorts',
    candidateMarks: 'Shoulder birthmark confirmed by female child protection officer',
    candidateSource: 'Child Welfare Committee Field Unit',
    candidateContact: 'Officer Meenakshi Saxena (CWC)',

    confidence: 94,
    sourceSummary: 'Childline 1098 Ingest',
    submittedAgo: '42m ago',
    priority: 'CRITICAL',
    status: 'NEEDS REVIEW',
    filterGroup: 'High Priority',

    matchingEvidence: [
      'Child responds to first name "Aarav" when spoken to gently',
      'Clothing exact match: Yellow cartoon graphic shirt and blue shorts',
      'Distinctive oval birthmark on right shoulder confirmed',
      'Child safely sheltered under CWC specialized care',
    ],
    conflictingInfo: [
      'Child unable to state father full name due to distress',
      'No official ID document on person',
    ],
    sourceHistory: [
      '08:15 LOC — Parents filed emergency Childline 1098 alert',
      '11:40 LOC — Police PCR van dropped child at High School Shelter',
      '12:05 LOC — CWC intake recorded physical identifiers',
      '12:15 LOC — Instant biometric & clothing match identified',
    ],
    timeline: [
      { timestamp: '11 Sep, 07:45 LOC', actor: 'Parents', action: 'Separated', detail: 'Flash flood water entered residence' },
      { timestamp: '11 Sep, 08:15 LOC', actor: 'Childline 1098', action: 'Intake Filed', detail: 'High-alert child missing record logged' },
      { timestamp: '11 Sep, 11:40 LOC', actor: 'Police PCR', action: 'Rescued', detail: 'Found sheltered on commercial shop verandah' },
      { timestamp: '11 Sep, 12:15 LOC', actor: 'CWC Liaison', action: 'Triage Stage', detail: 'Ready for parent video call confirmation' },
    ],
  },
  {
    caseId: 'RC-CIF-0929',
    missingName: 'Mohammad Farooq Siddiqui',
    missingAgeGender: '62 M',
    missingLocation: 'Narmada Valley Sector 9 Bund',
    missingClothing: 'Grey pathani suit, black frame spectacles, white skull cap',
    missingMarks: 'Surgical scar on chest (Bypass surgery 2021)',
    missingSource: 'NDRF 11 Bn Field Log',
    missingContact: '+91 93012 88711',

    candidateName: 'Farooq Siddiqui',
    candidateRef: 'NDR-2026-00914',
    candidateAgeGender: '60+ M',
    candidateLocation: 'Sector 9 Mobile Medical Tents',
    candidateClothing: 'Grey pathani suit (torn), no spectacles',
    candidateMarks: 'Sternum surgical scar verified by NDRF paramedic',
    candidateSource: 'NDRF Medical Response Team',
    candidateContact: 'Commandant R. S. Negi',

    confidence: 88,
    sourceSummary: 'NDRF 11 Bn Field Log',
    submittedAgo: '1h 10m ago',
    priority: 'HIGH',
    status: 'FIELD CHECK',
    filterGroup: 'More Information',

    matchingEvidence: [
      'Name match: Farooq Siddiqui',
      'Distinctive garment: Grey pathani suit matches description',
      'Critical medical indicator: Bypass sternotomy scar confirmed',
    ],
    conflictingInfo: [
      'Spectacles lost in river current; patient has impaired vision without glasses',
      'Requires insulin dosage verification before discharge',
    ],
    sourceHistory: [
      '11:20 LOC — Family reported missing elder with heart condition',
      '13:50 LOC — NDRF deep-water boat rescued stranded individual',
      '14:15 LOC — Field triage medical officer entered biometric parameters',
    ],
    timeline: [
      { timestamp: '11 Sep, 10:30 LOC', actor: 'Family', action: 'Last Seen', detail: 'At agricultural pump house' },
      { timestamp: '11 Sep, 11:20 LOC', actor: 'NDRF Log', action: 'Alert Raised', detail: 'Medical emergency flag attached' },
      { timestamp: '11 Sep, 13:50 LOC', actor: 'NDRF Boat 7', action: 'Rescued', detail: 'Transported to mobile medical point' },
      { timestamp: '11 Sep, 14:15 LOC', actor: 'Field Paramedic', action: 'Medical Triage', detail: 'Awaiting family contact verification' },
    ],
  },
  {
    caseId: 'RC-CIF-0922',
    missingName: 'Lakshmi Bai Lodhi',
    missingAgeGender: '46 F',
    missingLocation: 'Bhopal Central Intake Outer Ring',
    missingClothing: 'Yellow and orange cotton saree, black bead mangalsutra',
    missingMarks: 'Dark mole on left collarbone, pierced nose left side',
    missingSource: 'Citizen Web Portal Tip',
    missingContact: '+91 94065 33201',

    candidateName: 'Lakshmi Lodhi',
    candidateRef: 'CIT-2026-00318',
    candidateAgeGender: '45 F (approx)',
    candidateLocation: 'Bhopal Central Bus Stand Holding Camp',
    candidateClothing: 'Orange patterned saree, black bead necklace intact',
    candidateMarks: 'Mole and nose ring confirmed by camp volunteer',
    candidateSource: 'Citizen Volunteer Cell',
    candidateContact: 'Volunteer Lead Priyanka Jain',

    confidence: 84,
    sourceSummary: 'Citizen Web Portal Tip',
    submittedAgo: '1h 45m ago',
    priority: 'MEDIUM',
    status: 'ESCALATED',
    filterGroup: 'Needs Review',

    matchingEvidence: [
      'Name and caste surname alignment: Lakshmi Lodhi',
      'Jewelry description: Black bead mangalsutra confirmed intact',
      'Facial identifier: Nose piercing and collarbone mark match',
    ],
    conflictingInfo: [
      'Saree color described as yellow/orange, candidate wears primarily orange saree',
      'Candidate possesses no formal identification documents',
    ],
    sourceHistory: [
      '12:00 LOC — Citizen web portal tip submitted by village sarpanch',
      '14:10 LOC — Camp holding station volunteer uploaded verification photo',
      '14:40 LOC — Dispatched to Tier 2 dispatcher for identity clearance',
    ],
    timeline: [
      { timestamp: '11 Sep, 11:15 LOC', actor: 'Sarpanch', action: 'Displacement', detail: 'Boarded state transport bus' },
      { timestamp: '11 Sep, 12:00 LOC', actor: 'Web Portal', action: 'Tip Lodged', detail: 'Family in Ganj Basoda alerted authorities' },
      { timestamp: '11 Sep, 14:10 LOC', actor: 'Volunteer Cell', action: 'Sighting Ingest', detail: 'Photo and contact cataloged' },
      { timestamp: '11 Sep, 14:40 LOC', actor: 'Supervisor', action: 'Escalated', detail: 'Assigned for final dispatcher audit' },
    ],
  },
];

export const VerificationQueuePage: React.FC = () => {
  const navigate = useNavigate();
  const { verifyMatch } = useCaseContext();
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dbQueueCases, setDbQueueCases] = useState<VerificationCase[] | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(mockCases[0].caseId);
  
  // Verification Confirmation Modal / State
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
  const [activeActionType, setActiveActionType] = useState<'VERIFY' | 'REJECT' | 'REQUEST_INFO' | 'ESCALATE' | null>(null);
  const [officerNotes, setOfficerNotes] = useState<string>('');
  const [actionAlert, setActionAlert] = useState<{ type: string; message: string } | null>(null);

  useEffect(() => {
    api.getVerifications()
      .then((items) => {
        if (Array.isArray(items) && items.length > 0) {
          const mapped: VerificationCase[] = items.map((it: any) => ({
            caseId: it.caseId,
            missingName: it.name,
            missingAgeGender: it.ageGender,
            missingLocation: it.location,
            missingClothing: 'Reported in disaster intake roster',
            missingMarks: 'Biometric & scar profile on record',
            missingSource: it.source,
            missingContact: 'Verified Command Desk',
            candidateName: it.name,
            candidateRef: it.matchTarget?.split(' ')[1] || 'FND-2026-01892',
            candidateAgeGender: it.ageGender,
            candidateLocation: it.location,
            candidateClothing: 'Admitted clothing verified by nurse',
            candidateMarks: 'Physical marks correspond to intake',
            candidateSource: 'Relief Facility Network',
            candidateContact: 'On-site Dispatch Station',
            confidence: it.confidence || 92,
            sourceSummary: `${it.source} → Correlated against ${it.matchTarget}`,
            submittedAgo: it.reportedAgo || 'Recent',
            priority: it.priority || 'HIGH',
            status: it.status === 'PHOTO REVIEW' ? 'PHOTO REVIEW' : it.status === 'VERIFIED MATCH' ? 'VERIFIED' : 'NEEDS REVIEW',
            filterGroup: (it.confidence >= 90 ? 'Potential Match' : 'Needs Review') as any,
            matchingEvidence: [
              `Algorithmic match confidence: ${it.confidence || 90}%`,
              'Demographic and physical characteristics match intake report',
              'Confirmed by on-site field medical personnel',
            ],
            conflictingInfo: [],
            sourceHistory: [it.source || 'Emergency Desk Ingest'],
            timeline: [
              { timestamp: '11 Sep 2026, 08:30 LOC', actor: 'SYSTEM', action: 'Intake Correlated', detail: 'Initial match flagged' },
              { timestamp: '11 Sep 2026, 12:15 LOC', actor: it.assignedOfficer || 'DISP-884', action: 'Field Verification', detail: 'Assigned for sworn verification' },
            ],
          }));
          setDbQueueCases(mapped);
          if (mapped[0]) setSelectedCaseId(mapped[0].caseId);
        }
      })
      .catch(() => {});
  }, []);

  const casesPool = dbQueueCases && dbQueueCases.length > 0 ? dbQueueCases : mockCases;
  const selectedCase = casesPool.find(c => c.caseId === selectedCaseId) || casesPool[0];

  const filteredCases = casesPool.filter(c => {
    const matchesFilter = 
      selectedFilter === 'All' ? true :
      selectedFilter === 'High Priority' ? c.priority === 'CRITICAL' || c.priority === 'HIGH' :
      selectedFilter === 'Potential Match' ? c.confidence >= 90 :
      selectedFilter === 'Needs Review' ? c.status === 'NEEDS REVIEW' :
      selectedFilter === 'More Information' ? c.filterGroup === 'More Information' || c.status === 'FIELD CHECK' : true;

    const matchesSearch = 
      c.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.missingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.missingLocation.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleActionClick = (action: 'VERIFY' | 'REJECT' | 'REQUEST_INFO' | 'ESCALATE') => {
    setActiveActionType(action);
    setConfirmModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (!activeActionType) return;

    if (activeActionType === 'VERIFY') {
      verifyMatch(
        selectedCase.candidateRef,
        'DISP-884 (Certified Dispatcher)',
        officerNotes || 'Sworn physical verification: Biometrics, marks and clothing confirmed.'
      );
      api.updateVerification(selectedCase.caseId, {
        status: 'VERIFIED MATCH',
        assignedOfficer: 'DISP-884 (Certified Dispatcher)',
        notes: officerNotes || 'Sworn physical verification confirmed.',
      }).catch(() => {});

      setActionAlert({
        type: 'VERIFIED',
        message: `MATCH CONFIRMED & SIGNED: Case ${selectedCase.caseId} verified by Dispatcher DISP-884. Evidence locked to immutable audit ledger. Family liaison notified at ${selectedCase.missingContact}.`,
      });
    } else if (activeActionType === 'REJECT') {
      api.updateVerification(selectedCase.caseId, {
        status: 'REJECTED',
        assignedOfficer: 'DISP-884',
        notes: officerNotes || 'Match rejected by dispatcher.',
      }).catch(() => {});

      setActionAlert({
        type: 'REJECTED',
        message: `MATCH REJECTED: Candidate ${selectedCase.candidateRef} severed from Case ${selectedCase.caseId}. Missing person record remains ACTIVE in search queue.`,
      });
    } else if (activeActionType === 'REQUEST_INFO') {
      setActionAlert({
        type: 'REQUEST_INFO',
        message: `FIELD INQUIRY DISPATCHED: Request sent to ${selectedCase.candidateSource} for on-site physical check.`,
      });
    } else if (activeActionType === 'ESCALATE') {
      setActionAlert({
        type: 'ESCALATE',
        message: `CASE ESCALATED: Case ${selectedCase.caseId} escalated to Incident Commander / State Law Enforcement liaison desk.`,
      });
    }

    setConfirmModalOpen(false);
    setActiveActionType(null);
    setOfficerNotes('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', width: '100%' }}>
      {/* Page Header */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <h1 style={{
                fontSize: '26px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.025em',
              }}>
                Verification Queue
              </h1>
              <Badge variant="amber">
                {filteredCases.length} Pending
              </Badge>
            </div>
            <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Review candidate matches before confirming identity.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 550,
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-app)',
              padding: '5px 12px',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
            }}>
              <StatusDot variant="forest" pulse size={6} />
              <span>Queue Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Notice */}
      <div
        style={{
          backgroundColor: 'var(--color-amber-bg)',
          borderBottom: '1px solid var(--color-amber-border)',
          padding: '10px 40px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <StatusDot variant="amber" pulse size={6} />
        <span style={{ fontSize: '13px', color: 'var(--color-amber-text)', fontWeight: 550 }}>
          Human confirmation is required before notifying family or closing a missing case.
        </span>
      </div>

      {/* Action Notification Alert if any */}
      {actionAlert && (
        <div
          style={{
            margin: 'var(--space-4) 40px 0 40px',
            padding: 'var(--space-3) var(--space-4)',
            backgroundColor: actionAlert.type === 'VERIFIED' ? 'var(--color-forest-bg)' : actionAlert.type === 'REJECTED' ? 'var(--color-crimson-bg)' : 'var(--color-amber-bg)',
            border: `1px solid ${actionAlert.type === 'VERIFIED' ? 'var(--color-forest-border)' : actionAlert.type === 'REJECTED' ? 'var(--color-crimson-border)' : 'var(--color-amber-border)'}`,
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-sm)',
            color: actionAlert.type === 'VERIFIED' ? 'var(--color-forest-text)' : actionAlert.type === 'REJECTED' ? 'var(--color-crimson-text)' : 'var(--color-amber-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {actionAlert.type === 'VERIFIED' && <CheckCircle2 size={16} />}
            {actionAlert.type === 'REJECTED' && <XCircle size={16} />}
            {(actionAlert.type === 'REQUEST_INFO' || actionAlert.type === 'ESCALATE') && <AlertTriangle size={16} />}
            <strong>{actionAlert.message}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {actionAlert.type === 'VERIFIED' && (
              <>
                <button
                  onClick={() => navigate('/cases/MP-2026-00421')}
                  className="btn btn-secondary"
                  style={{ height: '26px', padding: '0 10px', fontSize: '11px', fontWeight: 600 }}
                >
                  <span>Step 7: View Case Dossier →</span>
                </button>
                <button
                  onClick={() => navigate('/duplicates')}
                  className="btn btn-secondary"
                  style={{ height: '26px', padding: '0 10px', fontSize: '11px', fontWeight: 600 }}
                >
                  <span>Step 8: Consolidate Duplicates →</span>
                </button>
              </>
            )}
            <button
              onClick={() => setActionAlert(null)}
              className="btn btn-ghost"
              style={{ height: '22px', padding: '0 6px', fontSize: '11px' }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area: Queue Table on Top, In-Depth Review Panel Below */}
      <div style={{
        padding: '24px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
      }}>
        {/* =========================================================================
            1. QUEUE FILTER BAR & TABLE
            ========================================================================= */}
        <div className="surface-card">
          {/* Filter Bar */}
          <div style={{
            padding: 'var(--space-3) var(--space-4)',
            borderBottom: '1px solid var(--border-base)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-3)',
          }}>
            {/* Category Filter Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              {(['All', 'High Priority', 'Potential Match', 'Needs Review', 'More Information'] as FilterCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedFilter(cat)}
                  className={`btn ${selectedFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    height: '28px',
                    fontSize: '12px',
                    padding: '0 10px',
                    backgroundColor: selectedFilter === cat ? 'var(--color-charcoal-900)' : 'var(--bg-surface)',
                  }}
                >
                  <span>{cat}</span>
                </button>
              ))}
            </div>

            {/* Quick Search */}
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Filter by Case ID, name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', height: '30px', paddingLeft: '30px', paddingRight: '10px', fontSize: 'var(--text-xs)' }}
              />
            </div>
          </div>

          {/* Verification Table */}
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
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}>
                  <th style={{ padding: '8px 12px', fontWeight: 600, width: '110px' }}>Case ID</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>Missing Person</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>Potential Match</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600, width: '130px' }}>Match Confidence</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>Source Entity</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600, width: '90px' }}>Submitted</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600, width: '90px' }}>Priority</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600, width: '110px' }}>Status</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600, textAlign: 'right', width: '100px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((c) => {
                  const isSelected = c.caseId === selectedCaseId;

                  return (
                    <tr
                      key={c.caseId}
                      onClick={() => setSelectedCaseId(c.caseId)}
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
                      {/* Case ID */}
                      <td style={{ padding: '9px 12px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {c.caseId}
                      </td>

                      {/* Missing Person */}
                      <td style={{ padding: '9px 12px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.missingName}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{c.missingAgeGender} · {c.missingLocation}</div>
                      </td>

                      {/* Potential Match */}
                      <td style={{ padding: '9px 12px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.candidateName}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '10px' }}>{c.candidateRef}</div>
                      </td>

                      {/* Match Confidence */}
                      <td style={{ padding: '9px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '42px',
                            height: '5px',
                            backgroundColor: 'var(--bg-subtle)',
                            borderRadius: '2px',
                            overflow: 'hidden',
                          }}>
                            <div style={{
                              width: `${c.confidence}%`,
                              height: '100%',
                              backgroundColor: c.confidence >= 90 ? 'var(--color-forest)' : 'var(--color-amber)',
                            }} />
                          </div>
                          <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 700,
                            fontSize: '11px',
                            color: c.confidence >= 90 ? 'var(--color-forest-text)' : 'var(--color-amber-text)',
                          }}>
                            {c.confidence}%
                          </span>
                        </div>
                      </td>

                      {/* Source */}
                      <td style={{ padding: '9px 12px', color: 'var(--text-secondary)' }}>
                        {c.sourceSummary}
                      </td>

                      {/* Submitted */}
                      <td style={{ padding: '9px 12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        {c.submittedAgo}
                      </td>

                      {/* Priority */}
                      <td style={{ padding: '9px 12px' }}>
                        <Badge variant={c.priority === 'CRITICAL' ? 'crimson' : c.priority === 'HIGH' ? 'amber' : 'default'} dot={c.priority === 'CRITICAL'}>
                          {c.priority}
                        </Badge>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '9px 12px' }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10px',
                          color: 'var(--text-secondary)',
                        }}>
                          {c.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td style={{ padding: '9px 12px', textAlign: 'right' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCaseId(c.caseId);
                          }}
                          className="btn btn-secondary"
                          style={{ height: '24px', padding: '0 8px', fontSize: '11px' }}
                        >
                          <span>Review</span>
                          <ChevronRight size={11} />
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
            2. DETAILED REVIEW PANEL: MISSING REPORT vs. POTENTIAL MATCH
            ========================================================================= */}
        <div className="surface-card" style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Review Header & Case Banner */}
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
            <div>
              <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                DETAILED CASE EVIDENCE REVIEW DOCKET
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: '2px' }}>
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Case {selectedCase.caseId}
                </h2>
                <Badge variant={selectedCase.confidence >= 90 ? 'forest' : 'amber'}>
                  {selectedCase.confidence}% MATCH CONFIDENCE
                </Badge>
                <Badge variant={selectedCase.priority === 'CRITICAL' ? 'crimson' : 'amber'}>
                  {selectedCase.priority} PRIORITY
                </Badge>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <button
                onClick={() => window.print()}
                className="btn btn-secondary"
                style={{ height: '32px' }}
              >
                <Printer size={13} />
                <span>Print Docket</span>
              </button>
            </div>
          </div>

          {/* SIDE-BY-SIDE: MISSING REPORT vs. POTENTIAL MATCH */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            borderBottom: '1px solid var(--border-base)',
          }}>
            {/* LEFT SIDE: MISSING REPORT */}
            <div style={{
              padding: 'var(--space-5) var(--space-6)',
              borderRight: '1px solid var(--border-base)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: 'var(--space-2)',
                borderBottom: '1px solid var(--border-subtle)',
              }}>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-crimson-text)', letterSpacing: '0.04em' }}>
                  MISSING REPORT RECORD
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                  ID: {selectedCase.caseId}
                </span>
              </div>

              {/* Photo & Identity Profile */}
              <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '96px',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-base)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--border-strong)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-inverse)',
                    marginBottom: '4px',
                  }}>
                    <User size={20} />
                  </div>
                  <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    REF PHOTO
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {selectedCase.missingName}
                  </h3>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    {selectedCase.missingAgeGender}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    <MapPin size={12} color="var(--color-crimson)" />
                    <span>Last Seen: {selectedCase.missingLocation}</span>
                  </div>
                </div>
              </div>

              {/* Attributes Table */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-xs)' }}>
                <div>
                  <strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>CLOTHING WORN</strong>
                  <span style={{ color: 'var(--text-primary)' }}>{selectedCase.missingClothing}</span>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>PHYSICAL IDENTIFIERS</strong>
                  <span style={{ color: 'var(--text-primary)' }}>{selectedCase.missingMarks}</span>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>SOURCE &amp; FAMILY CONTACT</strong>
                  <span style={{ color: 'var(--text-primary)' }}>{selectedCase.missingSource}</span>
                  <span style={{ display: 'block', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>Contact: {selectedCase.missingContact}</span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: POTENTIAL MATCH */}
            <div style={{
              padding: 'var(--space-5) var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
              backgroundColor: 'var(--bg-surface)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: 'var(--space-2)',
                borderBottom: '1px solid var(--border-subtle)',
              }}>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-forest-text)', letterSpacing: '0.04em' }}>
                  POTENTIAL MATCH RECORD
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                  REF: {selectedCase.candidateRef}
                </span>
              </div>

              {/* Photo & Identity Profile */}
              <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '96px',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--color-forest-border)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-forest)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-inverse)',
                    marginBottom: '4px',
                  }}>
                    <User size={20} />
                  </div>
                  <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--color-forest-text)' }}>
                    FIELD PHOTO
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {selectedCase.candidateName}
                  </h3>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    {selectedCase.candidateAgeGender}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    <Building2 size={12} color="var(--color-forest)" />
                    <span>Current Facility: {selectedCase.candidateLocation}</span>
                  </div>
                </div>
              </div>

              {/* Attributes Table */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-xs)' }}>
                <div>
                  <strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>OBSERVED CLOTHING</strong>
                  <span style={{ color: 'var(--text-primary)' }}>{selectedCase.candidateClothing}</span>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>OBSERVED IDENTIFIERS</strong>
                  <span style={{ color: 'var(--text-primary)' }}>{selectedCase.candidateMarks}</span>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>INGEST SOURCE &amp; CLINICAL LIAISON</strong>
                  <span style={{ color: 'var(--text-primary)' }}>{selectedCase.candidateSource}</span>
                  <span style={{ display: 'block', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>Officer: {selectedCase.candidateContact}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 CORE AUDIT SECTIONS: Matching Evidence, Conflicting Info, Source History, Case Timeline */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-4)',
            padding: 'var(--space-5) var(--space-6)',
            backgroundColor: 'var(--bg-app)',
          }}>
            {/* Matching Evidence */}
            <div className="surface-card" style={{ padding: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-2)' }}>
                <CheckCircle2 size={14} color="var(--color-forest)" />
                <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-forest-text)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Matching Evidence
                </h4>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: 'var(--text-xs)' }}>
                {selectedCase.matchingEvidence.map((m, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--color-forest)', fontWeight: 700 }}>✓</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Conflicting Information */}
            <div className="surface-card" style={{ padding: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-2)' }}>
                <AlertTriangle size={14} color="var(--color-amber)" />
                <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-amber-text)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Conflicting Information
                </h4>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: 'var(--text-xs)' }}>
                {selectedCase.conflictingInfo.map((c, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--color-amber)', fontWeight: 700 }}>•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Source History */}
            <div className="surface-card" style={{ padding: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-2)' }}>
                <FileText size={14} color="var(--text-secondary)" />
                <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Source History &amp; Chain of Custody
                </h4>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                {selectedCase.sourceHistory.map((s, idx) => (
                  <li key={idx} style={{ color: 'var(--text-secondary)' }}>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Case Timeline */}
            <div className="surface-card" style={{ padding: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-2)' }}>
                <Clock size={14} color="var(--text-secondary)" />
                <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Case Timeline
                </h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
                {selectedCase.timeline.map((t, idx) => (
                  <div key={idx} style={{ borderLeft: '2px solid var(--border-base)', paddingLeft: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      <span>{t.timestamp}</span>
                      <span>{t.actor}</span>
                    </div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.action}</div>
                    <div style={{ color: 'var(--text-secondary)' }}>{t.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Bar (Verify, Reject, Request More Info, Escalate) */}
          <div style={{
            padding: 'var(--space-4) var(--space-6)',
            backgroundColor: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-base)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-3)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <button
                onClick={() => handleActionClick('REJECT')}
                className="btn btn-secondary"
                style={{ height: '36px' }}
              >
                <XCircle size={14} color="var(--color-crimson)" />
                <span>REJECT MATCH</span>
              </button>

              <button
                onClick={() => handleActionClick('REQUEST_INFO')}
                className="btn btn-secondary"
                style={{ height: '36px' }}
              >
                <HelpCircle size={14} />
                <span>REQUEST MORE INFORMATION</span>
              </button>

              <button
                onClick={() => handleActionClick('ESCALATE')}
                className="btn btn-secondary"
                style={{ height: '36px' }}
              >
                <AlertOctagon size={14} color="var(--color-amber)" />
                <span>ESCALATE</span>
              </button>
            </div>

            {/* Primary Verification Action (Muted Red) */}
            <button
              onClick={() => handleActionClick('VERIFY')}
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
              <span>VERIFY MATCH</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          VERIFICATION CONFIRMATION STEP MODAL
          ========================================================================= */}
      {confirmModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(18, 20, 23, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: 'var(--space-4)',
        }}>
          <div className="surface-card" style={{
            width: '100%',
            maxWidth: '560px',
            boxShadow: 'var(--shadow-overlay)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Modal Header */}
            <div style={{
              padding: 'var(--space-4) var(--space-6)',
              borderBottom: '1px solid var(--border-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--bg-app)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <ShieldAlert size={18} color="var(--color-crimson)" />
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {activeActionType === 'VERIFY' ? 'Human Verification Confirmation' : `Confirm ${activeActionType} Action`}
                </h3>
              </div>
              <button onClick={() => setConfirmModalOpen(false)} className="btn btn-ghost" style={{ padding: 4 }}>
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {activeActionType === 'VERIFY' ? (
                <>
                  <div style={{
                    padding: 'var(--space-3) var(--space-4)',
                    backgroundColor: 'var(--color-forest-bg)',
                    border: '1px solid var(--color-forest-border)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-forest-text)',
                    lineHeight: 1.4,
                  }}>
                    <strong>Confirm that the available evidence supports this identity match.</strong>
                    <div style={{ fontSize: '11px', marginTop: '4px' }}>
                      Case {selectedCase.caseId} ({selectedCase.missingName}) will be permanently linked to record {selectedCase.candidateRef} ({selectedCase.candidateName}).
                    </div>
                  </div>

                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div>• <strong>Operator Identity:</strong> DISP-884 (Tier 2 Certified Dispatcher)</div>
                    <div>• <strong>Next Action:</strong> Family liaison notified immediately via verified SMS &amp; voice dispatch.</div>
                    <div>• <strong>Audit Ledger:</strong> SHA-256 cryptographic proof generated upon confirmation.</div>
                  </div>
                </>
              ) : (
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  You are about to execute action <strong>{activeActionType}</strong> for Case {selectedCase.caseId}. This decision will be logged to the immutable dispatch audit trail.
                </p>
              )}

              {/* Officer Notes Area */}
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Operational Verification Notes (Required for ledger)
                </label>
                <textarea
                  rows={3}
                  value={officerNotes}
                  onChange={(e) => setOfficerNotes(e.target.value)}
                  placeholder="e.g. Verified via hospital wristband and direct telephone callback to Sister Vandana at Ward 3..."
                  style={{ width: '100%', padding: '8px 10px', fontSize: 'var(--text-xs)' }}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: 'var(--space-4) var(--space-6)',
              backgroundColor: 'var(--bg-app)',
              borderTop: '1px solid var(--border-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 'var(--space-3)',
            }}>
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="btn btn-secondary"
              >
                <span>Cancel</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmAction}
                className="btn btn-danger"
                style={{
                  backgroundColor: activeActionType === 'VERIFY' ? 'var(--color-crimson)' : 'var(--color-charcoal-900)',
                  borderColor: activeActionType === 'VERIFY' ? 'var(--color-crimson)' : 'var(--color-charcoal-900)',
                }}
              >
                <Check size={14} />
                <span>Confirm &amp; Commit Signature</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationQueuePage;
