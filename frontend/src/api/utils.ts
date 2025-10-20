import { getTokenFromCookie } from '@/features/Auth';

export function prepareHeaders(headers: Headers) {
  // Set Authorization
  const token = getTokenFromCookie();
  if (token) headers.set('Authorization', `Bearer ${ token }`);

  return headers;
}
