import { SpectrogramAnalysisGqlAPI } from './api';
import { ListSpectrogramAnalysisQueryVariables } from '@/api';
import { useMemo } from 'react';

const {
  listSpectrogramAnalysis,
  listAvailableSpectrogramAnalysisForImport,
  importSpectrogramAnalysis,
} = SpectrogramAnalysisGqlAPI.endpoints

export const useAllSpectrogramAnalysis = (variables: ListSpectrogramAnalysisQueryVariables | void) => {
  const info = listSpectrogramAnalysis.useQuery(variables)
  return useMemo(() => ({
    ...info,
    allSpectrogramAnalysis: info.data?.allSpectrogramAnalysis?.results.filter(r => r !== null),
  }), [ info ])
}

export const useAvailableSpectrogramAnalysisForImport = ({ datasetID }: { datasetID?: string }) => {
  const info = listAvailableSpectrogramAnalysisForImport.useQuery({
    datasetID: datasetID ?? '',
  }, {
    refetchOnMountOrArgChange: true,
    skip: !datasetID,
  })
  return useMemo(() => ({
    ...info,
    availableSpectrogramAnalysis: info.data?.allSpectrogramAnalysisForImport?.filter(d => d !== null).map(d => d!),
    dataset: info?.data?.datasetById,
  }), [ info ])
}

export const useImportSpectrogramAnalysis = () => {
  const [ method, info ] = importSpectrogramAnalysis.useMutation()
  return { ...info, importSpectrogramAnalysis: method }
}