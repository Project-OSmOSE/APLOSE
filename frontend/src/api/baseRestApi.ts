import { BaseQueryFn, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { prepareHeaders } from './utils';

const baseQueryWithHeaders = fetchBaseQuery({
  prepareHeaders: prepareHeaders,
})

const baseQueryWithReAuth: BaseQueryFn<
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
  tagTypes: [
    'SQL',
    'Collaborator',
    'Tile',
  ],
  baseQuery: baseQueryWithReAuth,
  endpoints: () => ({}),
})
