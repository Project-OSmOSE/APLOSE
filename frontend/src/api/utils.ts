import type { Token } from '@/api/auth';
import type { ErrorType } from '@/api/types.gql-generated';
import { AppStore } from '@/features/App';
import type {
    ApiEndpointQuery,
    EndpointDefinitions,
    QueryActionCreatorResult,
    QueryDefinition,
} from '@reduxjs/toolkit/query';
import { queryClient } from '@/api/queryClient';
import type { DefaultError, EnsureQueryDataOptions, QueryKey } from '@tanstack/react-query';

export function getTokenFromCookie(): Token | undefined {
    const tokenCookie = document.cookie?.split(';').filter((item) => item.trim().startsWith('token='))[0];
    return tokenCookie?.split('=').pop();
}
export function clearTokenFromCookie(): void {
    document.cookie = 'token=;max-age=0;path=/';
}

export function prepareHeaders(headers: Headers) {
    // Set Authorization
    const token = getTokenFromCookie();
    if (token) headers.set('Authorization', `Bearer ${ token }`);

    return headers;
}

export type GqlError<T extends { [key in string]: any }> = ErrorType & { field: keyof T }

export async function getLoader<Arguments = any, Result = any>(
    query: ApiEndpointQuery<
        QueryDefinition<Arguments, any, any, Result>,
        EndpointDefinitions
    >,
    args: Arguments,
): Promise<QueryActionCreatorResult<QueryDefinition<Arguments, any, any, Result>>> {
    let info = query.select(args)(AppStore.getState() as any)
    if (info.data) return info

    const promise = AppStore.dispatch(query.initiate(args))
    info = await promise
    promise.unsubscribe()
    return info
}

export function cleanGqlList<T>(data?: Array<T | undefined | null> | null): Array<T> {
    return data?.filter(d => !!d).map(d => d!) ?? []
}

export async function ensureValidQueryData<TQueryFnData, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(options: EnsureQueryDataOptions<TQueryFnData, TError, TData, TQueryKey>): Promise<TData> {
    const data = await queryClient.ensureQueryData(options)
    if (queryClient.getQueryState(options.queryKey)?.isInvalidated) {
        return await queryClient.fetchQuery(options)
    }
    return data
}