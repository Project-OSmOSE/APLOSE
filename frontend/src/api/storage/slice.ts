import { createSelector, createSlice } from '@reduxjs/toolkit';
import { StorageGqlAPI } from './api';
import type {
    BrowseStorageQuery,
    BrowseStorageQueryVariables,
    ImportAnalysisFromStorageMutation,
    ImportDatasetFromStorageMutation,
    SearchStorageQuery,
} from './storage.generated';
import type { StorageItem } from './types';
import { useEffect, useMemo } from 'react';
import { useAppSelector } from '@/features/App';
import { AnnotationCampaignGqlAPI } from '@/api/annotation-campaign/api';
import type { CreateCampaignMutation } from '@/api';

export const StorageSlice = createSlice({
    name: 'storage',
    initialState: {
        record: {} as Record<string, StorageItem>,
        parents: {} as Record<string, Array<string>>,
        invalidatedPath: [] as Array<string>,
        invalidatedListPaths: [] as Array<string>,
    },
    reducers: {},
    extraReducers: builder => {

        builder.addMatcher(StorageGqlAPI.endpoints.browseStorage.matchFulfilled,
            (state, action: {
                payload: BrowseStorageQuery,
                meta: { arg: { originalArgs: void | BrowseStorageQueryVariables } }
            }) => {
                for (const item of action.payload.browse ?? []) {
                    if (!item) continue
                    state.record[item.path] = item
                }
                let parentPath = ''
                if (action.meta.arg.originalArgs)
                    parentPath = action.meta.arg.originalArgs.path ?? ''
                state.parents[parentPath] = action.payload.browse?.filter(r => !!r).map(r => r?.path) ?? []
                state.invalidatedListPaths = state.invalidatedListPaths.filter(p => p !== parentPath)
            })

        builder.addMatcher(StorageGqlAPI.endpoints.searchStorage.matchFulfilled,
            (state, action: { payload: SearchStorageQuery }) => {
                if (!action.payload.search) return
                state.record[action.payload.search.path] = action.payload.search
                state.invalidatedPath = state.invalidatedPath.filter(p => p !== action.payload.search?.path)
            })

        builder.addMatcher(StorageGqlAPI.endpoints.importAnalysisFromStorage.matchFulfilled,
            (state, action: { payload: ImportAnalysisFromStorageMutation }) => {
                const path = action.payload.importAnalysis?.analysis.dataset.path
                if (!path) return
                state.invalidatedPath = [ ...state.invalidatedPath, path ]
                state.invalidatedListPaths = [ ...state.invalidatedListPaths, path ]
            })

        builder.addMatcher(StorageGqlAPI.endpoints.importDatasetFromStorage.matchFulfilled,
            (state, action: { payload: ImportDatasetFromStorageMutation }) => {
                const path = action.payload.importDataset?.dataset.path
                if (!path) return
                state.invalidatedPath = [ ...state.invalidatedPath, path ]
                state.invalidatedListPaths = [ ...state.invalidatedListPaths, path ]
            })

        builder.addMatcher(AnnotationCampaignGqlAPI.endpoints.createCampaign.matchFulfilled,
            (state, action: { payload: CreateCampaignMutation }) => {
                const path = action.payload.createAnnotationCampaign?.annotationCampaign?.dataset.path
                if (!path) return
                state.invalidatedPath = [ ...state.invalidatedPath, path ]
                state.invalidatedListPaths = [ ...state.invalidatedListPaths, path ]
            })

    },
    selectors: {
        selectRecord: state => state.record,
        selectParents: state => state.parents,
        selectInvalidatedPath: state => state.invalidatedPath,
        selectInvalidatedListPath: state => state.invalidatedListPaths,
    },
})

const selectRecord = createSelector(state => state, StorageSlice.selectors.selectRecord)
const selectParents = createSelector(state => state, StorageSlice.selectors.selectParents)
const selectInvalidatedPath = createSelector(state => state, StorageSlice.selectors.selectInvalidatedPath)
const selectInvalidatedListPath = createSelector(state => state, StorageSlice.selectors.selectInvalidatedListPath)

export const useStorageSearch = (path: string) => {
    const record = useAppSelector(selectRecord)
    const invalidatedPath = useAppSelector(selectInvalidatedPath)

    const [search] = StorageGqlAPI.endpoints.searchStorage.useLazyQuery()
    useEffect(() => {
        if (invalidatedPath.includes(path)) search({ path })
        if (!record[path]) search({ path })
    }, [invalidatedPath, path, record]);

    return useMemo(() => record[path], [ record, path ]);
}

export const useStorageBrowse = (path?: string) => {
    const record = useAppSelector(selectRecord)
    const parents = useAppSelector(selectParents)
    const invalidatedListPaths = useAppSelector(selectInvalidatedListPath)
    const children = useMemo(() => {
        const children = parents[path ?? '']
        if (children === undefined) return undefined;
        return Object.values(record).filter(r => children?.includes(r.path))
    }, [ record, path, parents ]);

    const [browse] = StorageGqlAPI.endpoints.browseStorage.useLazyQuery()
    useEffect(() => {
        if (invalidatedListPaths.includes(path ?? '')) browse({ path })
        if (children === undefined) browse({ path })
    }, [invalidatedListPaths, path, children]);

    return children
}

