import { Token } from '@/features/Auth';
import { restAPI } from '../baseRestApi';

type LoginResponse = { access: Token, refresh: Token }

export const AuthRestAPI = restAPI.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, { username: string, password: string }>({
      query: (credentials) => ({
        url: 'token/',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: LoginResponse) => {
        document.cookie = `token=${ response.access };max-age=28000;path=/`;
        return response;
      },
      invalidatesTags: [
        // ...API_TAGS,
        // { type: 'User', id: 'self' }
      ], // TODO: Invalidate on GQL API
    }),
    logout: builder.mutation<undefined, void>({
      queryFn: async () => {
        document.cookie = 'token=;max-age=0;path=/';
        return {
          data: undefined,
        }
      },
      invalidatesTags: [
        // ...API_TAGS,
        // { type: 'User', id: 'self' }
      ], // TODO: Invalidate on GQL API
    }),
  }),
})