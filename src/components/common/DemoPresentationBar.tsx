import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCaseContext } from '../../context/CaseContext';
import { 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Minimize2, 
  Maximize2 
} from 'lucide-react';

interface DemoStepConfig {
  step: number;
  title: string;
  route: string;
  guidance: string;
  actionHint: string;
}

export const DEMO_STEPS: DemoStepConfig[] = [
  {
    step: 1,
    title: 'Incident Overview',
    route: '/overview',
    guidance: 'Situational command center for Central India Flood Response.',
    actionHint: 'Click "Rahul Agrawal (MP-2026-00421)" in the Verification Queue or Active Cases.',
  },
  {
    step: 2,
    title: 'Missing Case Dossier',
    route: '/cases/MP-2026-00421',
    guidance: 'Complete operational case file for Rahul Agrawal (24 M), last seen at Relief Zone B.',
    actionHint: 'Click "VIEW POTENTIAL MATCHES" or inspect Candidate #1 (Rahul Agarwal 94%).',
  },
  {
    step: 3,
    title: 'Match Intelligence',
    route: '/match-intel',
    guidance: 'Algorithmic multi-candidate correlation with "WHY THIS MATCH?" physical evidence.',
    actionHint: 'Inspect Rahul Agarwal (94%) evidence, then click "PROCEED TO VERIFICATION QUEUE".',
  },
  {
    step: 4,
    title: 'Verification Queue',
    route: '/verification',
    guidance: 'Human verification triage queue for authorized emergency dispatch officers.',
    actionHint: 'Select Case MP-2026-00421 (Rahul Agrawal vs Rahul Agarwal).',
  },
  {
    step: 5,
    title: 'Review Matching Evidence',
    route: '/verification',
    guidance: 'Side-by-side evidence review: 3.2km distance, chin scar (~2cm), clothing, and timeline.',
    actionHint: 'Corroborate matching identifiers against conflicting triage notes.',
  },
  {
    step: 6,
    title: 'Verify Correct Match',
    route: '/verification',
    guidance: 'Confirm sworn identity match without automated black-box execution.',
    actionHint: 'Click "VERIFY MATCH" and submit sworn verification statement.',
  },
  {
    step: 7,
    title: 'Updated Case Status',
    route: '/cases/MP-2026-00421',
    guidance: 'Status reflects "VERIFIED MATCH" across the CAD system with linked candidate.',
    actionHint: 'Notice updated status badge, linked candidate banner, and updated timeline.',
  },
  {
    step: 8,
    title: 'Consolidate Duplicates',
    route: '/duplicates',
    guidance: 'Entity disambiguation for 3 overlapping reports without deleting original records.',
    actionHint: 'Click "MERGE REPORTS" and confirm non-destructive consolidation.',
  },
  {
    step: 9,
    title: 'Family Status View',
    route: '/status',
    guidance: 'Calm, respectful family portal with clear vertical progress timeline.',
    actionHint: 'Enter or view Case MP-2026-00421.',
  },
  {
    step: 10,
    title: 'Verified Family Result',
    route: '/status',
    guidance: 'Portal shows verified match result with direct liaison notification guidance.',
    actionHint: 'Demo complete! Shows trusted end-to-end disaster reunification.',
  },
];

export const DemoPresentationBar: React.FC = () => {
  const navigate = useNavigate();
  const { demoStep, setDemoStep, duplicatesMerged, resetDemoData } = useCaseContext();
  const [minimized, setMinimized] = useState<boolean>(false);

  const current = DEMO_STEPS.find((s) => s.step === demoStep) || DEMO_STEPS[0];

  const handleStepJump = (targetStep: number) => {
    setDemoStep(targetStep);
    const targetConfig = DEMO_STEPS.find((s) => s.step === targetStep);
    if (targetConfig) {
      navigate(targetConfig.route);
    }
  };

  const handleNext = () => {
    if (demoStep < 10) {
      handleStepJump(demoStep + 1);
    }
  };

  const handlePrev = () => {
    if (demoStep > 1) {
      handleStepJump(demoStep - 1);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'rgba(18, 20, 23, 0.65)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        color: 'var(--text-inverse)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
        padding: minimized ? '6px 16px' : '8px 16px',
        fontSize: '12px',
        fontFamily: 'var(--font-sans)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
        transition: 'padding 0.15s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        {/* Left: Indicator & Step Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontWeight: 600, fontSize: '13px', color: '#ffffff' }}>
              {current.title}
            </span>
            {!minimized && (
              <span style={{ color: 'var(--text-disabled)', fontSize: '12px' }}>
                — {current.guidance}
              </span>
            )}
          </div>
        </div>

        {/* Center/Right: Action hint & status pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Live Status Indicators */}
          {duplicatesMerged && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'var(--color-forest)',
                  color: '#ffffff',
                }}
              >
                ✓ DEDUP MERGED
              </span>
            </div>
          )}

          {/* Stepper Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={handlePrev}
              disabled={demoStep <= 1}
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: demoStep <= 1 ? 'rgba(255,255,255,0.3)' : '#ffffff',
                borderRadius: 'var(--radius-xs)',
                padding: '3px 8px',
                cursor: demoStep <= 1 ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                fontSize: '11px',
              }}
              title="Previous Demo Step"
            >
              <ChevronLeft size={12} />
              Prev
            </button>

            <select
              value={demoStep}
              onChange={(e) => handleStepJump(Number(e.target.value))}
              style={{
                backgroundColor: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#ffffff',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-xs)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {DEMO_STEPS.map((s) => (
                <option key={s.step} value={s.step} style={{ backgroundColor: '#121417', color: '#ffffff' }}>
                  Step {s.step}: {s.title}
                </option>
              ))}
            </select>

            <button
              onClick={handleNext}
              disabled={demoStep >= 10}
              style={{
                backgroundColor: demoStep >= 10 ? 'rgba(255,255,255,0.1)' : 'var(--color-forest)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: demoStep >= 10 ? 'rgba(255,255,255,0.3)' : '#ffffff',
                borderRadius: 'var(--radius-xs)',
                padding: '3px 8px',
                cursor: demoStep >= 10 ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                fontSize: '11px',
                fontWeight: 600,
              }}
              title="Next Demo Step"
            >
              Next
              <ChevronRight size={12} />
            </button>

            <button
              onClick={resetDemoData}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'var(--text-disabled)',
                borderRadius: 'var(--radius-xs)',
                padding: '3px 6px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                marginLeft: '4px',
              }}
              title="Reset Demo to Initial Unverified State"
            >
              <RotateCcw size={10} />
              Reset
            </button>

            <button
              onClick={() => setMinimized(!minimized)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--text-disabled)',
                padding: '3px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                marginLeft: '2px',
              }}
              title={minimized ? 'Expand Demo Bar' : 'Minimize Demo Bar'}
            >
              {minimized ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
