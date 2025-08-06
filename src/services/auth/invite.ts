import { authFetch } from '../index';

// 邀请信息
export const inviterInfo = async (address: string, tokenAddress: string) => {
  const params = {
    address: address,
  };
  const response = await authFetch(
    `/api/inviter/info?${new URLSearchParams(params).toString()}`,
    {
      method: 'GET',
    },
    tokenAddress
  );
  if (response.ok) {
    const data = await response.json();
    return data?.data;
  }
  throw new Error('获取失败');
};

//邀请记录
export const inviteHisList = async (
  page: number = 1,
  pageSize: number = 5,
  tokenAddress: string
) => {
  const params = {
    pageNum: page,
    pageSize: pageSize,
  };
  const response = await authFetch(
    `/api/inviter/list`,
    {
      method: 'POST',
      body: JSON.stringify(params),
    },
    tokenAddress
  );
  if (response.ok) {
    const data = await response.json();
    return data?.data;
  }
  throw new Error('获取失败');
};

//我的直推

export const performance = async (tokenAddress: string) => {
  const response = await authFetch(
    `/api/node/purchase/performance`,
    {
      method: 'GET',
    },
    tokenAddress
  );
  if (response.ok) {
    const data = await response.json();
    return data?.data;
  }
  throw new Error('获取失败');
};
