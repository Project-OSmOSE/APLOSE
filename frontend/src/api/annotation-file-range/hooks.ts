import { AnnotationFileRangeGqlAPI } from './api'
import { AnnotationPhaseType } from '@/api';
import { useMemo } from 'react';
import { useNavParams } from '@/features/UX';

const {
  listFileRanges,
  updateFileRanges,
} = AnnotationFileRangeGqlAPI.endpoints

export const useAllFileRanges = () => {
  const { campaignID, phaseType } = useNavParams();
  const info = listFileRanges.useQuery({
    campaignID: campaignID ?? '',
    phaseType: phaseType ?? AnnotationPhaseType.Annotation,
  }, {
    skip: !campaignID || !phaseType,
  })
  return useMemo(() => ({
    ...info,
    allFileRanges: info.data?.allAnnotationFileRanges?.results.filter(r => r !== null),
  }), [ info ])
}

export const useUpdateFileRanges = () => {
  const [ method, info ] = updateFileRanges.useMutation();

  return {
    updateFileRanges: method,
    ...useMemo(() => {
      const formErrors = info.data?.updateAnnotationPhaseFileRanges?.errors ?? []
      return {
        ...info,
        isSuccess: info.isSuccess && formErrors.length === 0,
        formErrors,
      }
    }, [ info ]),
  }

}