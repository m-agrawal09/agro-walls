import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  PhoneCall, 
  Building2, 
  Users, 
  Globe, 
  HelpCircle,
  LifeBuoy,
  UserCheck,
  UserX,
  Printer,
  RotateCcw,
  Search,
  MapPin,
  Shield,
  X,
  AlertTriangle,
  LucideIcon
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { StatusDot } from '../components/common/StatusDot';
import { useNavigate } from 'react-router-dom';

type ReportType = 
  | 'Missing Person' 
  | 'Found Person' 
  | 'Rescued Person' 
  | 'Hospital Admission' 
  | 'Unidentified Person';

type SourceType = 
  | 'Helpline' 
  | 'Relief Camp' 
  | 'Hospital' 
  | 'Volunteer' 
  | 'NGO' 
  | 'Public' 
  | 'Social Media';

interface FormData {
  // Step 1: Report Type
  reportType: ReportType | '';
  urgencyLevel: 'CRITICAL' | 'HIGH' | 'ROUTINE';
  
  // Step 2: Source
  source: SourceType | '';
  sourceContact: string;
  intakeStation: string;
  sourceReferenceNumber: string;

  // Step 3: Person Details
  fullName: string;
  nameAsReported: string;
  age: string;
  ageIsApproximate: boolean;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'UNKNOWN' | '';
  phoneNumber: string;
  address: string;
  lastKnownLocation: string;
  dateTimeLastSeen: string;
  photoFileName: string;

  // Step 4: Identification
  height: string;
  build: string;
  clothing: string;
  bodyMarks: string;
  otherCharacteristics: string;

  // Narrative
  narrativeDescription: string;
}

const initialFormData: FormData = {
  reportType: 'Missing Person',
  urgencyLevel: 'HIGH',
  source: 'Relief Camp',
  sourceContact: '+91 94251 09822',
  intakeStation: 'Hoshangabad Sector 4 Intake Terminal',
  sourceReferenceNumber: 'ST-2026-H4-082',
  fullName: '',
  nameAsReported: '',
  age: '',
  ageIsApproximate: false,
  gender: '',
  phoneNumber: '',
  address: '',
  lastKnownLocation: '',
  dateTimeLastSeen: '',
  photoFileName: '',
  height: '',
  build: '',
  clothing: '',
  bodyMarks: '',
  otherCharacteristics: '',
  narrativeDescription: '',
};

