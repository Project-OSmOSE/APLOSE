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
  const info = getCampaign.useQuery({ id: id ?? '' }, { skip: !id })
  const phases = useMemo(() => info.data?.annotationCampaignById?.phases?.map(p => p!), [ info ])
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
  const [ method, info ] = updateCampaignFeaturedLabels.useMutation();

  const update = useCallback(async (variables: Pick<UpdateCampaignFeaturedLabelsMutationVariables, 'labelsWithAcousticFeatures'>) => {
    if (!campaignID) return;
    await method({ ...variables, id: campaignID }).unwrap()
  }, [ method, campaignID ])

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
      annotatorID: user.id,
      isArchived: false,
      ...params,
    }
    if (updatedFilters.annotatorID !== user.id) {
      updatedFilters.annotatorID = user.id
    }
    if (updatedFilters.ownerID && updatedFilters.ownerID !== user.id) {
      updatedFilters.ownerID = user.id
    }
    updateParams(updatedFilters)
  }, [ params, user, updateParams ])

  return { params, updateParams, clearParams }
}
