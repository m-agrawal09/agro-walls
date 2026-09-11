import {
  LayoutDashboard,
  Users,
  PlusCircle,
  GitCompare,
  ClipboardCheck,
  CopyCheck,
  MessageSquareWarning,
  Network,
  BarChart3,
  ScrollText,
  ShieldCheck,
  Sliders,
  LucideIcon
} from 'lucide-react';

export interface NavItemConfig {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: {
    text: string;
    variant: 'default' | 'forest' | 'amber' | 'crimson';
  };
  shortcut?: string;
  description: string;
}

export interface NavSectionConfig {
  title: string;
  items: NavItemConfig[];
}

export const navigationConfig: NavSectionConfig[] = [
  {
    title: 'OPERATIONS',
    items: [
      {
        id: 'overview',
        label: 'Overview',
        path: '/overview',
        icon: LayoutDashboard,
        badge: { text: 'LIVE', variant: 'forest' },
        shortcut: '1',
        description: 'Incident situational awareness & dispatch summary',
      },
      {
        id: 'live-cases',
        label: 'Live Cases',
        path: '/cases',
        icon: Users,
        badge: { text: '42', variant: 'crimson' },
        shortcut: '2',
        description: 'Active missing person tracking & status board',
      },
      {
        id: 'add-report',
        label: 'Add Report',
        path: '/report/new',
        icon: PlusCircle,
        shortcut: 'N',
        description: 'Rapid intake for new missing person or sighting report',
      },
      {
        id: 'match-intelligence',
        label: 'Match Intelligence',
        path: '/match-intel',
        icon: GitCompare,
        badge: { text: '7 NEW', variant: 'amber' },
        shortcut: '3',
        description: 'Automated facial, clothing, and timeline correlation',
      },
      {
        id: 'verification-queue',
        label: 'Verification Queue',
        path: '/verification',
        icon: ClipboardCheck,
        badge: { text: '11', variant: 'amber' },
        shortcut: '4',
        description: 'Triage sightings and verify volunteer submissions',
      },
      {
        id: 'duplicate-resolution',
        label: 'Duplicate Resolution',
        path: '/duplicates',
        icon: CopyCheck,
        badge: { text: '3', variant: 'default' },
        shortcut: '5',
        description: 'Merge multi-source and overlapping intake records',
      },
      {
        id: 'community-reports',
        label: 'Community Reports',
        path: '/community-reports',
        icon: MessageSquareWarning,
        badge: { text: '18', variant: 'forest' },
        shortcut: '6',
        description: 'Public tip-line, SMS hotlines, and shelter submissions',
      },
      {
        id: 'source-network',
        label: 'Source Network',
        path: '/source-network',
        icon: Network,
        badge: { text: '8/8 UP', variant: 'forest' },
        shortcut: '7',
        description: 'Integrations with Hospitals, CAD, Shelters, and SAR Drones',
      },
      {
        id: 'analytics',
        label: 'Analytics',
        path: '/analytics',
        icon: BarChart3,
        shortcut: '8',
        description: 'Disaster zone geospatial density & resolution metrics',
      },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      {
        id: 'audit-trail',
        label: 'Audit Trail',
        path: '/audit',
        icon: ScrollText,
        description: 'Cryptographic ledger of case edits and data disclosures',
      },
      {
        id: 'privacy-access',
        label: 'Privacy & Access',
        path: '/privacy',
        icon: ShieldCheck,
        badge: { text: 'TIER 2', variant: 'default' },
        description: 'CJIS/HIPAA compliant permissions & chain of custody',
      },
      {
        id: 'settings',
        label: 'Settings',
        path: '/settings',
        icon: Sliders,
        description: 'Incident thresholds, notification relays, and API keys',
      },
    ],
  },
];
