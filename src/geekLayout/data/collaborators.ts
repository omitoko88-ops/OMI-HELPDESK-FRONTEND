import type { Collaborator } from '../types';
import { avatarUrl } from '../utils/avatars';

/** People listed inside the Share modal. */
export const COLLABORATORS: Collaborator[] = [
  {
    username: 'neo_dev (You)',
    subtitle: 'Workspace Admin',
    avatarUrl: avatarUrl('neo', 64),
    role: 'owner',
  },
  {
    username: 'alex_frontend',
    subtitle: 'alex@devdocs.io',
    avatarUrl: avatarUrl('alex', 64),
    role: 'editor',
  },
];
