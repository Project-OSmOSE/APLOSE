import { createSelector } from '@reduxjs/toolkit';
import { AnnotatorLabelSlice } from './slice';
import type { AppState } from '@/features/App';


export const selectHiddenLabelIds = createSelector(
    (state: AppState) => state.annotator,
    AnnotatorLabelSlice.selectors.selectHiddenLabelIds,
)

export const selectFocusLabelId = createSelector(
    (state: AppState) => state.annotator,
    AnnotatorLabelSlice.selectors.selectFocusId,
)
