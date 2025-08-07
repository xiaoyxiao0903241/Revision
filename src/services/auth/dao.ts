import { authFetch } from '../index';
import { toast } from 'sonner';
import { clearToken } from '~/lib/utils';

// 收益记录
// pageType = { referral 共振, title 称号, reverse 反呼, service 服务, lead 引领 }
// /reward/record
export const rewardList = async (
  page: number = 1,
  pageSize: number = 10,
  tokenAddress: string,
  type: string
) => {
  const response = await authFetch(
    `/api/reward/record`,
    {
      method: 'POST',
      body: JSON.stringify({
        pageNum: page,
        pageSize: pageSize,
        pageType: type,
      }),
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

  return data.data;
};
// 收益历史
// /reward/history
// pageType = { referral 共振, title 称号, reverse 反呼, service 服务, lead 引领 }
export const rewardHistoryList = async (
  page: number = 1,
  pageSize: number = 10,
  tokenAddress: string,
  type: string
) => {
  const response = await authFetch(
    `/api/reward/history`,
    {
      method: 'POST',
      body: JSON.stringify({
        pageNum: page,
        pageSize: pageSize,
        pageType: type,
      }),
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
  const list = data.data;
  list.records.forEach(
    (it: { lockIndex: number; [key: string]: unknown }) =>
      (it['lockIndex_n'] = it.lockIndex)
  );
  return list;
};

//领取收益
// /reward/claim/{reward}
// reward = { referral 共振, title 称号, reverse 反呼, service 服务, lead 引领 }
export const claimReward = async (reward: string, tokenAddress: string) => {
  const response = await authFetch(
    `/api/reward/claim/${reward}`,
    {
      method: 'GET',
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

  return data.data;
};
// 引领奖励
// /reward/lead
export const leadReward = async (tokenAddress: string) => {
  const response = await authFetch(
    `/api/reward/lead`,
    {
      method: 'GET',
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

  return data.data;
};

// 矩阵奖励
export const rewardMatrix = async (tokenAddress: string) => {
  const response = await authFetch(
    `/api/reward/matrix`,
    {
      method: 'GET',
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

  return data.data;
};
// 共振奖励
// /reward/referral
export const referralReward = async (tokenAddress: string) => {
  const response = await authFetch(
    `/api/reward/referral`,
    {
      method: 'GET',
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

  return data.data;
};
// 反呼奖励
// /reward/reverse
export const reverseReward = async (tokenAddress: string) => {
  const response = await authFetch(
    `/api/reward/reverse`,
    {
      method: 'GET',
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

  return data.data;
};
// 服务奖励
// /reward/service
export const serviceReward = async (tokenAddress: string) => {
  const response = await authFetch(
    `/api/reward/service`,
    {
      method: 'GET',
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

  return data.data;
};
// 称号奖励
// /reward/title
export const titleReward = async (tokenAddress: string) => {
  const response = await authFetch(
    `/api/reward/title`,
    {
      method: 'GET',
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

  return data.data;
};
// /reward/{reward}/{signature}
// 奖励领取完毕通知
export const rewardClaimed = async (
  reward: string,
  signature: string,
  tokenAddress: string
) => {
  const response = await authFetch(
    `/api/reward/${reward}/${signature}`,
    {
      method: 'GET',
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

  return data.data;
};
