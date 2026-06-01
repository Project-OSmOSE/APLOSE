import type { SearchStorageQueryVariables } from './storage.generated'
import { StorageGqlAPI } from './api'
import { useMemo } from 'react';

const {
    searchStorage,
    importDatasetFromStorage,
} = StorageGqlAPI.endpoints


export const useSearchStorage = (vars: SearchStorageQueryVariables, options?: { skip?: boolean }) => {
    const info = searchStorage.useQuery(vars, options)
    return useMemo(() => ({ ...info, item: info.data?.search }), [ info ])
}

export const useImportDatasetFromStorage = () => {
    const [ method, { isSuccess, ...info } ] = importDatasetFromStorage.useMutation()
    return { isSuccess, ...info, importDataset: method }
}
