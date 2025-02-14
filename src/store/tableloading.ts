// store.ts
import { create } from 'zustand';

interface LoadingtableStore {
  loading: boolean;
  setLoading: (loading: boolean) => void; // Change parameter type to boolean
  clearLoading: () => void;
}

const loadingtableStore = create<LoadingtableStore>((set) => ({
  loading: false,
  setLoading: (loading: boolean) => set({ loading }), // Accepts boolean
  clearLoading: () => set({ loading: false }),
}));

export default loadingtableStore;