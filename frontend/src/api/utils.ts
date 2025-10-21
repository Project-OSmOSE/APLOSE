import type { Token } from '@/api/auth';

export function getTokenFromCookie(): Token | undefined {
  const tokenCookie = document.cookie?.split(';').filter((item) => item.trim().startsWith('token='))[0];
  return tokenCookie?.split('=').pop();
}

export function prepareHeaders(headers: Headers) {
  // Set Authorization
  const token = getTokenFromCookie();
  if (token) headers.set('Authorization', `Bearer ${ token }`);

  return headers;
}
