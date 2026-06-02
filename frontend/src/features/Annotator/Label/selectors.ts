import { createSelector } from '@reduxjs/toolkit';
import { AnnotatorLabelSlice } from './slice';
import type { AppState } from '@/features/App';


export const selectHiddenLabels = createSelector(
    (state: AppState) => state.annotator,
    AnnotatorLabelSlice.selectors.selectHiddenLabels,
)

export const selectFocusLabel = createSelector(
    (state: AppState) => state.annotator,
    AnnotatorLabelSlice.selectors.selectFocus,
)
