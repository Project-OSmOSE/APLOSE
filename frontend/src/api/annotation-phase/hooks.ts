import { AnnotationPhaseGqlAPI } from './api';
import { useMemo } from 'react';
import { AnnotationPhaseType } from '@/api';
import { useNavParams } from '@/features/UX';

const {
  getAnnotationPhase,
  endPhase,
  createAnnotationPhase,
  createVerificationPhase,
} = AnnotationPhaseGqlAPI.endpoints

export const useCurrentPhase = () => {
  const { campaignID, phaseType } = useNavParams();
  const info = getAnnotationPhase.useQuery({
    campaignID: campaignID ?? '',
    phase: phaseType ?? AnnotationPhaseType.Annotation,
  }, { skip: !campaignID || !phaseType })
  return useMemo(() => ({
    ...info,
    phase: info.data?.annotationPhaseByCampaignPhase,
  }), [ info ])
}

export const useEndPhase = () => {
  const [ method, info ] = endPhase.useMutation()
  return {
    endPhase: method,
    ...info,
  }
}

export const useCreateAnnotationPhase = () => {
  const [ method, info ] = createAnnotationPhase.useMutation()
  return {
    createAnnotationPhase: method,
    ...useMemo(() => {
      const formErrors = info.data?.updateAnnotationCampaign?.errors ?? []
      return {
        ...info,
        isSuccess: info.isSuccess && formErrors.length === 0,
        formErrors,
      }
    }, [ info ]),
  }
}

export const useCreateVerificationPhase = () => {
  const [ method, info ] = createVerificationPhase.useMutation()
  return {
    createVerificationPhase: method,
    ...info,
  }
}