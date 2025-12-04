import { createSlice } from '@reduxjs/toolkit';
import { addAnnotation, removeAnnotation, updateAnnotation } from '@/features/Annotator/Annotation/slice';
import { getAnnotationTaskFulfilled, type GetAnnotationTaskQuery } from '@/api';
import { setZoom } from '@/features/Annotator/Zoom';
import { addTaskComment, removeTaskComment, updateTaskComment } from '@/features/Annotator/Comment/slice';
import type { GetAnnotationTaskQueryVariables } from '@/api/annotation-task/annotation-task.generated';

type UXState = {
  updated: boolean;
  allFileIsSeen: boolean;
  isDrawingEnabled: boolean;
  start: number;

  _campaignID?: string;
  _spectrogramID?: string;
  _zoom: number;
}

const initialState: UXState = {
  updated: false,
  allFileIsSeen: true, // Because initial zoom level == 1
  isDrawingEnabled: false,
  start: Date.now(),

  _campaignID: undefined,
  _spectrogramID: undefined,
  _zoom: 1,
}

export const AnnotatorUXSlice = createSlice({
  name: 'AnnotatorUX',
  initialState,
  reducers: {
    setIsDrawingEnabled: (state, action: { payload: boolean }) => {
      state.allFileIsSeen = action.payload;
    },
    setAllFileAsSeen: (state) => {
      state.allFileIsSeen = true;
    },
  },
  extraReducers: builder => {
    builder.addCase(addAnnotation, (state: UXState) => {
      state.updated = true
    })
    builder.addCase(addTaskComment, (state: UXState) => {
      state.updated = true
    })
    builder.addCase(updateAnnotation, (state: UXState) => {
      state.updated = true
    })
    builder.addCase(updateTaskComment, (state: UXState) => {
      state.updated = true
    })
    builder.addCase(removeAnnotation, (state: UXState) => {
      state.updated = true
    })
    builder.addCase(removeTaskComment, (state: UXState) => {
      state.updated = true
    })
    builder.addCase(setZoom, (state: UXState, action: { payload: number }) => {
      if (action.payload === 1) state.allFileIsSeen = true;
      state._zoom = action.payload
    })
    builder.addMatcher(getAnnotationTaskFulfilled, (state: UXState, action: {
      payload: GetAnnotationTaskQuery
      meta: { arg: { originalArgs: GetAnnotationTaskQueryVariables } }
    }) => {
      if (state._campaignID !== action.meta.arg.originalArgs.campaignID) {
        state._campaignID = action.meta.arg.originalArgs.campaignID
        state._zoom = initialState._zoom // See AnnotatorZoomSlice
      }
      state.updated = false
      state.allFileIsSeen = state._zoom === 1
      state.isDrawingEnabled = true
      state.start = Date.now()
    })
  },
  selectors: {
    selectIsDrawingEnabled: state => state.isDrawingEnabled,
    selectAllFileIsSeen: state => state.allFileIsSeen,
    selectUpdated: state => state.updated,
    selectStart: state => state.start,
  },
})

export const {
  setAllFileAsSeen,
  setIsDrawingEnabled,
} = AnnotatorUXSlice.actions
