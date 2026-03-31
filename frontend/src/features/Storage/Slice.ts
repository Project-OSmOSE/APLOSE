import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type CreateCampaignMutation, TaskStatusEnum } from '@/api';
import { AnnotationCampaignGqlAPI } from '@/api/annotation-campaign/api';
import type { BackgroundTaskUpdateEvent } from '@/features/BackgroundTask';

import {
    API,
    type BrowseStorageQuery,
    type BrowseStorageQueryVariables,
    type ImportDatasetFromStorageMutation,
    type SearchStorageQuery,
} from './api';
import type { StorageItem } from './types';

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
        onTaskUpdated: (state, { payload }: PayloadAction<BackgroundTaskUpdateEvent>) => {
            switch (payload.type) {
                case 'background_task_update':
                    // Update task status
                    for (const item of Object.values(state.record)) {
                        if (item.__typename !== 'AnalysisStorageNode') continue
                        for (const task of item.importTasks?.results ?? []) {
                            if (task?.id !== payload.data.id.toString()) continue
                            task.status = payload.data.status
                        }
                    }
                    return;
                case 'background_task_retry':
                    // Replace old task with new task
                    for (const item of Object.values(state.record)) {
                        if (item.__typename !== 'AnalysisStorageNode') continue
                        if (item.importTasks?.results?.find(t => t?.id === payload.data.old_task_id.toString())) {
                            item.importTasks.results = [ {
                                __typename: 'ImportAnalysisBackgroundTaskNode',
                                id: payload.data.new_task_id?.toString(),
                                status: TaskStatusEnum.Pending,
                            } ]
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

        builder.addMatcher(API.endpoints.importDatasetFromStorage.matchFulfilled,
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
        selectItem: (state, path) => state.record[path],
        selectRecord: state => state.record,
        selectParents: state => state.parents,
        selectInvalidatedPath: state => state.invalidatedPath,
        selectInvalidatedListPath: state => state.invalidatedListPaths,
    },
})
