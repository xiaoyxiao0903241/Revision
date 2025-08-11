import { publicFetch, authFetch } from '../index';
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

//全网总质押人数

export const stakerNum = async () => {
  const response = await publicFetch('/api/dashboard/data/staked', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
    const data = await response.json();
    return data.data;
  }
};

//个人账户全部质押数量
export const personStakeAmount = async (tokenAddress: string) => {
  const response = await authFetch(
    '/api/reward/rebase',
    {
      method: 'GET',
    },
    tokenAddress
  );

  if (response.ok) {
    const data = await response.json();
    return data.data;
  }
};

//个人仪表盘

export const myMess = async (
  startTime: string,
  endTime: string,
  tokenAddress: string
) => {
  const parmas = {
    startTime: startTime,
    endTime: endTime,
    dataType: '',
  };
  const response = await authFetch(
    '/api/user/dashboard',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parmas),
    },
    tokenAddress
  );

  if (response.ok) {
    const data = await response.json();
    return data.data;
  }
};
