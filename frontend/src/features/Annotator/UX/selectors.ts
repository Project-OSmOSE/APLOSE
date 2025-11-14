import { createSelector } from '@reduxjs/toolkit';
import { AnnotatorUXSlice } from './slice';
import { selectFocusLabel } from '@/features/Annotator/Label';
import { selectAnnotator, selectTaskIsEditionAuthorized } from '@/features/Annotator/selectors';


export const selectIsDrawingEnabled = createSelector(
  selectAnnotator, AnnotatorUXSlice.selectors.selectIsDrawingEnabled,
)

export const selectAllFileIsSeen = createSelector(
  selectAnnotator, AnnotatorUXSlice.selectors.selectAllFileIsSeen,
)

export const selectUpdated = createSelector(
  selectAnnotator, AnnotatorUXSlice.selectors.selectUpdated,
)

export const selectStart = createSelector(
  selectAnnotator,
  (state) => new Date(AnnotatorUXSlice.selectors.selectStart(state)),
)

export const selectCanDraw = createSelector(
  [
    // Input selectors
    selectTaskIsEditionAuthorized,
    selectIsDrawingEnabled,
    selectFocusLabel,
  ],
  (isEditionAuthorized, isDrawingEnabled, focusedLabel) => isEditionAuthorized && isDrawingEnabled && !!focusedLabel,
)
