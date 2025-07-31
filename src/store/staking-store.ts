import { create } from "zustand"

interface StakingState {
  stakedAmount: number
  availableToStake: number
  apr: number
  rebaseRewards: number
  rebaseRewardRate: string
  rebaseBoost: string
  nextRebaseRewardRate: string
  countdownToNextRebase: string
  totalStaked: number
  stakers: number
  marketCap: number
  setStakedAmount: (amount: number) => void
  setAvailableToStake: (amount: number) => void
  setApr: (apr: number) => void
  setRebaseRewards: (amount: number) => void
  setRebaseRewardRate: (rate: string) => void
  setRebaseBoost: (boost: string) => void
  setNextRebaseRewardRate: (rate: string) => void
  setCountdownToNextRebase: (countdown: string) => void
  setTotalStaked: (amount: number) => void
  setStakers: (count: number) => void
  setMarketCap: (cap: number) => void
}

export const useStakingStore = create<StakingState>((set) => ({
  stakedAmount: 0,
  availableToStake: 0,
  apr: 3139.23,
  rebaseRewards: 0,
  rebaseRewardRate: "0.3%-1%",
  rebaseBoost: "0.3%-1%",
  nextRebaseRewardRate: "0.38%",
  countdownToNextRebase: "3h 59m 46s",
  totalStaked: 3069552.45,
  stakers: 356,
  marketCap: 12634715,
  setStakedAmount: (amount) => set({ stakedAmount: amount }),
  setAvailableToStake: (amount) => set({ availableToStake: amount }),
  setApr: (apr) => set({ apr }),
  setRebaseRewards: (amount) => set({ rebaseRewards: amount }),
  setRebaseRewardRate: (rate) => set({ rebaseRewardRate: rate }),
  setRebaseBoost: (boost) => set({ rebaseBoost: boost }),
  setNextRebaseRewardRate: (rate) => set({ nextRebaseRewardRate: rate }),
  setCountdownToNextRebase: (countdown) =>
    set({ countdownToNextRebase: countdown }),
  setTotalStaked: (amount) => set({ totalStaked: amount }),
  setStakers: (count) => set({ stakers: count }),
  setMarketCap: (cap) => set({ marketCap: cap }),
}))
