import React, { createContext, useContext, useState, useEffect } from 'react';

export type IncidentCaseStatus = 
  | 'LOOKING FOR A MATCH' 
  | 'AWAITING VERIFICATION' 
  | 'VERIFIED MATCH' 
  | 'FAMILY NOTIFIED';

export interface VerifiedCandidateInfo {
  id: string;
  name: string;
  ref: string;
  confidence: number;
  location: string;
  distance: string;
  evidence: string;
  verifiedBy: string;
  verifiedAt: string;
  notes: string;
}

export interface CaseContextType {
  // Case MP-2026-00421 State
  caseId: string;
  personName: string;
  caseStatus: IncidentCaseStatus;
  priority: 'CRITICAL' | 'HIGH' | 'ROUTINE';
  verifiedCandidate: VerifiedCandidateInfo | null;
  duplicatesMerged: boolean;
  canonicalId: string;
  verificationNotes: string;
  
  // Actions
  verifyMatch: (candidateId: string, officer: string, notes: string) => void;
  rejectMatch: (candidateId: string, notes: string) => void;
  mergeDuplicates: (canonicalId: string, notes: string) => void;
  setPriority: (p: 'CRITICAL' | 'HIGH' | 'ROUTINE') => void;
  resetDemoData: () => void;

  // Demo Workflow Stepper
  demoStep: number;
  setDemoStep: (step: number) => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
}

const STORAGE_KEY = 'reconnect_case_state_v1';

const defaultState = {
  caseId: 'MP-2026-00421',
  personName: 'Rahul Agrawal',
  caseStatus: 'LOOKING FOR A MATCH' as IncidentCaseStatus,
  priority: 'HIGH' as const,
  verifiedCandidate: null as VerifiedCandidateInfo | null,
  duplicatesMerged: false,
  canonicalId: 'MP-2026-00421',
  verificationNotes: '',
  demoStep: 1,
};

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export const CaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [caseId] = useState<string>(defaultState.caseId);
  const [personName] = useState<string>(defaultState.personName);
  const [caseStatus, setCaseStatus] = useState<IncidentCaseStatus>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.caseStatus || defaultState.caseStatus;
      } catch {
        return defaultState.caseStatus;
      }
    }
    return defaultState.caseStatus;
  });

  const [priority, setPriority] = useState<'CRITICAL' | 'HIGH' | 'ROUTINE'>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.priority || defaultState.priority;
      } catch {
        return defaultState.priority;
      }
    }
    return defaultState.priority;
  });

  const [verifiedCandidate, setVerifiedCandidate] = useState<VerifiedCandidateInfo | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.verifiedCandidate || null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [duplicatesMerged, setDuplicatesMerged] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Boolean(parsed.duplicatesMerged);
      } catch {
        return false;
      }
    }
    return false;
  });

  const [canonicalId, setCanonicalId] = useState<string>(defaultState.canonicalId);
  const [verificationNotes, setVerificationNotes] = useState<string>('');
  const [demoStep, setDemoStepState] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return typeof parsed.demoStep === 'number' ? parsed.demoStep : 1;
      } catch {
        return 1;
      }
    }
    return 1;
  });

  // Save to localStorage on change
  useEffect(() => {
    const dataToSave = {
      caseStatus,
      priority,
      verifiedCandidate,
      duplicatesMerged,
      demoStep,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [caseStatus, priority, verifiedCandidate, duplicatesMerged, demoStep]);

  const verifyMatch = (candidateId: string, officer: string, notes: string) => {
    setCaseStatus('VERIFIED MATCH');
    setVerifiedCandidate({
      id: candidateId,
      name: 'Rahul Agarwal',
      ref: 'FND-2026-01892',
      confidence: 94,
      location: 'Disaster Relief Camp Ward 6, Polytechnic Campus',
      distance: '3.2 km',
      evidence: 'Facial recognition 96%, age (24), matching right chin scar (~2cm) & navy blue polo shirt confirmed by on-site nurse.',
      verifiedBy: officer || 'DISP-884 (Certified Dispatcher)',
      verifiedAt: '11 Sep 2026, 15:48 LOC',
      notes: notes || 'Sworn physical verification: Biometrics, healed chin scar, and clothing match intake report.',
    });
    setVerificationNotes(notes);
  };

  const rejectMatch = (_candidateId: string, notes: string) => {
    setVerificationNotes(`Rejected: ${notes}`);
  };

  const mergeDuplicates = (canonical: string, notes: string) => {
    setDuplicatesMerged(true);
    setCanonicalId(canonical);
    setVerificationNotes(notes);
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCaseStatus(defaultState.caseStatus);
    setPriority(defaultState.priority);
    setVerifiedCandidate(null);
    setDuplicatesMerged(false);
    setCanonicalId(defaultState.canonicalId);
    setVerificationNotes('');
    setDemoStepState(1);
  };

  const setDemoStep = (step: number) => {
    setDemoStepState(Math.max(1, Math.min(10, step)));
  };

  const nextDemoStep = () => {
    setDemoStepState((prev) => Math.min(10, prev + 1));
  };

  const prevDemoStep = () => {
    setDemoStepState((prev) => Math.max(1, prev - 1));
  };

  return (
    <CaseContext.Provider
      value={{
        caseId,
        personName,
        caseStatus,
        priority,
        verifiedCandidate,
        duplicatesMerged,
        canonicalId,
        verificationNotes,
        verifyMatch,
        rejectMatch,
        mergeDuplicates,
        setPriority,
        resetDemoData,
        demoStep,
        setDemoStep,
        nextDemoStep,
        prevDemoStep,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
};

export const useCaseContext = () => {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error('useCaseContext must be used within a CaseProvider');
  }
  return context;
};
