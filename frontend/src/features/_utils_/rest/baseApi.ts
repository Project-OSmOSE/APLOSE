import { BaseQueryFn, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Token } from "@/service/types";
import { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";


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

const baseQueryWithHeaders = fetchBaseQuery({
  baseUrl: '/api/',
  prepareHeaders: prepareHeaders,
})

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQueryWithHeaders(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
    document.cookie = 'token=;max-age=0;path=/';
  }
  return result
}

export const restAPI = createApi({
  reducerPath: 'rest',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({})
})