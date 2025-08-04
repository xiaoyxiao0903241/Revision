import { createWithEqualityFn } from "zustand/traditional"

interface MockStore {
  amount?: number
  duration?: number
  decimal?: string
  walletConnected?: boolean
}

export const useMockStore = createWithEqualityFn<MockStore>()(() => ({}))
