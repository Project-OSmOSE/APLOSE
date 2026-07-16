import type { Errors } from '@base-ui/react/internals/form-context';
import type { ErrorType } from '@/api/types.gql-generated';
import { AppStore } from '@/features/App';
import type {
    ApiEndpointQuery,
    EndpointDefinitions,
    QueryActionCreatorResult,
    QueryDefinition,
} from '@reduxjs/toolkit/query';
import { Token } from './auth/types';
import {
    type DefaultError,
    type EnsureQueryDataOptions,
    mutationOptions,
    type QueryKey,
    type UseMutationOptions,
} from '@tanstack/react-query';
import { queryClient } from '@/api/queryClient';
import { WithRequired } from '@tanstack/query-core';
import { queryKeys } from '@/api/queryKeys';


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

export function cleanGqlErrors(errors?: Array<ErrorType | null> | null): Errors {
    return cleanGqlList(errors).reduce((prev, current) => ({
        ...prev,
        [current.field]: current.messages,
    }), {})
}


export async function ensureValidQueryData<TQueryFnData, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(options: EnsureQueryDataOptions<TQueryFnData, TError, TData, TQueryKey>): Promise<TData> {
    const data = await queryClient.ensureQueryData(options)
    if (queryClient.getQueryState(options.queryKey)?.isInvalidated) {
        return await queryClient.fetchQuery(options)
    }
    return data
}

type TOnMutateResult<TData> = { previousData: TData }
export function optimisticMutationOptions<
    TData = unknown,
    TError = DefaultError,
    TVariables = void,
>(
    {
        mutationKey,
        ...options
    }: WithRequired<UseMutationOptions<TData, TError, TVariables, TOnMutateResult<TData>>, 'mutationKey'>,
): WithRequired<UseMutationOptions<TData, TError, TVariables, TOnMutateResult<TData>>, 'mutationKey'> {
    return mutationOptions({
        ...options,
        mutationKey,
        onMutate: async (newData, context) => {
            // Cancel ongoing refetch
            await context.client.cancelQueries({ queryKey: mutationKey })

            // Snapshot previous value
            const previousData = context.client.getQueryData(mutationKey)

            // Optimistic update
            context.client.setQueryData(mutationKey, (previous: any) => [ ...(previous || []), newData ])

            return { previousData } as any
        },
        onError: (_error, _new, onMutateResult, context) => {
            context.client.setQueryData(queryKeys.mx.common.allInstitutions, onMutateResult?.previousData)
        },
        onSettled: (_data, _error, _variables, _onMutateResult, context) =>
            context.client.invalidateQueries({ queryKey: mutationKey }),
    })
}
