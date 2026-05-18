import { createSelector } from '@reduxjs/toolkit';
import { AnnotatorAnnotationSlice } from './slice'
import type { AppState } from '@/features/App';


export const selectAnnotationID = createSelector(
    (state: AppState) => state.annotator,
    AnnotatorAnnotationSlice.selectors.selectID,
)

export const selectAllAnnotations = createSelector(
    (state: AppState) => state.annotator,
    AnnotatorAnnotationSlice.selectors.selectAllAnnotations,
)

export const selectTempAnnotation = createSelector(
    (state: AppState) => state.annotator,
    AnnotatorAnnotationSlice.selectors.selectTempAnnotation,
)

export const selectAnnotation = createSelector(
    [
        selectAllAnnotations,
        selectAnnotationID,
    ], (allAnnotations, id) => allAnnotations?.find(a => a.id === id),
)
