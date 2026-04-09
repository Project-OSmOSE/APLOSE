import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type CreateCampaignMutation } from '@/api';
import { AnnotationCampaignGqlAPI } from '@/api/annotation-campaign/api';

import {
    API,
    type BrowseStorageQuery,
    type BrowseStorageQueryVariables,
    type ImportDataFromStorageMutation,
    type SearchStorageQuery,
} from './api';
import type { StorageItem } from './types';
import type { BackgroundTaskEvent } from '@/features/BackgroundTask';

export const Slice = createSlice({
    name: 'Storage',
    reducerPath: 'Storage',
    initialState: {
        record: {} as Record<string, StorageItem>,
        parents: {} as Record<string, Array<string>>,
        invalidatedPath: [] as Array<string>,
        invalidatedListPaths: [] as Array<string>,
    },
    reducers: {
        onTaskUpdated: (state, { payload }: PayloadAction<BackgroundTaskEvent>) => {
            switch (payload.type) {
                case 'info':
                    // Update task status
                    for (const item of Object.values(state.record)) {
                        if (item.__typename !== 'AnalysisStorageNode') continue
                        if (item.importTask?.identifier == payload.identifier) {
                            item.importTask!.status = payload.data.status
                        }
                    }
                    return;
            }
        },
    },
    extraReducers: builder => {

        builder.addMatcher(API.endpoints.browseStorage.matchFulfilled,
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

        builder.addMatcher(API.endpoints.searchStorage.matchFulfilled,
            (state, action: { payload: SearchStorageQuery }) => {
                if (!action.payload.search) return
                state.record[action.payload.search.path] = action.payload.search
                state.invalidatedPath = state.invalidatedPath.filter(p => p !== action.payload.search?.path)
            })

        builder.addMatcher(API.endpoints.importDataFromStorage.matchFulfilled,
            (state, action: { payload: ImportDataFromStorageMutation }) => {
                const path = action.payload.importData?.dataset.path
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
        selectItem: (state, path) => state.record[path],
        selectRecord: state => state.record,
        selectParents: state => state.parents,
        selectInvalidatedPath: state => state.invalidatedPath,
        selectInvalidatedListPath: state => state.invalidatedListPaths,
    },
})
