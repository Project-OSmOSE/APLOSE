import { AnnotationCampaignGqlAPI } from './api'
import { useCallback, useMemo } from 'react';
import {
    AnnotationPhaseType,
    type CreateCampaignMutationVariables,
    type ListCampaignsQueryVariables,
    type UpdateCampaignFeaturedLabelsMutationVariables,
} from '@/api';
import type { GqlError } from '@/api/utils';
import { useParams } from '@tanstack/react-router';

//  API

const {
    listCampaigns,
    getCampaign,
    createCampaign,
    updateCampaignFeaturedLabels,
    archiveCampaign,
} = AnnotationCampaignGqlAPI.endpoints

export type AllCampaignFilters = ListCampaignsQueryVariables

export const useAllCampaigns = (filters: AllCampaignFilters) => {
    const info = listCampaigns.useQuery(filters)
    return useMemo(() => ({
        ...info,
        allCampaigns: info.data?.allAnnotationCampaigns?.results.filter(r => r !== null).map(c => c!),
    }), [ info ]);
}

export const useCurrentCampaign = () => {
    const { campaignID } = useParams({ strict: false })
    const info = getCampaign.useQuery({
        id: campaignID ?? '',
    }, { skip: !campaignID })
    const phases = useMemo(() => info.data?.annotationCampaignById?.phases?.results.map(p => p!), [ info ])
    return useMemo(() => ({
        ...info,
        campaign: info?.data?.annotationCampaignById,
        phases,
        annotationPhase: phases?.find(p => p!.phase === AnnotationPhaseType.Annotation),
        verificationPhase: phases?.find(p => p!.phase === AnnotationPhaseType.Verification),
        allAnalysis: info?.data?.annotationCampaignById?.analysis.edges.map(e => e?.node).filter(n => !!n),
    }), [ info, phases ])
}

export const useCreateCampaign = () => {
    const [ method, info ] = createCampaign.useMutation();

    return {
        createCampaign: method,
        ...useMemo(() => {
            const formErrors = (info.data?.createAnnotationCampaign?.errors ?? []) as GqlError<CreateCampaignMutationVariables>[]
            return {
                ...info,
                campaign: info.data?.createAnnotationCampaign?.annotationCampaign,
                isSuccess: info.isSuccess && formErrors.length === 0,
                formErrors,
            }
        }, [ info ]),
    }
}

export const useUpdateCampaignFeaturedLabels = () => {
    const { campaignID } = useParams({ strict: false })
    const { campaign } = useCurrentCampaign()
    const [ method, info ] = updateCampaignFeaturedLabels.useMutation();

    const update = useCallback(async (variables: Pick<UpdateCampaignFeaturedLabelsMutationVariables, 'labelsWithAcousticFeatures'>) => {
        if (!campaignID || !campaign) return;
        await method({
            ...variables,
            id: campaignID,
            labelSetID: campaign.labelSet!.id,
            confidenceSetID: campaign.confidenceSet?.id,
            allowPointAnnotation: campaign.allowPointAnnotation,
        }).unwrap()
    }, [ method, campaignID, campaign ])

    return {
        updateCampaignFeaturedLabels: update,
        ...useMemo(() => {
            const formErrors = (info.data?.updateAnnotationCampaign?.errors ?? []) as GqlError<UpdateCampaignFeaturedLabelsMutationVariables>[]
            return {
                ...info,
                isSuccess: info.isSuccess && formErrors.length === 0,
                formErrors,
            }
        }, [ info ]),
    }
}

export const useArchiveCampaign = () => {
    const [ method, info ] = archiveCampaign.useMutation();
    return { archiveCampaign: method, ...info }
}
