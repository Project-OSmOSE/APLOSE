import { DatasetGqlAPI } from './api'
import { useMemo } from 'react';

const {
    listDatasetsAndAnalysis,
} = DatasetGqlAPI.endpoints

export const useAllDatasetsAndAnalysis = () => {
    const info = listDatasetsAndAnalysis.useQuery()
    return useMemo(() => ({
        ...info,
        allDatasets: info.data?.allDatasets?.results.filter(d => d !== null).map(d => d!),
    }), [ info ])
}