import { createSlice } from '@reduxjs/toolkit';
import { getAnnotationTaskFulfilled, type GetAnnotationTaskQuery } from '@/api';
import type { GetAnnotationTaskQueryVariables } from '@/api/annotation-task/annotation-task.generated';

export type Point = { x: number; y: number }
type ZoomState = {
  zoom: number;
  zoomOrigin?: Point

  _campaignID?: string;
}
const initialState: ZoomState = {
  zoom: 1,
  zoomOrigin: undefined,

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
    selectZoomOrigin: state => state.zoomOrigin,
  },
})

export const {
  setZoom,
  setZoomOrigin,
} = AnnotatorZoomSlice.actions

