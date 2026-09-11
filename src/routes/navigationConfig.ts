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
  Share2,
  MapPin,
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
    title: 'Operations',
    items: [
      {
        id: 'overview',
        label: 'Overview',
        path: '/overview',
        icon: LayoutDashboard,
        shortcut: '1',
        description: 'Dashboard & summary',
      },
      {
        id: 'live-cases',
        label: 'Live Cases',
        path: '/cases',
        icon: Users,
        badge: { text: '42', variant: 'crimson' },
        shortcut: '2',
        description: 'Missing person registry',
      },
      {
        id: 'add-report',
        label: 'Add Report',
        path: '/report/new',
        icon: PlusCircle,
        shortcut: 'N',
        description: 'Intake new report',
      },
      {
        id: 'match-intelligence',
        label: 'Match Intelligence',
        path: '/match-intel',
        icon: GitCompare,
        badge: { text: '7', variant: 'amber' },
        shortcut: '3',
        description: 'Correlation & matches',
      },
      {
        id: 'verification-queue',
        label: 'Verification Queue',
        path: '/verification',
        icon: ClipboardCheck,
        badge: { text: '11', variant: 'amber' },
        shortcut: '4',
        description: 'Review and verify',
      },
      {
        id: 'duplicate-resolution',
        label: 'Duplicates',
        path: '/duplicates',
        icon: CopyCheck,
        badge: { text: '3', variant: 'default' },
        shortcut: '5',
        description: 'Merge duplicate records',
      },
      {
        id: 'community-reports',
        label: 'Community Reports',
        path: '/community-reports',
        icon: MessageSquareWarning,
        badge: { text: '18', variant: 'forest' },
        shortcut: '6',
        description: 'Public tip-lines & field notes',
      },
      {
        id: 'source-network',
        label: 'Source Network',
        path: '/source-network',
        icon: Network,
        shortcut: '7',
        description: 'Hospitals & shelter feeds',
      },
      {
        id: 'analytics',
        label: 'Analytics',
        path: '/analytics',
        icon: BarChart3,
        shortcut: '8',
        description: 'Geospatial & trend metrics',
      },
      {
        id: 'connection-graph',
        label: 'Connection Graph',
        path: '/connection-graph',
        icon: Share2,
        shortcut: '9',
        description: 'Relationship graph',
      },
      {
        id: 'geospatial-map',
        label: 'Incident Map',
        path: '/incident-map',
        icon: MapPin,
        badge: { text: 'Live', variant: 'forest' },
        shortcut: 'M',
        description: 'Geospatial incident map',
      },
    ],
  },
  {
    title: 'System',
    items: [
      {
        id: 'audit-trail',
        label: 'Audit Trail',
        path: '/audit',
        icon: ScrollText,
        description: 'Activity & change log',
      },
      {
        id: 'privacy-access',
        label: 'Privacy & Access',
        path: '/privacy',
        icon: ShieldCheck,
        description: 'Permissions & roles',
      },
      {
        id: 'settings',
        label: 'Settings',
        path: '/settings',
        icon: Sliders,
        description: 'Preferences & notifications',
      },
    ],
  },
];
