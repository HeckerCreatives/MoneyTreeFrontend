// store.ts
import { create } from 'zustand';

interface PageStateStore {
  page: string ;
  setPage: (id: string) => void; 
  clearPage: () => void;
}

const pageStore = create<PageStateStore>((set) => ({
  page: 'Dashboard', 
  setPage: (id: string) => set({ page: id }), 
  clearPage: () => set({ page: '' }),
}));

export default pageStore;