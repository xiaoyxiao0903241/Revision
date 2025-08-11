import { authFetch } from '../index';
import { clearToken } from '~/lib/utils';
import { toast } from 'sonner';

//涡轮记录
export const turbineRecord = async (
  page: number = 1,
  pageSize: number = 10,
  tokenAddress: string,
  recordType: string
) => {
  const parmas = {
    pageNum: page,
    pageSize: pageSize,
    recordType,
  };
  const response = await authFetch(
    '/api/history/turbine',
    {
      method: 'POST',
      body: JSON.stringify(parmas),
    },
    tokenAddress
  );
  const data = await response.json();
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to get node record list');
  }

  if (data.code !== '0') {
    if (data.code == 401) {
      clearToken(tokenAddress);
      toast.error('请先登录');
    }
    throw new Error(data.message || 'Failed to get node record list');
  }

  if (data.data.records.length) {
    const list = data.data.records;
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

export const turbineMess = async (tokenAddress: string) => {
  const response = await authFetch(
    '/api/user/data/turbine',
    {
      method: 'GET',
    },
    tokenAddress
  );
  const data = await response.json();
  if (data.code !== '0') {
    if (data.code == 401) {
      clearToken(tokenAddress);
      toast.error('请先登录');
    }
    throw new Error(data.message || 'Failed to get node record list');
  }
  if (data.code == '0') {
    return data.data;
  }

  return 0;
};
