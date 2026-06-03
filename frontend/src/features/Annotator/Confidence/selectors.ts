import { createSelector } from '@reduxjs/toolkit';
import { AnnotatorConfidenceSlice } from './slice';
import type { AppState } from '@/features/App';


export const selectFocusConfidence = createSelector(
    (state: AppState) => state.annotator,
    AnnotatorConfidenceSlice.selectors.selectFocus,
)

export const selectDefaultConfidence = createSelector(
    (state: AppState) => state.annotator,
    AnnotatorConfidenceSlice.selectors.selectDefault,
)
