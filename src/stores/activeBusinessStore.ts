import { BusinessType } from "@/interfaces/BusinessType";
import { create } from "zustand";

export interface ActiveBusinessStore {
  activeBusiness: BusinessType | null;
  businessId: string | null;
  setBusinessId: (id: string, business: BusinessType) => void;
  reset: () => void;
}

export const useActiveBusinessStore = create<ActiveBusinessStore>((set) => ({
  activeBusiness: null,
  businessId: null,
  setBusinessId: (id, business) =>
    set({ businessId: id, activeBusiness: business }),
  reset: () => set({ businessId: null, activeBusiness: null }),
}));
