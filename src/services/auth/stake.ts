import { authFetch, publicFetch } from '../index';
import { toast } from 'sonner';
import { clearToken, getWeekday } from '@/lib/utils';

interface historyItem {
  amount: string;
  hash: string;
  createdAt: string;
  recordType: string;
}

interface airItem {
  amount: number;
  createdAt: string;
  week: string;
  longStakedAmount: string;
  flexibleStakedAmount: string;
  stableBondMarketCap: string;
  lpBondMarketCap: string;
}

//债券 / 质押的面积图
export const airChart = async (
  startTime: string,
  endTime: string,
  dataType: string
) => {
  const parmas = {
    startTime: startTime,
    endTime: endTime,
    dataType: dataType,
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
    if (data.data.records.length) {
      const list = data.data.records;
      list.map((it: airItem) => {
        it.amount = Number(it.amount);
        it['week'] = getWeekday(it.createdAt);
      });
      return {
        airList: list,
        all: list[list.length - 1].amount,
      };
    }
  }
  return {
    airList: [],
    all: 0,
  };
};

// 长期质押记录
export const longStakHis = async (
  address: string,
  page: number = 1,
  pageSize: number = 10,
  tokenAddress: string
) => {
  const searchParams = {
    pageNum: page,
    pageSize: pageSize,
    pageType: 'longTerm',
  };
  const response = await authFetch(
    `/api/history/staked`,
    {
      method: 'POST',
      body: JSON.stringify(searchParams),
    },
    tokenAddress
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to get node record list');
  }

  const data = await response.json();
  if (data.code !== '0') {
    if (data.code == 401) {
      clearToken(tokenAddress);
      toast.error('请先登录');
    }
    throw new Error(data.message || 'Failed to get node record list');
  }
  if (data.data.records.length) {
    const list = data.data.records;
    list.map((it: historyItem) => {
      it.amount = Number(it.amount).toString();
    });
    return {
      history: list,
      total: data.data.total,
    };
  }
  return {
    history: [],
    total: 0,
  };
};

// 活期质押记录
export const demandStakHis = async (
  address: string,
  page: number = 1,
  pageSize: number = 10,
  tokenAddress: string
) => {
  const searchParams = {
    pageNum: page,
    pageSize: pageSize,
    pageType: 'flexible',
  };
  const response = await authFetch(
    `/api/history/staked`,
    {
      method: 'POST',
      body: JSON.stringify(searchParams),
    },
    tokenAddress
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to get node record list');
  }

  const data = await response.json();
  if (data.code !== '0') {
    if (data.code == 401) {
      clearToken(tokenAddress);
      toast.error('请先登录');
    }
    throw new Error(data.message || 'Failed to get node record list');
  }

  if (data.data.records.length) {
    const list = data.data.records;
    list.map((it: historyItem) => (it.amount = Number(it.amount).toString()));
    return {
      history: list,
      total: data.data.total,
    };
  }
  return {
    history: [],
    total: 0,
  };
};
