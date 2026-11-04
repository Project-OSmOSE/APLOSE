import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import { cleanGqlList, optimisticMutationOptions } from '@/api/utils';
import {
    AllBehaviorsDocument,
    type AllBehaviorsQuery,
    AllLabelsDocument,
    type AllLabelsQuery,
    CreateBehaviorDocument,
    type CreateBehaviorMutation,
    type CreateBehaviorMutationVariables,
} from './Ontology.generated';

export const allLabels = queryOptions({
    queryKey: queryKeys.mx.ontology.allLabels,
    queryFn: () => graphqlClient.request<AllLabelsQuery>(AllLabelsDocument, {})
        .then(data => cleanGqlList(data.allLabels?.results)),
})

export const allBehaviors = queryOptions({
    queryKey: queryKeys.mx.ontology.allBehaviors,
    queryFn: () => graphqlClient.request<AllBehaviorsQuery>(AllBehaviorsDocument, {})
        .then(data => cleanGqlList(data.allBehaviors?.results)),
})

export const createBehavior = optimisticMutationOptions({
    mutationKey: queryKeys.mx.ontology.allBehaviors,
    mutationFn: (input: CreateBehaviorMutationVariables['input']) =>
        graphqlClient.request<CreateBehaviorMutation>(CreateBehaviorDocument, { input })
            .then(data => data.behavior),
})

export type {
    LabelFragment,
    BehaviorFragment,
} from './Ontology.generated.ts'

export * from './source.ts'
export * from './sound.ts'
