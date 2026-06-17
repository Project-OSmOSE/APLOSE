import { createSlice } from '@reduxjs/toolkit';
import type { StorageItemFragment } from '@/features/Storage';

export const Slice = createSlice({
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
        invalidatePath: (state, action: { payload: string }) => {
            state.invalidatedPath = [ ...state.invalidatedPath, action.payload ];
            state.invalidatedListPaths = [ ...state.invalidatedListPaths, action.payload ];
        },
    },
    selectors: {
        selectRecord: state => state.record,
        selectParents: state => state.parents,
        selectInvalidatedPath: state => state.invalidatedPath,
        selectInvalidatedListPath: state => state.invalidatedListPaths,
    },
})
