import { publicFetch } from '../index';

export const login = async (
  address: string,
  signature: string,
  message: string
) => {
  const response = await publicFetch('/api/user/sign', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ address, signature, message }),
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  throw new Error('登录失败');
};
