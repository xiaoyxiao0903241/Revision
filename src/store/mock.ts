import { createWithEqualityFn } from "zustand/traditional"

interface MockStore {
  amount?: number
  duration?: number
  decimal?: string
}

export const useMockStore = createWithEqualityFn<MockStore>()(() => ({}))
