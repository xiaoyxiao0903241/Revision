import { publicFetch } from '../index';

// 首页用户数量/国库值/流动池/存款
export const homeBaseData = async () => {
  const response = await publicFetch(`/api/dashboard/data/summary`, {
    method: 'GET',
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  throw new Error('获取失败');
};
