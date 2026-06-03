import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import { cleanGqlList } from '@/api/utils';
import { queryClient } from '@/api/queryClient';
import {
    CreateSourceDocument,
    type CreateSourceMutation,
    type CreateSourceMutationVariables,
    DeleteSourceDocument,
    type DeleteSourceMutation,
    type DeleteSourceMutationVariables,
    GetAllSourcesDocument,
    type GetAllSourcesQuery,
    GetDetailedSourceByIdDocument,
    type GetDetailedSourceByIdQuery,
    type GetDetailedSourceByIdQueryVariables,
    UpdateSourceDocument,
    type UpdateSourceMutation,
    type UpdateSourceMutationVariables,
} from './source.generated'

export const allSourcesQuery = queryOptions({
    queryKey: queryKeys.ontology.source.all,
    queryFn: () => graphqlClient.request<GetAllSourcesQuery>(GetAllSourcesDocument, {})
        .then(data => cleanGqlList(data.allSources?.results)),
})
export const sourceByIdQuery = (variables: GetDetailedSourceByIdQueryVariables) => queryOptions({
    queryKey: queryKeys.ontology.source.byId(variables),
    queryFn: () => graphqlClient.request<GetDetailedSourceByIdQuery>(GetDetailedSourceByIdDocument, variables)
        .then(data => data.sourceById),
})

export const createSourceMutation = mutationOptions({
    mutationFn: (variables: CreateSourceMutationVariables) => graphqlClient.request<CreateSourceMutation>(CreateSourceDocument, variables),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.ontology.source.all }),
})

export const updateSourceMutation = mutationOptions({
    mutationFn: (variables: UpdateSourceMutationVariables) => graphqlClient.request<UpdateSourceMutation>(UpdateSourceDocument, variables),
    onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.ontology.source.all })
        queryClient.invalidateQueries({ queryKey: queryKeys.ontology.source.byId({ id: variables.id }) })
    },
})

export const deleteSourceMutation = mutationOptions({
    mutationFn: (variables: DeleteSourceMutationVariables) => graphqlClient.request<DeleteSourceMutation>(DeleteSourceDocument, variables),
    onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.ontology.source.all })
        queryClient.invalidateQueries({ queryKey: queryKeys.ontology.source.byId({ id: variables.id }) })
    },
})

export type * from './source.generated'
