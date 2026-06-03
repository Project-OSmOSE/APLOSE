import { createSelector } from '@reduxjs/toolkit';
import { AnnotatorVisualConfigurationSlice } from './slice';
import type { AppState } from '@/features/App';

export const selectContrast = createSelector(
    (state: AppState) => state.annotator,
    AnnotatorVisualConfigurationSlice.selectors.selectContrast,
)

export const selectBrightness = createSelector(
    (state: AppState) => state.annotator,
    AnnotatorVisualConfigurationSlice.selectors.selectBrightness,
)

export const selectColormap = createSelector(
    (state: AppState) => state.annotator,
    AnnotatorVisualConfigurationSlice.selectors.selectColormap,
)

export const selectIsColormapReversed = createSelector(
    (state: AppState) => state.annotator,
    AnnotatorVisualConfigurationSlice.selectors.selectIsColormapReversed,
)
