import { createSelector } from '@reduxjs/toolkit';
import { AnnotatorUXSlice } from './slice';
import { selectFocusLabel } from '@/features/Annotator/Label';
import { selectAnnotator, selectTaskIsEditionAuthorized } from '@/features/Annotator/selectors';


const _selectIsDrawingEnabled = createSelector(
  selectAnnotator, AnnotatorUXSlice.selectors.selectIsDrawingEnabled,
)

export const selectIsDrawingEnabled = createSelector(
  [
    // Input selectors
    selectTaskIsEditionAuthorized,
    _selectIsDrawingEnabled,
  ],
  (isEditionAuthorized, isDrawingEnabled) => isEditionAuthorized && isDrawingEnabled,
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
    selectIsDrawingEnabled,
    selectFocusLabel,
  ],
  (isDrawingEnabled, focusedLabel) => isDrawingEnabled && !!focusedLabel,
)
