import { type AppState } from '@/features/App';
import { createSelector } from '@reduxjs/toolkit';
import { AnnotatorZoomSlice } from './slice'

export const selectZoom = createSelector(
    (state: AppState) => state.annotator,
    AnnotatorZoomSlice.selectors.selectZoom,
)

export const selectZoomOrigin = createSelector(
    (state: AppState) => state.annotator,
    AnnotatorZoomSlice.selectors.selectZoomOrigin,
)
