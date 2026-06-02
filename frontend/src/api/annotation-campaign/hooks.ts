import { AnnotationCampaignGqlAPI } from './api'
import { useCallback, useMemo } from 'react';
import { type CreateCampaignMutationVariables, type UpdateCampaignFeaturedLabelsMutationVariables } from '@/api';
import type { GqlError } from '@/api/utils';
import { useLoaderData } from '@tanstack/react-router';

//  API

const {
    createCampaign,
    updateCampaignFeaturedLabels,
    archiveCampaign,
} = AnnotationCampaignGqlAPI.endpoints

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
    const { campaign } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const [ method, info ] = updateCampaignFeaturedLabels.useMutation();

    const update = useCallback(async (variables: Pick<UpdateCampaignFeaturedLabelsMutationVariables, 'labelsWithAcousticFeatures'>) => {
        await method({
            ...variables,
            id: campaign.id,
            labelSetID: campaign.labelSet!.id,
            confidenceSetID: campaign.confidenceSet?.id,
            allowPointAnnotation: campaign.allowPointAnnotation,
        }).unwrap()
    }, [ method, campaign ])

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
