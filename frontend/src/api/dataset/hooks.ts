import { DatasetGqlAPI } from './api'
import { useMemo } from 'react';

const {
  listDatasets,
  listDatasetsAndAnalysis,
  getDatasetByID,
  listAvailableDatasetsForImport,
  importDataset,
} = DatasetGqlAPI.endpoints

export const useDataset = ({ id }: { id?: string }) => {
  const info = getDatasetByID.useQuery({
    id: id ?? '',
  }, { skip: !id })
  return useMemo(() => ({ ...info, dataset: info.data?.datasetById }), [ info ])
}

export const useAllDatasets = () => {
  const info = listDatasets.useQuery()
  return useMemo(() => ({
    ...info,
    allDatasets: info.data?.allDatasets?.results.filter(d => d !== null).map(d => d!),
  }), [ info ])
}

export const useAllDatasetsAndAnalysis = () => {
  const info = listDatasetsAndAnalysis.useQuery()
  return useMemo(() => ({
    ...info,
    allDatasets: info.data?.allDatasets?.results.filter(d => d !== null).map(d => d!),
  }), [ info ])
}

export const useAvailableDatasetsForImport = () => {
  const info = listAvailableDatasetsForImport.useQuery({}, { refetchOnMountOrArgChange: true })
  return useMemo(() => ({
    ...info,
    availableDatasets: info.data?.allDatasetsAvailableForImport?.filter(d => d !== null).map(d => d!),
  }), [ info ])
}

export const useImportDataset = () => {
  const [ method, info ] = importDataset.useMutation()
  return { ...info, importDataset: method }
}