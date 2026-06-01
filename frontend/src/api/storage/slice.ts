import { createSelector, createSlice } from '@reduxjs/toolkit';
import { StorageGqlAPI } from './api';
import type { ImportDatasetFromStorageMutation, SearchStorageQuery } from './storage.generated';
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { AnnotationCampaignGqlAPI } from '@/api/annotation-campaign/api';
import type { CreateCampaignMutation } from '@/api';
import { useQuery } from '@tanstack/react-query';
import { Storage } from '@/features'
import type { StorageItemFragment } from '@/features/Storage';

export const StorageSlice = createSlice({
    name: 'storage',
    initialState: {
        record: {} as Record<string, StorageItemFragment>,
        parents: {} as Record<string, Array<string>>,
        invalidatedPath: [] as Array<string>,
        invalidatedListPaths: [] as Array<string>,
    },
    reducers: {
        setRecord: (state, action: { payload: StorageItemFragment }) => {
            state.record[action.payload.path] = action.payload;
        },
        setParents: (state, action: { payload: { parent: string, children: string[] } }) => {
            state.parents[action.payload.parent] = action.payload.children;
        },
        validatePath: (state, action: { payload: string }) => {
            state.invalidatedListPaths = state.invalidatedListPaths.filter(p => p !== action.payload);
        },
    },
    extraReducers: builder => {

        builder.addMatcher(StorageGqlAPI.endpoints.searchStorage.matchFulfilled,
            (state, action: { payload: SearchStorageQuery }) => {
                if (!action.payload.search) return
                state.record[action.payload.search.path] = action.payload.search
                state.invalidatedPath = state.invalidatedPath.filter(p => p !== action.payload.search?.path)
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

export const useStorageSearch = (path: string): StorageItemFragment | undefined => {
    const record = useAppSelector(selectRecord)
    const invalidatedPath = useAppSelector(selectInvalidatedPath)

    const [ search ] = StorageGqlAPI.endpoints.searchStorage.useLazyQuery()
    useEffect(() => {
        if (invalidatedPath.includes(path)) search({ path })
        if (!record[path]) search({ path })
    }, [ invalidatedPath, path, record ]);

    return useMemo(() => record[path], [ record, path ]);
}

export const useStorageBrowse = (path: string = '') => {
    const record = useAppSelector(selectRecord)
    const parents = useAppSelector(selectParents)
    const invalidatedListPaths = useAppSelector(selectInvalidatedListPath)
    const children = useMemo(() => {
        const children = parents[path]
        if (children === undefined) return undefined;
        return Object.values(record).filter(r => children?.includes(r.path))
    }, [ record, path, parents ]);

    const dispatch = useAppDispatch()

    const {
        refetch: browse,
        data,
    } = useQuery({
        ...Storage.API.browseQuery({ path }),
        enabled: false,
    })

    useEffect(() => {
        if (invalidatedListPaths.includes(path)) browse()
        if (children === undefined) browse()
    }, [ invalidatedListPaths, path, children ]);

    useEffect(() => {
        if (!data) return
        for (const item of data) {
            if (!item) continue
            dispatch(StorageSlice.actions.setRecord(item))
        }
        dispatch(StorageSlice.actions.setParents({
            parent: path,
            children: data.map(d => d.path),
        }))
        dispatch(StorageSlice.actions.validatePath(path))
    }, [ data ]);

    return children
}

