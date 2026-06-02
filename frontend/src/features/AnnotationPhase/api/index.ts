import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import {
    GetAnnotationPhaseDocument,
    type GetAnnotationPhaseQuery,
    type GetAnnotationPhaseQueryVariables,
} from './annotation-phase.generated'

export const getQuery = (variables: GetAnnotationPhaseQueryVariables) => queryOptions({
    queryKey: queryKeys.phase.get(variables),
    queryFn: () => graphqlClient.request<GetAnnotationPhaseQuery>(GetAnnotationPhaseDocument, variables)
        .then(data => data.annotationPhaseByCampaignPhase),
})

export type * from './annotation-phase.generated'