export const AddReportPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionComplete, setSubmissionComplete] = useState<boolean>(false);
  const [generatedCaseId, setGeneratedCaseId] = useState<string>('');
  const [searchState, setSearchState] = useState<'IDLE' | 'SEARCHING' | 'FOUND'>('IDLE');

  const steps = [
    { num: 1, title: 'Report Type', desc: 'Classification & triage urgency' },
    { num: 2, title: 'Source', desc: 'Ingest authority & station metadata' },
    { num: 3, title: 'Person Details', desc: 'Demographics, names & last seen' },
    { num: 4, title: 'Identification', desc: 'Physical markers, clothing & narrative' },
  ];

  const reportTypeOptions: { id: ReportType; label: string; desc: string; icon: LucideIcon }[] = [
    { id: 'Missing Person', label: 'Missing Person', desc: 'Reported unaccounted for or separated during disaster evacuation', icon: UserX },
    { id: 'Found Person', label: 'Found Person', desc: 'Individual located alive by search party or registered at safe point', icon: UserCheck },
    { id: 'Rescued Person', label: 'Rescued Person', desc: 'Extracted by NDRF / SDRF boat or helicopter rescue team', icon: LifeBuoy },
    { id: 'Hospital Admission', label: 'Hospital Admission', desc: 'Admitted injured, unconscious or unaccompanied at medical facility', icon: Building2 },
    { id: 'Unidentified Person', label: 'Unidentified Person', desc: 'Unable to communicate or deceased individual awaiting positive identification', icon: HelpCircle },
  ];

  const sourceOptions: { id: SourceType; label: string; defaultChannel: string; icon: LucideIcon }[] = [
    { id: 'Helpline', label: 'Emergency Helpline (1070 / 112)', defaultChannel: 'State Disaster Call Center', icon: PhoneCall },
    { id: 'Relief Camp', label: 'Disaster Relief Camp', defaultChannel: 'Camp Roster Triage Desk', icon: Building2 },
    { id: 'Hospital', label: 'Hospital / Medical Unit', defaultChannel: 'Clinical Intake Liaison', icon: Building2 },
    { id: 'Volunteer', label: 'Field Volunteer / SAR Unit', defaultChannel: 'Civil Defence Mobile Ingest', icon: Users },
    { id: 'NGO', label: 'Accredited NGO Partner', defaultChannel: 'Red Cross / SEEDS Field Roster', icon: Users },
    { id: 'Public', label: 'Public Tip / Direct Family', defaultChannel: 'Citizen Intake Portal', icon: Globe },
    { id: 'Social Media', label: 'Social Media / Broadcast Feed', defaultChannel: 'Emergency Broadcast Ingest', icon: Globe },
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, photoFileName: e.target.files![0].name }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const randomCaseNum = Math.floor(10000 + Math.random() * 90000);
      const caseId = `MP-2026-${randomCaseNum}`;
      setGeneratedCaseId(caseId);
      setIsSubmitting(false);
      setSubmissionComplete(true);
      setSearchState('SEARCHING');

      // Simulate correlation scan completion after 2.8 seconds
      setTimeout(() => {
        setSearchState('FOUND');
      }, 2800);
    }, 700);
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setSubmissionComplete(false);
    setGeneratedCaseId('');
    setSearchState('IDLE');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', width: '100%' }}>
      {/* Top Header */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-base)',
          padding: 'var(--space-5) var(--space-8)',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontSize: 'var(--text-xs)',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              marginBottom: 'var(--space-1)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>
              <span>CENTRAL INTAKE TERMINAL</span>
              <span>/</span>
              <span>STANDARDIZED EDXL-CAP INGEST</span>
            </div>
            <h1 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 600,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              marginBottom: '4px',
            }}>
              Add Report — Incident Intake
            </h1>
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
            }}>
              Structured multi-step registration for missing, found, rescued, or hospital-admitted individuals.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: '6px 12px',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)',
            }}>
              <StatusDot variant="forest" pulse size={7} />
              <span>STATION: CENTRAL-INDIA-H4</span>
            </div>

            <button
              onClick={() => navigate('/cases')}
              className="btn btn-secondary"
              style={{ height: '36px' }}
            >
              <span>View Live Cases Board</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Form Body */}
      <div style={{
        padding: 'var(--space-6) var(--space-8)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
        maxWidth: '1080px',
        margin: '0 auto',
        width: '100%',
      }}>
        {/* SUBMISSION SUCCESS STATE */}
        {submissionComplete ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Top Success Banner */}
            <div
              className="surface-card"
              style={{
                backgroundColor: 'var(--color-forest-bg)',
                borderColor: 'var(--color-forest-border)',
                padding: 'var(--space-6) var(--space-8)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-4)',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-forest)',
                  color: 'var(--text-inverse)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CheckCircle2 size={24} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-forest-text)' }}>
                    Report received
                  </h2>
                  <Badge variant="forest">
                    VERIFIED INTAKE
                  </Badge>
                </div>

                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-forest-text)',
                  marginTop: '4px',
                  lineHeight: 'var(--leading-normal)',
                }}>
                  The incident record has been registered in the regional emergency coordination database and broadcast to SAR field units.
                </p>

                {/* Case ID Generation Card */}
                <div style={{
                  marginTop: 'var(--space-4)',
                  padding: 'var(--space-3) var(--space-4)',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--color-forest-border)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-4)',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      OFFICIAL DISPATCH CASE IDENTIFIER
                    </span>
                    <span style={{
                      fontSize: 'var(--text-2xl)',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      letterSpacing: '0.04em',
                    }}>
                      {generatedCaseId}
                    </span>
                  </div>

                  <div style={{ borderLeft: '1px solid var(--border-base)', paddingLeft: 'var(--space-4)', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      STATUS
                    </span>
                    <span style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-forest-text)' }}>
                      OPEN / SEARCH ACTIVE
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Match Correlation Engine Status */}
            <div className="surface-card" style={{ padding: 'var(--space-6) var(--space-8)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Search size={18} color="var(--text-secondary)" />
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Searching existing records for potential matches...
                  </h3>
                </div>
                <Badge variant={searchState === 'FOUND' ? 'amber' : 'forest'} dot>
                  {searchState === 'FOUND' ? '2 CANDIDATES IDENTIFIED' : 'SCANNING 1,284 RECORDS'}
                </Badge>
              </div>

              {searchState === 'SEARCHING' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', padding: 'var(--space-4) 0' }}>
                  <div style={{
                    width: '100%',
                    height: '4px',
                    backgroundColor: 'var(--bg-app)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: '65%',
                      height: '100%',
                      backgroundColor: 'var(--color-crimson)',
                      animation: 'scan-anim 1.6s infinite ease-in-out',
                    }} />
                  </div>
                  <style>{`
                    @keyframes scan-anim {
                      0% { transform: translateX(-100%); }
                      100% { transform: translateX(200%); }
                    }
                  `}</style>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)',
                  }}>
                    <span>Cross-referencing relief camps, medical intakes & helpline transcripts...</span>
                    <span>PIPELINE LATENCY: 140ms</span>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-3)' }}>
                  <div style={{
                    padding: 'var(--space-3) var(--space-4)',
                    backgroundColor: 'var(--color-amber-bg)',
                    border: '1px solid var(--color-amber-border)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-amber-text)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <AlertTriangle size={15} color="var(--color-amber)" />
                      <span>
                        Found <strong>2 potential correlates</strong> in Vidisha Relief Camp #2 and AIIMS Bhopal field triage log.
                      </span>
                    </div>
                    <button
                      onClick={() => navigate('/match-intel')}
                      className="btn btn-secondary"
                      style={{ height: '28px', fontSize: '12px', borderColor: 'var(--color-amber-border)' }}
                    >
                      <span>Review In Match Intel</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>

                  {/* Summary of filed report */}
                  <div style={{
                    border: '1px solid var(--border-base)',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-app)',
                    padding: 'var(--space-4)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 'var(--space-3)',
                    fontSize: 'var(--text-xs)',
                  }}>
                    <div>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block' }}>REPORT TYPE</span>
                      <strong style={{ color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}>{formData.reportType}</strong>
                    </div>
                    <div>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block' }}>SUBJECT NAME</span>
                      <strong style={{ color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}>{formData.fullName || formData.nameAsReported || 'Not Specified'}</strong>
                    </div>
                    <div>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block' }}>AGE / GENDER</span>
                      <span style={{ color: 'var(--text-primary)' }}>{formData.age ? `${formData.age} yrs` : 'Unknown'} • {formData.gender || 'Unknown'}</span>
                    </div>
                    <div>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block' }}>SOURCE & STATION</span>
                      <span style={{ color: 'var(--text-primary)' }}>{formData.source} ({formData.intakeStation})</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 'var(--space-6)',
                paddingTop: 'var(--space-4)',
                borderTop: '1px solid var(--border-subtle)',
                flexWrap: 'wrap',
                gap: 'var(--space-3)',
              }}>
                <button
                  onClick={handleReset}
                  className="btn btn-secondary"
                >
                  <RotateCcw size={14} />
                  <span>File Another Intake Report</span>
                </button>

                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button
                    onClick={() => window.print()}
                    className="btn btn-secondary"
                  >
                    <Printer size={14} />
                    <span>Print Intake Docket</span>
                  </button>
                  <button
                    onClick={() => navigate('/cases')}
                    className="btn btn-primary"
                    style={{ backgroundColor: 'var(--color-charcoal-900)' }}
                  >
                    <span>Go to Live Cases</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* MULTI-STEP INTAKE FORM */
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {/* Step Progress Tracker */}
            <div
              className="surface-card"
              style={{
                padding: 'var(--space-4) var(--space-6)',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 'var(--space-3)',
              }}
            >
              {steps.map((s) => {
                const isActive = currentStep === s.num;
                const isCompleted = currentStep > s.num;

                return (
                  <div
                    key={s.num}
                    onClick={() => setCurrentStep(s.num)}
                    style={{
                      cursor: 'pointer',
                      padding: 'var(--space-2) var(--space-3)',
                      borderLeft: isActive
                        ? '3px solid var(--color-crimson)'
                        : isCompleted
                        ? '3px solid var(--color-forest)'
                        : '3px solid var(--border-subtle)',
                      backgroundColor: isActive ? 'var(--bg-app)' : 'transparent',
                      transition: 'all 0.1s ease',
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      color: isActive ? 'var(--color-crimson)' : isCompleted ? 'var(--color-forest-text)' : 'var(--text-muted)',
                      fontWeight: 600,
                    }}>
                      <span>STEP 0{s.num}</span>
                      {isCompleted && <CheckCircle2 size={12} color="var(--color-forest)" />}
                    </div>
                    <div style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      marginTop: '2px',
                    }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>
                      {s.desc}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Flexible / Emergency Intake Notice */}
            <div style={{
              padding: 'var(--space-2) var(--space-4)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-base)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Shield size={13} color="var(--text-secondary)" />
                <span>
                  <strong>Disaster Intake Policy:</strong> Partial and incomplete reports are accepted. Provide whatever information is available at this moment.
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                * ONLY REPORT TYPE &amp; SOURCE ARE REQUIRED
              </span>
            </div>

            {/* STEP 1: REPORT TYPE */}
            {currentStep === 1 && (
              <div className="surface-card" style={{ padding: 'var(--space-6) var(--space-8)' }}>
                <div style={{ marginBottom: 'var(--space-5)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    STEP 1 OF 4
                  </div>
                  <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Select Report Type
                  </h2>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Choose the primary operational category for this intake record.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-3)' }}>
                  {reportTypeOptions.map((opt) => {
                    const isSelected = formData.reportType === opt.id;
                    const Icon = opt.icon;

                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleInputChange('reportType', opt.id)}
                        style={{
                          padding: 'var(--space-4)',
                          border: isSelected ? '2px solid var(--color-crimson)' : '1px solid var(--border-base)',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: isSelected ? 'var(--color-crimson-bg)' : 'var(--bg-surface)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 'var(--space-2)',
                          transition: 'border-color 0.1s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: isSelected ? 'var(--color-crimson)' : 'var(--bg-app)',
                            color: isSelected ? 'var(--text-inverse)' : 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <Icon size={16} />
                          </div>
                          {isSelected && (
                            <Badge variant="crimson">SELECTED</Badge>
                          )}
                        </div>

                        <div>
                          <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: isSelected ? 'var(--color-crimson-text)' : 'var(--text-primary)' }}>
                            {opt.label}
                          </div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.35 }}>
                            {opt.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Urgency Level */}
                <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)' }}>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                    Initial Triage Priority
                  </label>
                  <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                    {[
                      { id: 'CRITICAL', label: 'CRITICAL (Immediate SAR / Unaccompanied Minor / Medical Emergency)', variant: 'crimson' },
                      { id: 'HIGH', label: 'HIGH (Vulnerable Elder / Flooded Sector Alert)', variant: 'amber' },
                      { id: 'ROUTINE', label: 'ROUTINE (Standard Intake / Post-evacuation Inquiry)', variant: 'default' },
                    ].map((p) => (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => handleInputChange('urgencyLevel', p.id)}
                        className={`btn ${formData.urgencyLevel === p.id ? (p.id === 'CRITICAL' ? 'btn-danger' : 'btn-primary') : 'btn-secondary'}`}
                        style={{ height: '34px', fontSize: 'var(--text-xs)' }}
                      >
                        <span>{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: SOURCE */}
            {currentStep === 2 && (
              <div className="surface-card" style={{ padding: 'var(--space-6) var(--space-8)' }}>
                <div style={{ marginBottom: 'var(--space-5)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    STEP 2 OF 4
                  </div>
                  <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Reporting Source &amp; Intake Authority
                  </h2>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Specify how this report entered the RECONNECT emergency network to ensure evidentiary chain of custody.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-3)' }}>
                  {sourceOptions.map((opt) => {
                    const isSelected = formData.source === opt.id;
                    const Icon = opt.icon;

                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleInputChange('source', opt.id)}
                        style={{
                          padding: 'var(--space-3) var(--space-4)',
                          border: isSelected ? '2px solid var(--color-crimson)' : '1px solid var(--border-base)',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: isSelected ? 'var(--color-crimson-bg)' : 'var(--bg-surface)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-3)',
                          transition: 'border-color 0.1s ease',
                        }}
                      >
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: isSelected ? 'var(--color-crimson)' : 'var(--bg-app)',
                          color: isSelected ? 'var(--text-inverse)' : 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <Icon size={14} />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: isSelected ? 'var(--color-crimson-text)' : 'var(--text-primary)' }}>
                            {opt.label}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {opt.defaultChannel}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ marginTop: 'var(--space-6)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Intake Station / Field Node
                    </label>
                    <input
                      type="text"
                      value={formData.intakeStation}
                      onChange={(e) => handleInputChange('intakeStation', e.target.value)}
                      placeholder="e.g. Hoshangabad Sector 4 Intake Terminal"
                      style={{ width: '100%', height: '34px', padding: '0 12px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Source Contact / Phone (if follow-up needed)
                    </label>
                    <input
                      type="text"
                      value={formData.sourceContact}
                      onChange={(e) => handleInputChange('sourceContact', e.target.value)}
                      placeholder="e.g. +91 94251 09822 or Desk Extension"
                      style={{ width: '100%', height: '34px', padding: '0 12px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      External Log / Voucher # (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.sourceReferenceNumber}
                      onChange={(e) => handleInputChange('sourceReferenceNumber', e.target.value)}
                      placeholder="e.g. 1070-CALL-89412 or REDCROSS-B2-019"
                      style={{ width: '100%', height: '34px', padding: '0 12px', fontFamily: 'var(--font-mono)' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PERSON DETAILS */}
            {currentStep === 3 && (
              <div className="surface-card" style={{ padding: 'var(--space-6) var(--space-8)' }}>
                <div style={{ marginBottom: 'var(--space-5)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    STEP 3 OF 4
                  </div>
                  <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Person Demographics &amp; Last Known Record
                  </h2>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Enter any known names, approximate age, gender, photographs, and last known location.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
                  {/* Full Name */}
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Full Name (Official / Aadhaar / Gov ID)
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="e.g. Ramesh Chandra Verma"
                      style={{ width: '100%', height: '34px', padding: '0 12px' }}
                    />
                  </div>

                  {/* Name As Reported */}
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Name As Reported (Phonetic spelling, alias or nickname)
                    </label>
                    <input
                      type="text"
                      value={formData.nameAsReported}
                      onChange={(e) => handleInputChange('nameAsReported', e.target.value)}
                      placeholder="e.g. Ramu Kaka / Ramesh Ji"
                      style={{ width: '100%', height: '34px', padding: '0 12px' }}
                    />
                  </div>

                  {/* Age */}
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Age / Approximate Age
                    </label>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        placeholder="e.g. 58"
                        style={{ width: '100px', height: '34px', padding: '0 12px', fontFamily: 'var(--font-mono)' }}
                      />
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                      }}>
                        <input
                          type="checkbox"
                          checked={formData.ageIsApproximate}
                          onChange={(e) => handleInputChange('ageIsApproximate', e.target.checked)}
                        />
                        <span>Approximate / Estimated</span>
                      </label>
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Gender
                    </label>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      {['MALE', 'FEMALE', 'OTHER', 'UNKNOWN'].map((g) => (
                        <button
                          type="button"
                          key={g}
                          onClick={() => handleInputChange('gender', g)}
                          className={`btn ${formData.gender === g ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ height: '34px', fontSize: '11px', flex: 1 }}
                        >
                          <span>{g}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Subject Contact Phone (if possessed)
                    </label>
                    <input
                      type="text"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder="e.g. +91 98260 XXXXX"
                      style={{ width: '100%', height: '34px', padding: '0 12px', fontFamily: 'var(--font-mono)' }}
                    />
                  </div>

                  {/* Date/Time Last Seen */}
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Date / Time Last Seen
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.dateTimeLastSeen}
                      onChange={(e) => handleInputChange('dateTimeLastSeen', e.target.value)}
                      style={{ width: '100%', height: '34px', padding: '0 12px', fontFamily: 'var(--font-mono)' }}
                    />
                  </div>
                </div>

                {/* Last Known Location & Address */}
                <div style={{ marginTop: 'var(--space-4)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Last Known Location (Ghat / Village / Landmark / Sector)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <MapPin size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                      <input
                        type="text"
                        value={formData.lastKnownLocation}
                        onChange={(e) => handleInputChange('lastKnownLocation', e.target.value)}
                        placeholder="e.g. Hoshangabad Sethani Ghat Sector 4, near water pumping station"
                        style={{ width: '100%', height: '34px', paddingLeft: '32px', paddingRight: '12px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Permanent Home Address / Village
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="e.g. Ward No. 12, Pipariya Road, Dist. Hoshangabad, MP"
                      style={{ width: '100%', height: '34px', padding: '0 12px' }}
                    />
                  </div>
                </div>

                {/* Photograph Upload Area */}
                <div style={{ marginTop: 'var(--space-5)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)' }}>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Photograph / Reference Image
                  </label>
                  <div
                    style={{
                      border: '1px dashed var(--border-strong)',
                      borderRadius: 'var(--radius-sm)',
                      padding: 'var(--space-5)',
                      backgroundColor: 'var(--bg-app)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      textAlign: 'center',
                      gap: 'var(--space-2)',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUploadSim}
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer',
                      }}
                    />
                    <Upload size={20} color="var(--text-secondary)" />
                    {formData.photoFileName ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-forest-text)', fontWeight: 600 }}>
                          ATTACHED: {formData.photoFileName}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInputChange('photoFileName', '');
                          }}
                          className="btn btn-ghost"
                          style={{ padding: '2px 4px', height: '22px' }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 500 }}>
                          Drop photograph here, or click to browse field snapshot
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          JPEG, PNG, WEBP (Max 15MB). Biometric facial indices are auto-extracted on ingest.
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: IDENTIFICATION & NARRATIVE */}
            {currentStep === 4 && (
              <div className="surface-card" style={{ padding: 'var(--space-6) var(--space-8)' }}>
                <div style={{ marginBottom: 'var(--space-5)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    STEP 4 OF 4
                  </div>
                  <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Physical Identification &amp; Natural-Language Narrative
                  </h2>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Describe distinguishing physical characteristics, clothing worn during displacement, and any free-form context.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
                  {/* Height */}
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Height (cm or ft/in)
                    </label>
                    <input
                      type="text"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                      placeholder="e.g. 5 ft 8 in (approx 172 cm)"
                      style={{ width: '100%', height: '34px', padding: '0 12px' }}
                    />
                  </div>

                  {/* Build */}
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Physical Build
                    </label>
                    <input
                      type="text"
                      value={formData.build}
                      onChange={(e) => handleInputChange('build', e.target.value)}
                      placeholder="e.g. Slim, Average, Heavy, Frail, Athletic"
                      style={{ width: '100%', height: '34px', padding: '0 12px' }}
                    />
                  </div>

                  {/* Clothing */}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Clothing Description (Color, garment type, footwear)
                    </label>
                    <input
                      type="text"
                      value={formData.clothing}
                      onChange={(e) => handleInputChange('clothing', e.target.value)}
                      placeholder="e.g. White kurta with blue border, brown slippers, wearing rudraksha mala around neck"
                      style={{ width: '100%', height: '34px', padding: '0 12px' }}
                    />
                  </div>

                  {/* Body Marks */}
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Birthmark / Visible Body Marks (Scars, tattoos, moles)
                    </label>
                    <input
                      type="text"
                      value={formData.bodyMarks}
                      onChange={(e) => handleInputChange('bodyMarks', e.target.value)}
                      placeholder="e.g. Burn scar on left forearm, mole near right temple"
                      style={{ width: '100%', height: '34px', padding: '0 12px' }}
                    />
                  </div>

                  {/* Other Characteristics */}
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Other Identifying Characteristics (Medical, language, spectacles)
                    </label>
                    <input
                      type="text"
                      value={formData.otherCharacteristics}
                      onChange={(e) => handleInputChange('otherCharacteristics', e.target.value)}
                      placeholder="e.g. Diabetic needing insulin, speaks Bundeli/Hindi, walks with wooden cane"
                      style={{ width: '100%', height: '34px', padding: '0 12px' }}
                    />
                  </div>
                </div>

                {/* Optional Natural Language Narrative */}
                <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Describe in your own words (Optional narrative)
                    </label>
                    <Badge variant="default">NATURAL LANGUAGE INGEST</Badge>
                  </div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
                    Free-form description provided by the reporting family member, helpline caller, or volunteer.
                  </p>
                  <textarea
                    rows={4}
                    value={formData.narrativeDescription}
                    onChange={(e) => handleInputChange('narrativeDescription', e.target.value)}
                    placeholder="e.g. He was last seen trying to move the cattle to higher ground near the old temple when the Narmada river overflowed around 2:00 PM. A neighbor saw him boarding an evacuation tractor towards the Sehore bypass..."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: 'var(--text-sm)',
                      lineHeight: 'var(--leading-normal)',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Navigation & Submission Controls */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-4) 0',
            }}>
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="btn btn-secondary"
                    style={{ height: '38px', padding: '0 16px' }}
                  >
                    <ArrowLeft size={14} />
                    <span>Back to Step 0{currentStep - 1}</span>
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <button
                  type="button"
                  onClick={() => navigate('/overview')}
                  className="btn btn-ghost"
                  style={{ height: '38px' }}
                >
                  <span>Cancel</span>
                </button>

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    className="btn btn-secondary"
                    style={{ height: '38px', padding: '0 20px', fontWeight: 600 }}
                  >
                    <span>Proceed to Step 0{currentStep + 1}</span>
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-danger"
                    style={{
                      height: '40px',
                      padding: '0 24px',
                      fontWeight: 600,
                      backgroundColor: 'var(--color-crimson)',
                      borderColor: 'var(--color-crimson)',
                    }}
                  >
                    {isSubmitting ? (
                      <span>Registering Intake Record...</span>
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        <span>Submit Intake Report</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddReportPage;
