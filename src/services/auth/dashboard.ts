import { publicFetch } from '../index';
import { formatTimeToLocal, getWeekday } from '~/lib/utils';

interface responseItem {
  amount: number;
  createdAt: string;
  week: string;
  tokenTotalSupply: number;
  tokenPrice: number;
  treasuryMarketCap: number;
  lpMarketCap: number;
  longStakedAmount: number;
  flexibleStakedAmount: number;
  lpBondMarketCap: number;
  liquidityBondMarketCap: number;
  stableBondMarketCap: number;
}
export interface airItem {
  amount: string;
  week: string;
  createdAt: string;
}
//仪表盘
export const dashMess = async (startTime: string, endTime: string) => {
  const parmas = {
    startTime: startTime,
    endTime: endTime,
  };
  const response = await publicFetch('/api/dashboard/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parmas),
  });

  if (response.ok) {
    const data = await response.json();
    const marketList: airItem[] = []; //市值
    const supplyList: airItem[] = []; //币的供应量值
    const priceList: airItem[] = []; //价格
    const treasuryList: airItem[] = []; //国库
    // let lpList = [];//lp
    const depositList: airItem[] = []; //质押
    const lpBondMarketCapList: airItem[] = []; //流动债券

    if (data.data.records.length) {
      const list = data.data.records;
      list.map((it: responseItem) => {
        const value = (
          Number(it.tokenTotalSupply) * Number(it.tokenPrice)
        ).toFixed(4);
        marketList.push({
          amount: value,
          week: getWeekday(it.createdAt),
          createdAt: formatTimeToLocal(it.createdAt),
        });
        supplyList.push({
          amount: Number(it.tokenTotalSupply).toFixed(4),
          week: getWeekday(it.createdAt),
          createdAt: formatTimeToLocal(it.createdAt),
        });
        priceList.push({
          amount: Number(it.tokenPrice).toFixed(4),
          week: getWeekday(it.createdAt),
          createdAt: formatTimeToLocal(it.createdAt),
        });
        // lpList.push(
        //     {
        //         amount:Number(it.lpMarketCap).toFixed(4)
        //     }
        // );
        treasuryList.push({
          amount: Number(it.stableBondMarketCap).toFixed(4),
          week: getWeekday(it.createdAt),
          createdAt: formatTimeToLocal(it.createdAt),
        });
        const depositNum = (
          Number(it.longStakedAmount) + Number(it.flexibleStakedAmount)
        ).toFixed(4);
        depositList.push({
          amount: depositNum,
          week: getWeekday(it.createdAt),
          createdAt: formatTimeToLocal(it.createdAt),
        });

        lpBondMarketCapList.push({
          amount: Number(it.liquidityBondMarketCap).toFixed(4),
          week: getWeekday(it.createdAt),
          createdAt: formatTimeToLocal(it.createdAt),
        });
      });
      console.log(priceList);
      return {
        marketList,
        supplyList,
        priceList,
        depositList,
        treasuryList,
        lpBondMarketCapList,
      };
    }
    return null;
  }
  return null;
};
