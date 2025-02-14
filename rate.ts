// store.ts
import { create } from 'zustand';

interface RateStoreState {
  rate: number;
  setRate: (id: number) => void; 
  clearRate: () => void;
}

const rateStore = create<RateStoreState>((set) => ({
  rate: 0, 
  setRate: (id: number) => set({ rate: id }), 
  clearRate: () => set({ rate: 0 }),
}));

export default rateStore;