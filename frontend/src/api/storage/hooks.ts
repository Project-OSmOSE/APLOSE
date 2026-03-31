import type { BrowseStorageQuery, BrowseStorageQueryVariables, SearchStorageQueryVariables } from './storage.generated'
import { StorageGqlAPI } from './api'
import { useMemo } from 'react';

const {
    browseStorage,
    searchStorage,
    importDatasetFromStorage,
} = StorageGqlAPI.endpoints

function _mapData(data?: BrowseStorageQuery) {
    return data?.browse?.filter(d => d !== null)
}

export const useBrowseStorage = (vars?: BrowseStorageQueryVariables, options?: { skip?: boolean }) => {
    const info = browseStorage.useQuery({ path: vars?.path ?? '' }, options)
    return useMemo(() => ({ ...info, subfolders: _mapData(info.data) }), [ info ])
}

export const useSearchStorage = (vars: SearchStorageQueryVariables, options?: { skip?: boolean }) => {
    const info = searchStorage.useQuery(vars, options)
    return useMemo(() => ({ ...info, item: info.data?.search }), [ info ])
}

export const useImportDatasetFromStorage = () => {
    const [ method, { isSuccess, ...info } ] = importDatasetFromStorage.useMutation()

    return { isSuccess, ...info, doImport: method }
}
