import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import { cleanGqlList, optimisticMutationOptions } from '@/api/utils';
import {
    AllBehaviorsDocument,
    type AllBehaviorsQuery,
    AllLabelsDocument,
    type AllLabelsQuery,
    AllSourcesDocument,
    type AllSourcesQuery,
    CreateBehaviorDocument,
    type CreateBehaviorMutation,
    type CreateBehaviorMutationVariables,
    CreateSourceDocument,
    type CreateSourceMutation,
    type CreateSourceMutationVariables,
} from './Ontology.generated';

export const allSources = queryOptions({
    queryKey: queryKeys.mx.ontology.allSources,
    queryFn: () => graphqlClient.request<AllSourcesQuery>(AllSourcesDocument, {})
        .then(data => cleanGqlList(data.allSources?.results)),
})

export const createSource = optimisticMutationOptions({
    mutationKey: queryKeys.mx.ontology.allSources,
    mutationFn: (input: CreateSourceMutationVariables['input']) =>
        graphqlClient.request<CreateSourceMutation>(CreateSourceDocument, { input })
        .then(data => data.postSource),
})

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

export type * from './Ontology.generated';
