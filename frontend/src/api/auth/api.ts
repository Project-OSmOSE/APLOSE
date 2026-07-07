import { restAPI } from '../baseRestApi';
import { queryKeys } from '@/api/queryKeys';
import { queryClient } from '@/api/queryClient';
import { clearTokenFromCookie } from '@/api/utils';
import type { Token } from './types';


type LoginResponse = { access: Token, refresh: Token }

export const AuthRestAPI = restAPI.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, { username: string, password: string }>({
            query: (credentials) => ({
                url: '/api/token/',
                method: 'POST',
                body: credentials,
            }),
            transformResponse: (response: LoginResponse) => {
                document.cookie = `token=${ response.access };max-age=28000;path=/`;
                return response;
            },
        }),
        logout: builder.mutation<null, void>({
            queryFn: async () => {
                clearTokenFromCookie()
                queryClient.invalidateQueries({ queryKey: queryKeys.user.current })
                return { data: null }
            },
        }),
        terms: builder.query<string, void>({
            query: () => ({
                url: '/backend/static/datawork/WEB/fr-terms.md',
                headers: {
                    'Content-Type': 'text/markdown',
                },
                responseHandler: 'text',
            }),
        }),
    }),
})
