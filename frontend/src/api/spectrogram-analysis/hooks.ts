import { SpectrogramAnalysisGqlAPI } from './api';
import { ListSpectrogramAnalysisQueryVariables } from '@/api';
import { useMemo } from 'react';

const {
  listSpectrogramAnalysis,
} = SpectrogramAnalysisGqlAPI.endpoints

export const useAllSpectrogramAnalysis = (variables: ListSpectrogramAnalysisQueryVariables | void) => {
  const info = listSpectrogramAnalysis.useQuery(variables)
  return useMemo(() => ({
    ...info,
    allSpectrogramAnalysis: info.data?.allSpectrogramAnalysis?.results.filter(r => r !== null),
  }), [info])
}
