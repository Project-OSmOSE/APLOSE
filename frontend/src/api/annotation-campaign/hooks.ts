import { AnnotationCampaignGqlAPI } from './api'
import { useCallback, useEffect, useMemo } from 'react';
import {
  AnnotationPhaseType,
  type CreateCampaignMutationVariables,
  type UpdateCampaignFeaturedLabelsMutationVariables,
  useCurrentUser,
} from '@/api';
import { AllAnnotationCampaignFilterSlice, AllCampaignFilters, selectAllCampaignFilters } from './all-campaign-filters';
import { useNavParams, useQueryParams } from '@/features/UX';
import type { GqlError } from '@/api/utils';

//  API

const {
  listCampaignsAndPhases,
  getCampaign,
  createCampaign,
  updateCampaignFeaturedLabels,
  archiveCampaign,
} = AnnotationCampaignGqlAPI.endpoints

export const useAllCampaigns = (filters: AllCampaignFilters) => {
  const info = listCampaignsAndPhases.useQuery(filters)
  return useMemo(() => ({
    ...info,
    allCampaigns: info.data?.allAnnotationCampaigns?.results.filter(r => r !== null).map(c => ({
      ...c!,
      phases: info.data?.allAnnotationPhases?.results.filter(p => p?.annotationCampaignId === c!.id).map(p => p!) ?? [],
    })),
  }), [ info ]);
}

export const useCurrentCampaign = () => {
  const { campaignID: id } = useNavParams();
  const info = getCampaign.useQuery({ id: id ?? '' }, { skip: !id })
  const phases = useMemo(() => info.data?.allAnnotationPhases?.results?.filter(p => p !== null), [ info ])
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
  const [ method, info ] = updateCampaignFeaturedLabels.useMutation();

  return {
    updateCampaignFeaturedLabels: method,
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
      selectAllCampaignFilters,
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
