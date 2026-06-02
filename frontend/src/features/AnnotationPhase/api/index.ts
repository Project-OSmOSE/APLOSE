import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import {
    EndPhaseDocument,
    type EndPhaseMutation,
    type EndPhaseMutationVariables,
    GetAnnotationPhaseDocument,
    type GetAnnotationPhaseQuery,
    type GetAnnotationPhaseQueryVariables,
} from './annotation-phase.generated'

export const getQuery = (variables: GetAnnotationPhaseQueryVariables) => queryOptions({
    queryKey: queryKeys.phase.get(variables),
    queryFn: () => graphqlClient.request<GetAnnotationPhaseQuery>(GetAnnotationPhaseDocument, variables)
        .then(data => data.annotationPhaseByCampaignPhase),
})

export const endMutation = mutationOptions({
    mutationFn: (variables: EndPhaseMutationVariables) => graphqlClient.request<EndPhaseMutation>(EndPhaseDocument, variables),
})

export type * from './annotation-phase.generated'