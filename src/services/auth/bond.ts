import { authFetch } from '../index';
import { toast } from 'sonner';
import { clearToken } from '@/lib/utils';

// 用户的节点购买记录
export const myBondRecordList = async (
  page: number = 1,
  pageSize: number = 10,
  tokenAddress: string,
  type: string
) => {
  const response = await authFetch(
    `/api/history/bond_depository`,
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
