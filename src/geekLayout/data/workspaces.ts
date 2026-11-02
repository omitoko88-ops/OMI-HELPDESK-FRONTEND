import type { Workspace } from '../types';

/** Initial list of workspaces shown in the header dropdown. */
export const INITIAL_WORKSPACES: Workspace[] = [
  {
    id: 'quantum-lab',
    name: 'Quantum Lab',
    label: 'Quantum Lab (Team)',
    icon: 'users',
    iconClass: 'text-geek-secondary',
    badge: '4 members',
    badgeClass: 'bg-indigo-100 text-indigo-700',
  },
  {
    id: 'personal-vault',
    name: 'Personal Vault',
    label: 'Personal Vault',
    icon: 'user',
    iconClass: 'text-geek-cyan',
    badge: '1 user',
    badgeClass: 'bg-slate-100 text-slate-600',
  },
  {
    id: 'api-docs-portal',
    name: 'API Docs Portal',
    label: 'API Docs Portal',
    icon: 'network-wired',
    iconClass: 'text-geek-accent',
    badge: '12 members',
    badgeClass: 'bg-emerald-100 text-emerald-700',
  },
];
