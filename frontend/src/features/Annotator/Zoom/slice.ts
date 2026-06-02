import { createSlice } from '@reduxjs/toolkit';

export type Point = { x: number; y: number }
type ZoomState = {
    zoom: number;
    zoomOrigin?: Point
}
const initialState: ZoomState = {
    zoom: 1,
    zoomOrigin: undefined,
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

        initCampaign: (state) => {
            state.zoom = initialState.zoom
        },
        initSpectrogram: (state) => {
            state.zoomOrigin = initialState.zoomOrigin
        },
    },
    selectors: {
        selectZoom: state => state.zoom,
        selectZoomOrigin: state => state.zoomOrigin,
    },
})

export const {
    setZoom,
    setZoomOrigin,
} = AnnotatorZoomSlice.actions

