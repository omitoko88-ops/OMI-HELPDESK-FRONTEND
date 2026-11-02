import { useState } from 'react';
import { COLLABORATORS } from '../../data/collaborators';
import type { MemberRole } from '../../types';

/**
 * Scrollable list of people with access.
 * The owner gets a static badge; everyone else gets an editable role select.
 */
export function CollaboratorList() {
  // Local copy of each person's role so the selects stay interactive.
  // Replace with a real mutation / API call when connecting a backend.
  const [roles, setRoles] = useState<Record<string, MemberRole>>(() =>
    Object.fromEntries(COLLABORATORS.map((c) => [c.username, c.role])),
  );

  return (
    <div>
      <div className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-2 flex justify-between">
        <span>Workspace Collaborators Access</span>
        <span className="text-geek-accent">4 Users Active</span>
      </div>

      <div className="space-y-2 max-h-40 overflow-y-auto">
        {COLLABORATORS.map((person) => (
          <div
            key={person.username}
            className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100"
          >
            <div className="flex items-center gap-2">
              <img className="w-6 h-6 rounded-full" src={person.avatarUrl} alt={`${person.username} avatar`} />
              <div>
                <div className="font-bold text-slate-800">{person.username}</div>
                <div className="text-[10px] text-slate-400">{person.subtitle}</div>
              </div>
            </div>

            {person.role === 'owner' ? (
              <span className="text-[11px] font-bold text-geek-secondary bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                Owner
              </span>
            ) : (
              <select
                value={roles[person.username]}
                onChange={(event) =>
                  setRoles((prev) => ({ ...prev, [person.username]: event.target.value as MemberRole }))
                }
                className="bg-white border border-slate-300 rounded px-2 py-0.5 text-[11px] font-bold text-slate-700"
              >
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
