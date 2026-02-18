import { DatasetGqlAPI } from './api'
import { useMemo } from 'react';

const {
  listDatasets,
  listDatasetsAndAnalysis,
  getDatasetByID,
} = DatasetGqlAPI.endpoints

export const useDataset = ({ id }: { id?: string }) => {
  const info = getDatasetByID.useQuery({
    id: id ?? '',
  }, { skip: !id })
  return useMemo(() => ({ ...info, dataset: info.data?.datasetById }), [info])
}

export const useAllDatasets = () => {
  const info = listDatasets.useQuery()
  return useMemo(() => ({
    ...info,
    allDatasets: info.data?.allDatasets?.results.filter(d => d !== null).map(d => d!),
  }), [info])
}

export const useAllDatasetsAndAnalysis = () => {
  const info = listDatasetsAndAnalysis.useQuery()
  return useMemo(() => ({
    ...info,
    allDatasets: info.data?.allDatasets?.results.filter(d => d !== null).map(d => d!),
  }), [info])
}