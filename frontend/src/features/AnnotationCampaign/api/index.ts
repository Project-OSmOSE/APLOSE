import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import { cleanGqlList } from '@/api/utils';
import {
    AllCampaignsDocument,
    type AllCampaignsQuery,
    type AllCampaignsQueryVariables,
    ArchiveCampaignDocument,
    type ArchiveCampaignMutation,
    type ArchiveCampaignMutationVariables,
    CreateCampaignDocument,
    type CreateCampaignMutation,
    type CreateCampaignMutationVariables,
    GetCampaignDocument,
    GetCampaignLabelsDocument,
    GetCampaignLabelsQuery,
    GetCampaignLabelsQueryVariables,
    type GetCampaignQuery,
    type GetCampaignQueryVariables,
    UpdateCampaignLabelAcousticFeaturesDocument,
    type UpdateCampaignLabelAcousticFeaturesMutation,
    type UpdateCampaignLabelAcousticFeaturesMutationVariables,
} from './annotation-campaign.generated'

export const allQuery = (variables: AllCampaignsQueryVariables) => queryOptions({
    queryKey: queryKeys.campaign.all(variables),
    queryFn: () => graphqlClient.request<AllCampaignsQuery>(AllCampaignsDocument, variables)
        .then(data => cleanGqlList(data.allAnnotationCampaigns?.results)),
})

export const byIdQuery = ({ id }: Partial<GetCampaignQueryVariables>) => queryOptions({
    enabled: !!id,
    queryKey: queryKeys.campaign.byId({ id: id ?? ' ' }),
    queryFn: () => graphqlClient.request<GetCampaignQuery>(GetCampaignDocument, { id: id ?? '' })
        .then(data => ({
            campaign: data.annotationCampaignById,
            phases: cleanGqlList(data.annotationCampaignById?.phases?.results),
            analysis: cleanGqlList(data.annotationCampaignById?.analysis?.edges.map(e => e?.node)),
            confidences: cleanGqlList(data.annotationCampaignById?.confidenceSet?.confidenceIndicators),
        })),
})

export const labelsByIdQuery = ({ id }: Partial<GetCampaignLabelsQueryVariables>) => queryOptions({
    enabled: !!id,
    queryKey: queryKeys.campaign.labelsById({ id: id ?? '' }),
    queryFn: () => graphqlClient.request<GetCampaignLabelsQuery>(GetCampaignLabelsDocument, { id: id ?? '' })
        .then(data =>
            cleanGqlList(data.annotationCampaignById?.labels).sort((a, b) => {
                return a.label.source.englishName.localeCompare(b.label.source.englishName)
                    || a.label.id.localeCompare(b.label.id)
            })
        ),
})

export const createMutation = mutationOptions({
    mutationFn: (variables: CreateCampaignMutationVariables) => graphqlClient.request<CreateCampaignMutation>(CreateCampaignDocument, variables)
        .then(data => data.createAnnotationCampaign),
    onSuccess: (_data, _vars, _result, context) =>
        context.client.invalidateQueries({ queryKey: queryKeys.campaign.base }),
})


export const archiveMutation = mutationOptions({
    mutationFn: (variables: ArchiveCampaignMutationVariables) =>
        graphqlClient.request<ArchiveCampaignMutation>(ArchiveCampaignDocument, variables)
            .then(data => data.archiveAnnotationCampaign),
    onSuccess: (_data, _vars, _result, context) => Promise.all([
        context.client.invalidateQueries({ queryKey: queryKeys.campaign.base }),
        context.client.invalidateQueries({ queryKey: queryKeys.dataset.base })
    ]),
})

export const updateLabelAcousticFeaturesMutation = mutationOptions({
    mutationFn: (variables: UpdateCampaignLabelAcousticFeaturesMutationVariables & { campaignID: string }) =>
        graphqlClient.request<UpdateCampaignLabelAcousticFeaturesMutation>(UpdateCampaignLabelAcousticFeaturesDocument, variables)
            .then(data => data.updateAnnotationCampaignLabelAcousticFeatures),
    onSuccess: (_data, variables, _result, context) => Promise.all([
        context.client.invalidateQueries({ queryKey: queryKeys.campaign.labelsById({ id: variables.campaignID }) }),
    ])
})


export type {
    AllCampaignsQueryVariables as AllQueryVariables,
    GetCampaignQuery as GetQuery,

    CampaignAnalysisFragment as AnalysisFragment,
    AllCampaignFragment as AllFragment,
    LabelRelationFragment,
    CampaignFragment as Fragment,
} from './annotation-campaign.generated'
