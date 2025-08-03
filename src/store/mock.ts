import { createWithEqualityFn } from "zustand/traditional"

interface MockStore {
  amount?: number
  duration?: number
}

export const useMockStore = createWithEqualityFn<MockStore>()((set) => ({}))
