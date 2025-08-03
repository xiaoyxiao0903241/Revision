// 获取用户地址
import { getToken } from '~/lib/utils';

export async function authFetch(
  url: string,
  options: RequestInit & { _retry?: boolean } = {},
  address: string
): Promise<Response> {
  const accessToken = getToken(address);
  // 没有 token，提示用户登录
  if (!accessToken) {
    // 可以在这里添加重定向到登录页面的逻辑
    // window.location.href = '/login'
    throw new Error('请先登录');
  }

  const headers = new Headers({
    'Content-Type': 'application/json',
  });
  let response;
  const fetchOptions: RequestInit = {
    ...options,
    headers,
    body:
      typeof options.body === 'object'
        ? JSON.stringify(options.body)
        : options.body,
  };

  // 设置 Authorization header
  headers.set('Authorization', `${accessToken}`);

  response = await fetch(process.env.NEXT_PUBLIC_API_URL + url, fetchOptions);

  // 401 错误码，提示用户登录
  if (response.status === 401 && !options._retry) {
    try {
      if (!accessToken) throw new Error('Failed to refresh access token.');
      headers.set('Authorization', `${accessToken}`);
      response = await fetch(url, { ...fetchOptions, headers });
    } catch {
      throw new Error('Unauthorized: Token refresh failed.');
    }
  }

  return response;
}

export async function publicFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });
  const fetchOptions: RequestInit = {
    ...options,
    headers,
    body:
      typeof options.body === 'object'
        ? JSON.stringify(options.body)
        : options.body,
  };
  return fetch(process.env.NEXT_PUBLIC_API_URL + url, fetchOptions);
}
