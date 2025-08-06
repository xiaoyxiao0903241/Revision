import { authFetch } from '../index';
import { clearToken } from '~/lib/utils';
import { toast } from 'sonner';
// 用户的节点购买记录
export const myNodeRecordList = async (
  page: number = 1,
  pageSize: number = 10,
  tokenAddress: string
) => {
  const response = await authFetch(
    `/api/sales/reward/list`,
    {
      method: 'POST',
      body: JSON.stringify({
        pageNum: page,
        pageSize: pageSize,
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
// 我的节点
export const nodeSummary = async (
  page: number = 1,
  pageSize: number = 10,
  tokenAddress: string
) => {
  const response = await authFetch(
    `/api/sales/purchase/list`,
    {
      method: 'POST',
      body: JSON.stringify({
        pageNum: page,
        pageSize: pageSize,
      }),
    },
    tokenAddress
  );
  console.log(response, 'xxx');
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to get node summary');
  }
  const data = await response.json();
  if (data.code !== '0') {
    if (data.code == 401) {
      clearToken(tokenAddress);
      toast.error('请先登录');
    }
    throw new Error(data.message || 'Failed to get node summary');
  }
  return data.data;
};
