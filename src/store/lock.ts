import { createWithEqualityFn } from "zustand/traditional"

interface lock{
    olyBalance:number,
    olyPrice:number,
}

export const useLockStore = createWithEqualityFn<lock>()(()=>({
    olyBalance:0,
    olyPrice:0,
}))