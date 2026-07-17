import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import { cleanGqlList, optimisticMutationOptions } from '@/api/utils';
import {
    AllPlatformsDocument,
    type AllPlatformsQuery,
    AllPlatformTypesDocument,
    type AllPlatformTypesQuery,
    CreatePlatformDocument,
    type CreatePlatformMutation,
    type CreatePlatformMutationVariables,
    CreatePlatformTypeDocument,
    type CreatePlatformTypeMutation,
    type CreatePlatformTypeMutationVariables,
} from '@/features/Mx/Equipment/api/Equipment.generated';


export const allPlatformTypesQuery = queryOptions({
    queryKey: queryKeys.mx.equipment.allPlatformTypes,
    queryFn: () => graphqlClient.request<AllPlatformTypesQuery>(AllPlatformTypesDocument, {})
        .then(data => cleanGqlList(data.allPlatformTypes?.results)),
})

export const createPlatformType = optimisticMutationOptions({
    mutationKey: queryKeys.mx.equipment.allPlatformTypes,
    mutationFn: (input: CreatePlatformTypeMutationVariables['input']) =>
        graphqlClient.request<CreatePlatformTypeMutation>(CreatePlatformTypeDocument, { input })
            .then(data => data.platformType),
})

export const allPlatformQuery = queryOptions({
    queryKey: queryKeys.mx.equipment.allPlatforms,
    queryFn: () => graphqlClient.request<AllPlatformsQuery>(AllPlatformsDocument, {})
        .then(data => cleanGqlList(data.allPlatforms?.results)),
})

export const createPlatform = optimisticMutationOptions({
    mutationKey: queryKeys.mx.equipment.allPlatforms,
    mutationFn: (input: CreatePlatformMutationVariables['input']) =>
        graphqlClient.request<CreatePlatformMutation>(CreatePlatformDocument, { input })
            .then(data => data.platform),
})

export type * from './Equipment.generated'
