import type { Token } from '@/api/auth';
import type { ErrorType } from '@/api/types.gql-generated';

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

export type GqlError<T extends { [key in string]: any }> = ErrorType & { field: keyof T }
