import { createSlice } from '@reduxjs/toolkit';
import { getAnnotationTaskFulfilled, type GetAnnotationTaskQuery } from '@/api';
import type { GetAnnotationTaskQueryVariables } from '@/api/annotation-task/annotation-task.generated';
import type { ZoomMode } from '@/features/Spectrogram/Display';

export type Point = { x: number; y: number }
type ZoomState = {
    zoom: number;
    zoomOrigin?: Point;
    zoomMode: ZoomMode;

    _campaignID?: string;
}
const initialState: ZoomState = {
    zoom: 0,
    zoomOrigin: undefined,
    zoomMode: 'processed',

    _campaignID: undefined,
}

export const AnnotatorZoomSlice = createSlice({
    name: 'AnnotatorZoom',
    initialState,
    reducers: {
        setZoom: (state, action: { payload: number }) => {
            state.zoom = action.payload
        },
        setZoomOrigin: (state, action: { payload: Point | undefined }) => {
            state.zoomOrigin = action.payload
        },
        setZoomMode: (state, action: { payload: ZoomMode }) => {
            state.zoomMode = action.payload
        },
    },
    extraReducers: builder => {
        builder.addMatcher(getAnnotationTaskFulfilled, (state: ZoomState, action: {
            payload: GetAnnotationTaskQuery,
            meta: { arg: { originalArgs: GetAnnotationTaskQueryVariables } }
        }) => {
            if (state._campaignID !== action.meta.arg.originalArgs.campaignID) {
                state._campaignID = action.meta.arg.originalArgs.campaignID
                state.zoom = initialState.zoom
            }
            state.zoomOrigin = initialState.zoomOrigin
        })
    },
    selectors: {
        selectZoom: state => state.zoom,
        selectDisplayZoom: state => Math.pow(2, state.zoom),
        selectZoomOrigin: state => state.zoomOrigin,
        selectZoomMode: state => state.zoomMode,
    },
})

export const {
    setZoom,
    setZoomOrigin,
    setZoomMode,
} = AnnotatorZoomSlice.actions

