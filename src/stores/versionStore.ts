import { create } from "zustand";

export interface VersionStore {
  version: string | null;
  setVersion: (version: string) => void;
}

export const useActiveVersion = create<VersionStore>((set) => ({
  version: null,
  setVersion: (v) => set({ version: v }),
}));
