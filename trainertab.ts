// store.ts
import { create } from 'zustand';

interface TabStoreState {
  tab: string ;
  setTab: (id: string) => void; 
  clearTab: () => void;
}

const trainertabStore = create<TabStoreState>((set) => ({
  tab: 'Novice', 
  setTab: (id: string) => set({ tab: id }), 
  clearTab: () => set({ tab: 'Novice Trainer' }),
}));

export default trainertabStore;