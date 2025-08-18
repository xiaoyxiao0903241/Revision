import { publicFetch, authFetch } from '../index';
import { formatTimeToLocal, getWeekday } from '~/lib/utils';

export interface responseItem {
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
  TVL: number;
  nodeStakedAmount: number;
  newLockedStaking: number;
}
export interface airItem {
  amount: string;
  week: string;
  createdAt: string;
}

export const responseItemDefault: responseItem = {
  amount: 0,
  createdAt: '',
  week: '',
  tokenTotalSupply: 0,
  tokenPrice: 0,
  treasuryMarketCap: 0,
  lpMarketCap: 0,
  longStakedAmount: 0,
  flexibleStakedAmount: 0,
  lpBondMarketCap: 0,
  liquidityBondMarketCap: 0,
  stableBondMarketCap: 0,
  TVL: 0,
  nodeStakedAmount: 0,
  newLockedStaking: 0,
};

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
    // tokenTotalSupply 流通量
    const data = await response.json();
    const marketList: airItem[] = []; //市值
    const supplyList: airItem[] = []; //币的供应量值
    const priceList: airItem[] = []; //价格
    const treasuryList: airItem[] = []; //国库
    // let lpList = [];//lp
    const depositList: airItem[] = []; //质押
    const lpBondMarketCapList: airItem[] = []; //流动债券
    const backingPriceList: airItem[] = []; // 托底价格
    const PremiumList: airItem[] = []; // 托底价格

    if (data.data.records.length) {
      const list = data.data.records;
      // 过滤出坐今天昨天的数据
      let todayObj: responseItem = responseItemDefault;
      let yesterdayObj: responseItem = responseItemDefault;
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      const todayStr = today.toISOString().split('T')[0];
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      list.map((it: responseItem) => {
        const value = (
          Number(it.tokenTotalSupply) * Number(it.tokenPrice)
        ).toFixed(6);
        // 托底价格
        const backingPrice =
          Number(it.liquidityBondMarketCap) / Number(it.tokenTotalSupply);
        // 溢价指数
        const Premium = backingPrice !== 0 ? Number(value) / backingPrice : 0;
        // 长期+活期+节点总量
        const depositNum = (
          (Number(it.longStakedAmount) +
            Number(it.flexibleStakedAmount) +
            Number(it.nodeStakedAmount)) *
          Number(it.tokenPrice)
        ).toFixed(6);
        const newLockedStaking =
          (Number(it.longStakedAmount) + Number(it.nodeStakedAmount)) *
          Number(it.tokenPrice);

        const itemDateStr = it.createdAt.split(' ')[0]; // YYYY-MM-DD
        const item = {
          ...it,
          TVL: Number(depositNum),
          newLockedStaking,
        };

        if (itemDateStr === todayStr) {
          todayObj = item;
        } else if (itemDateStr === yesterdayStr) {
          yesterdayObj = item;
        }
        marketList.push({
          amount: value,
          week: getWeekday(it.createdAt),
          createdAt: formatTimeToLocal(it.createdAt),
        });
        supplyList.push({
          amount: Number(it.tokenTotalSupply).toFixed(6),
          week: getWeekday(it.createdAt),
          createdAt: formatTimeToLocal(it.createdAt),
        });
        priceList.push({
          amount: Number(it.tokenPrice).toFixed(6),
          week: getWeekday(it.createdAt),
          createdAt: formatTimeToLocal(it.createdAt),
        });
        // lpList.push(
        //     {
        //         amount:Number(it.lpMarketCap).toFixed(4)
        //     }
        // );
        treasuryList.push({
          amount: Number(it.stableBondMarketCap).toFixed(6),
          week: getWeekday(it.createdAt),
          createdAt: formatTimeToLocal(it.createdAt),
        });

        depositList.push({
          amount: depositNum,
          week: getWeekday(it.createdAt),
          createdAt: formatTimeToLocal(it.createdAt),
        });

        lpBondMarketCapList.push({
          amount: Number(it.liquidityBondMarketCap).toFixed(6),
          week: getWeekday(it.createdAt),
          createdAt: formatTimeToLocal(it.createdAt),
        });
        backingPriceList.push({
          amount: Number(backingPrice).toFixed(6),
          week: getWeekday(it.createdAt),
          createdAt: formatTimeToLocal(it.createdAt),
        });
        PremiumList.push({
          amount: Number(Premium).toFixed(6),
          week: getWeekday(it.createdAt),
          createdAt: formatTimeToLocal(it.createdAt),
        });
      });

      return {
        marketList,
        supplyList,
        priceList,
        depositList,
        treasuryList,
        lpBondMarketCapList,
        backingPriceList,
        PremiumList,
        todayObj,
        yesterdayObj,
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
