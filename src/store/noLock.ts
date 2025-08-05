import { createWithEqualityFn } from "zustand/traditional"

export interface listItem{
    name:string,
    age:number,
    currentBlock:number,
    nextBlock:number,
    olyBalance:number
}

interface Nolock {
 list:listItem[],
 time:string,
 lastStakeTimestamp:number,
 currentBlock:number,
 nextBlock:number,
 olyBalance:number,
 olyPrice:number,
 allnetReabalseNum:number,
 AllolyStakeNum:number,
 hotDataStakeNum:number,
 demandProfitInfo:{
    rebalseProfit:number,
    normalProfit:number,
    allProfit:number,
    isClaim:boolean
 },
 afterHotData:{
    principal:number
 }
}

export const useNolockStore = createWithEqualityFn<Nolock>()(() => (
    {
    list:[],
    time:"",
    lastStakeTimestamp:0,
    nextBlock:0,
    currentBlock:0,
    olyBalance:0,
    olyPrice:0,
    allnetReabalseNum:0,
    AllolyStakeNum:0,
    hotDataStakeNum:0,
    demandProfitInfo:{
        normalProfit:0,
        allProfit:0,
        rebalseProfit:0,
        isClaim:false
     },
     afterHotData:{
        principal:0
     }
}))
