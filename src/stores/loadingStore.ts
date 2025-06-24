import { create } from "zustand";

interface LoadingStore {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  withLoading: <T>(promiseFn: () => Promise<T>) => Promise<T>;
}

export const useLoadingStore = create<LoadingStore>((set) => ({
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),

  withLoading: async (promiseFn) => {
    set({ isLoading: true });
    try {
      const result = await promiseFn();
      return result;
    } finally {
      set({ isLoading: false });
    }
  },
}));
