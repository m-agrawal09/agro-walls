export interface CaseData {
  _id?: string;
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
  status: 'LOOKING FOR A MATCH' | 'AWAITING VERIFICATION' | 'VERIFIED MATCH' | 'FAMILY NOTIFIED' | 'RESOLVED';
  isMinor?: boolean;
  hasPhoto: boolean;
  photoUrl?: string;
  keyMarks: string;
  clothing?: string;
  height?: string;
  build?: string;
  reporterContact?: string;
  verifiedCandidate?: any;
  duplicatesMerged?: boolean;
  canonicalId?: string;
  verificationNotes?: string;
  timeline?: any[];
}

const API_BASE = '/api';

export const api = {
  // Health
  async checkHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  // Image Upload (Cloudinary)
  async uploadImage(file: File): Promise<{ url: string; publicId: string; filename: string }> {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Image upload failed');
    return res.json();
  },

  // Cases
  async getCases(params?: { search?: string; priority?: string; status?: string; isMinor?: boolean }): Promise<CaseData[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.priority && params.priority !== 'All') query.append('priority', params.priority);
    if (params?.status && params.status !== 'All') query.append('status', params.status);
    if (params?.isMinor) query.append('isMinor', 'true');

    const res = await fetch(`${API_BASE}/cases?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch cases');
    return res.json();
  },

  async getCaseById(caseId: string): Promise<CaseData> {
    const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}`);
    if (!res.ok) throw new Error('Case not found');
    return res.json();
  },

  async createCase(caseData: Partial<CaseData>): Promise<CaseData> {
    const res = await fetch(`${API_BASE}/cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caseData),
    });
    if (!res.ok) throw new Error('Failed to create case');
    return res.json();
  },

  async verifyCase(caseId: string, payload: { candidateId?: string; officer?: string; notes?: string }) {
    const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}/verify`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to verify case');
    return res.json();
  },

  async rejectCase(caseId: string, payload: { notes: string }) {
    const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}/reject`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to reject match');
    return res.json();
  },

  async mergeDuplicates(caseId: string, payload: { canonicalId: string; notes: string }) {
    const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}/merge`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to merge duplicates');
    return res.json();
  },

  async setPriority(caseId: string, priority: 'CRITICAL' | 'HIGH' | 'ROUTINE') {
    const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}/priority`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priority }),
    });
    if (!res.ok) throw new Error('Failed to update priority');
    return res.json();
  },

  async resetDemoCase() {
    const res = await fetch(`${API_BASE}/cases/reset-demo`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset demo data');
    return res.json();
  },

  // Reports
  async getReports(params?: { type?: string; status?: string }) {
    const query = new URLSearchParams();
    if (params?.type) query.append('type', params.type);
    if (params?.status) query.append('status', params.status);
    const res = await fetch(`${API_BASE}/reports?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch reports');
    return res.json();
  },

  async submitReport(data: any) {
    const res = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit report');
    return res.json();
  },

  // Community Reports
  async getCommunityReports(tab?: string) {
    const query = tab && tab !== 'All' ? `?tab=${encodeURIComponent(tab)}` : '';
    const res = await fetch(`${API_BASE}/community-reports${query}`);
    if (!res.ok) throw new Error('Failed to fetch community reports');
    return res.json();
  },

  async submitCommunityReport(data: any) {
    const res = await fetch(`${API_BASE}/community-reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit tip');
    return res.json();
  },

  async updateCommunityReport(id: string, status: string, tabCategory: string) {
    const res = await fetch(`${API_BASE}/community-reports/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, tabCategory }),
    });
    if (!res.ok) throw new Error('Failed to update community report');
    return res.json();
  },

  // Matches
  async getMatches(caseId?: string) {
    const query = caseId ? `?caseId=${encodeURIComponent(caseId)}` : '';
    const res = await fetch(`${API_BASE}/matches${query}`);
    if (!res.ok) throw new Error('Failed to fetch matches');
    return res.json();
  },

  async verifyMatch(matchId: string, officer?: string, notes?: string) {
    const res = await fetch(`${API_BASE}/matches/${encodeURIComponent(matchId)}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ officer, notes }),
    });
    if (!res.ok) throw new Error('Failed to verify match candidate');
    return res.json();
  },

  // Verification Queue
  async getVerifications() {
    const res = await fetch(`${API_BASE}/verifications`);
    if (!res.ok) throw new Error('Failed to fetch verification queue');
    return res.json();
  },

  async updateVerification(caseId: string, payload: { status: string; assignedOfficer?: string; notes?: string }) {
    const res = await fetch(`${API_BASE}/verifications/${encodeURIComponent(caseId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update verification');
    return res.json();
  },

  // Audit Logs
  async getAuditLogs(limit = 50) {
    const res = await fetch(`${API_BASE}/audit?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return res.json();
  },

  // Analytics & Sources
  async getKPIs() {
    const res = await fetch(`${API_BASE}/stats/kpi`);
    if (!res.ok) throw new Error('Failed to fetch KPIs');
    return res.json();
  },

  async getSourceFeeds() {
    const res = await fetch(`${API_BASE}/stats/sources`);
    if (!res.ok) throw new Error('Failed to fetch source feeds');
    return res.json();
  },

  // Connection Network Graph
  async getNetworkGraph() {
    const res = await fetch(`${API_BASE}/network-graph`);
    if (!res.ok) throw new Error('Failed to fetch network graph');
    return res.json();
  },

  // Bilingual NLP Chatbot Intake (English & Hindi)
  async chatIntake(payload: {
    message: string;
    history?: { role: string; text: string }[];
    currentFields?: any;
    language?: string;
  }) {
    const res = await fetch(`${API_BASE}/chat/intake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to process chat intake');
    return res.json();
  },

  async submitChatReport(payload: { extracted: any; language?: string }) {
    const res = await fetch(`${API_BASE}/chat/submit-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to file report from chatbot');
    return res.json();
  },
};

