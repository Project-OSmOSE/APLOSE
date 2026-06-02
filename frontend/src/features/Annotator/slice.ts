import { createSlice } from '@reduxjs/toolkit';
import { getAnnotationTaskFulfilled, type GetAnnotationTaskQueryVariables } from '@/api/annotation-task';

type AnnotatorState = {
    taskVariables?: GetAnnotationTaskQueryVariables;
}


export const AnnotatorSlice = createSlice({
    name: 'Annotator',
    initialState: {},
    reducers: {},
    extraReducers: builder => {
        builder.addMatcher(getAnnotationTaskFulfilled, (state: AnnotatorState, action: {
            meta: { arg: { originalArgs: GetAnnotationTaskQueryVariables } }
        }) => {
            state.taskVariables = action.meta.arg.originalArgs
        })
    },
    selectors: {
        selectTaskVariables: (state: AnnotatorState) => state.taskVariables,
    },
})
