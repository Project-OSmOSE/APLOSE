import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import { cleanGqlList, optimisticMutationOptions } from '@/api/utils';
import {
    AllEquipmentModelsDocument,
    type AllEquipmentModelsQuery,
    AllEquipmentsDocument,
    type AllEquipmentsQuery,
    AllPlatformsDocument,
    type AllPlatformsQuery,
    AllPlatformTypesDocument,
    type AllPlatformTypesQuery,
    CreateEquipmentDocument,
    CreateEquipmentModelDocument,
    type CreateEquipmentModelMutation,
    type CreateEquipmentModelMutationVariables,
    type CreateEquipmentMutation,
    type CreateEquipmentMutationVariables,
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

export const allEquipmentModelQuery = queryOptions({
    queryKey: queryKeys.mx.equipment.allEquipmentModels,
    queryFn: () => graphqlClient.request<AllEquipmentModelsQuery>(AllEquipmentModelsDocument, {})
        .then(data => cleanGqlList(data.allEquipmentModels?.results)),
})

export const createEquipmentModel = optimisticMutationOptions({
    mutationKey: queryKeys.mx.equipment.allEquipmentModels,
    mutationFn: (input: CreateEquipmentModelMutationVariables['input']) =>
        graphqlClient.request<CreateEquipmentModelMutation>(CreateEquipmentModelDocument, { input })
            .then(data => data.createEquipmentModel),
})

export const allEquipmentQuery = queryOptions({
    queryKey: queryKeys.mx.equipment.allEquipments,
    queryFn: () => graphqlClient.request<AllEquipmentsQuery>(AllEquipmentsDocument, {})
        .then(data => cleanGqlList(data.allEquipments?.results)),
})

export const createEquipment = optimisticMutationOptions({
    mutationKey: queryKeys.mx.equipment.allEquipments,
    mutationFn: (input: CreateEquipmentMutationVariables['input']) =>
        graphqlClient.request<CreateEquipmentMutation>(CreateEquipmentDocument, { input })
            .then(data => data.equipment),
})

export type * from './Equipment.generated'
