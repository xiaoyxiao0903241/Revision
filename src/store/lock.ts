import { createWithEqualityFn } from 'zustand/traditional';

interface lock {
  olyBalance: number;
  olyPrice: number;
  AllolyStakeNum: number;
}

export const useLockStore = createWithEqualityFn<lock>()(() => ({
  olyBalance: 0,
  olyPrice: 0,
  AllolyStakeNum: 0,
}));
