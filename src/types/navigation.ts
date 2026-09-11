
export interface NavItem {
  id: string;
  label: string;
  path: string;
  iconName: string;
  badge?: {
    text: string;
    variant: 'default' | 'forest' | 'amber' | 'crimson';
  };
  description?: string;
  shortcut?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface IncidentContext {
  id: string;
  code: string;
  name: string;
  type: string;
  status: 'ACTIVE' | 'STANDBY' | 'RESOLVED';
  severity: 'LEVEL 1' | 'LEVEL 2' | 'LEVEL 3' | 'CRITICAL';
  location: string;
  activeSince: string;
  activeCasesCount: number;
  cadSyncStatus: 'LIVE' | 'DEGRADED' | 'OFFLINE';
}
