import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import { cleanGqlList, optimisticMutationOptions } from '@/api/utils';
import {
    AllSourcesDocument,
    type AllSourcesQuery,
    DeleteSourceDocument,
    type DeleteSourceMutation,
    type DeleteSourceMutationVariables,
    DetailedSourceByIdDocument,
    type DetailedSourceByIdQuery,
    type DetailedSourceByIdQueryVariables,
    PostSourceDocument,
    type PostSourceMutation,
} from './Ontology.generated';
import type { PostSourceMutationInput, } from '@/api/types.gql-generated.ts'

export const allSources = queryOptions({
    queryKey: queryKeys.mx.ontology.source.all,
    queryFn: () => graphqlClient.request<AllSourcesQuery>(AllSourcesDocument, {})
        .then(data => cleanGqlList(data.allSources?.results)),
})

export const sourceById = (variables: DetailedSourceByIdQueryVariables) => queryOptions({
    queryKey: queryKeys.mx.ontology.source.byID(variables),
    queryFn: () => graphqlClient.request<DetailedSourceByIdQuery>(DetailedSourceByIdDocument, variables)
        .then(data => data.sourceById)
})

export type CreateSourceInput = Omit<PostSourceMutationInput, 'id'>
export const createSource = optimisticMutationOptions({
    mutationKey: queryKeys.mx.ontology.source.all,
    mutationFn: (input: CreateSourceInput) => graphqlClient.request<PostSourceMutation>(PostSourceDocument, { input })
            .then(data => data.postSource),
    onSettled: (_data, _error, _variables, _onMutateResult, context) => Promise.all([
        context.client.invalidateQueries({ queryKey: queryKeys.mx.ontology.source.all }),
    ])
})

export type UpdateSourceInput = PostSourceMutationInput & { id: NonNullable<PostSourceMutationInput['id']> }
export const updateSource = optimisticMutationOptions({
    mutationKey: queryKeys.mx.ontology.source.all,
    mutationFn: (input: UpdateSourceInput) =>
        graphqlClient.request<PostSourceMutation>(PostSourceDocument, { input })
            .then(data => data.postSource),
    onSettled: (_data, _error, variables, _onMutateResult, context) => Promise.all([
        context.client.invalidateQueries({ queryKey: queryKeys.mx.ontology.source.all }),
        context.client.invalidateQueries({ queryKey: queryKeys.mx.ontology.source.byID(variables) }),
    ])
})

export const deleteSource = optimisticMutationOptions({
    mutationKey: queryKeys.mx.ontology.source.all,
    mutationFn: (input: DeleteSourceMutationVariables) =>
        graphqlClient.request<DeleteSourceMutation>(DeleteSourceDocument, { input })
            .then(data => data.deleteSource),
    onSettled: (_data, _error, variables, _onMutateResult, context) => Promise.all([
        context.client.invalidateQueries({ queryKey: queryKeys.mx.ontology.source.all }),
        context.client.invalidateQueries({ queryKey: queryKeys.mx.ontology.source.byID(variables) }),
    ])
})


export type {
    SourceFragment,
    DetailedSourceFragment,
} from './Ontology.generated';