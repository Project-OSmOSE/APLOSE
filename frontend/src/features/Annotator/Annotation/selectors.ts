import { createSelector } from '@reduxjs/toolkit';
import { selectAnnotator } from '@/features/Annotator/selectors';
import { AnnotatorAnnotationSlice } from './slice'


export const selectAnnotationID = createSelector(
  selectAnnotator, AnnotatorAnnotationSlice.selectors.selectID,
)

export const selectAllAnnotations = createSelector(
  selectAnnotator, AnnotatorAnnotationSlice.selectors.selectAllAnnotations,
)

export const selectTempAnnotation = createSelector(
  selectAnnotator, AnnotatorAnnotationSlice.selectors.selectTempAnnotation,
)

export const selectAnnotation = createSelector(
  [
    selectAllAnnotations,
    selectAnnotationID,
  ], (allAnnotations, id) => allAnnotations?.find(a => a.id === id),
)
