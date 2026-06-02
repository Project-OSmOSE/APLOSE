import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import {
    CreateAnnotationPhaseDocument,
    type CreateAnnotationPhaseMutation,
    type CreateAnnotationPhaseMutationVariables,
    CreateVerificationPhaseDocument,
    type CreateVerificationPhaseMutation,
    type CreateVerificationPhaseMutationVariables,
    EndPhaseDocument,
    type EndPhaseMutation,
    type EndPhaseMutationVariables,
    GetAnnotationPhaseDocument,
    type GetAnnotationPhaseQuery,
    type GetAnnotationPhaseQueryVariables,
} from './annotation-phase.generated'
import { queryClient } from '@/api/queryClient';

export const getQuery = (variables: GetAnnotationPhaseQueryVariables) => queryOptions({
    queryKey: queryKeys.phase.get(variables),
    queryFn: () => graphqlClient.request<GetAnnotationPhaseQuery>(GetAnnotationPhaseDocument, variables)
        .then(data => data.annotationPhaseByCampaignPhase),
})

export const endMutation = mutationOptions({
    mutationFn: (variables: EndPhaseMutationVariables) => graphqlClient.request<EndPhaseMutation>(EndPhaseDocument, variables),
})

export const createAnnotationMutation = mutationOptions({
    mutationFn: (variables: CreateAnnotationPhaseMutationVariables) => graphqlClient.request<CreateAnnotationPhaseMutation>(CreateAnnotationPhaseDocument, variables),
    onSuccess: (_data, { campaignID }) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.campaign.byId({ id: campaignID }) })
        queryClient.invalidateQueries({ queryKey: queryKeys.campaign.base })
    },
})

export const createVerificationMutation = mutationOptions({
    mutationFn: (variables: CreateVerificationPhaseMutationVariables) => graphqlClient.request<CreateVerificationPhaseMutation>(CreateVerificationPhaseDocument, variables),
    onSuccess: (_data, { campaignID }) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.campaign.byId({ id: campaignID }) })
        queryClient.invalidateQueries({ queryKey: queryKeys.campaign.base })
    },
})

export type * from './annotation-phase.generated'