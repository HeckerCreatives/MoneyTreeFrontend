// store.ts
import { create } from 'zustand';

interface RefreshStoreState {
  refresh: string | null;
  setRefresh: (id: string) => void; 
  clearRefresh: () => void;
}

const refreshStore = create<RefreshStoreState>((set) => ({
  refresh: null, 
  setRefresh: (id: string) => set({ refresh: id }), 
  clearRefresh: () => set({ refresh: null }),
}));

export default refreshStore;