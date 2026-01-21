import { AnnotationCampaignGqlAPI } from './api'
import { useCallback, useEffect, useMemo } from 'react';
import {
  AnnotationPhaseType,
  type CreateCampaignMutationVariables,
  type UpdateCampaignFeaturedLabelsMutationVariables,
  useCurrentUser,
} from '@/api';
import { AllAnnotationCampaignFilterSlice, AllCampaignFilters } from './all-campaign-filters';
import { type AploseNavParams, useQueryParams } from '@/features/UX';
import type { GqlError } from '@/api/utils';
import { useParams } from 'react-router-dom';

//  API

const {
  listCampaigns,
  getCampaign,
  createCampaign,
  updateCampaignFeaturedLabels,
  archiveCampaign,
} = AnnotationCampaignGqlAPI.endpoints

export const useAllCampaigns = (filters: AllCampaignFilters) => {
  const info = listCampaigns.useQuery(filters)
  return useMemo(() => ({
    ...info,
    allCampaigns: info.data?.allAnnotationCampaigns?.results.filter(r => r !== null).map(c => c!),
  }), [ info ]);
}

export const useCurrentCampaign = () => {
  const { campaignID: id } = useParams<AploseNavParams>();
  const { user } = useCurrentUser()
  const info = getCampaign.useQuery({
    id: id ?? '',
  }, { skip: !id })
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
  const { campaignID } = useParams<AploseNavParams>();
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

// Filters

export const useAllCampaignsFilters = () => {
  const { user } = useCurrentUser();
  const { params, updateParams, clearParams } = useQueryParams<AllCampaignFilters>(
    AllAnnotationCampaignFilterSlice.selectors.selectFilters,
    AllAnnotationCampaignFilterSlice.actions.updateCampaignFilters,
  )

  useEffect(() => {
    init()
  }, [ user ]);

  useEffect(() => {
    init()
  }, []);

  const init = useCallback(() => {
    if (!user) return;
    const updatedFilters: AllCampaignFilters = {
      filter_annotatorID: user.id,
      filter_isArchived: false,
      ...params,
    }
    if (updatedFilters.filter_annotatorID !== user.id) {
      updatedFilters.filter_annotatorID = user.id
    }
    if (updatedFilters.filter_ownerID && updatedFilters.filter_ownerID !== user.id) {
      updatedFilters.filter_ownerID = user.id
    }
    updateParams(updatedFilters)
  }, [ params, user, updateParams ])

  return { params, updateParams, clearParams }
}
