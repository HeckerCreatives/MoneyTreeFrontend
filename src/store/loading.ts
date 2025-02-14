// store.ts
import { create } from 'zustand';

interface LoadingStoreState {
  loading: boolean;
  setLoading: (loading: boolean) => void; // Change parameter type to boolean
  clearLoading: () => void;
}

const loadingStore = create<LoadingStoreState>((set) => ({
  loading: false,
  setLoading: (loading: boolean) => set({ loading }), // Accepts boolean
  clearLoading: () => set({ loading: false }),
}));

export default loadingStore;