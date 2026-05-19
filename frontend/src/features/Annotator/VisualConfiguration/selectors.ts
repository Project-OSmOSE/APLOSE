import { createSelector } from '@reduxjs/toolkit';
import { selectAnalysis } from '@/features/Annotator/Analysis';
import { Colormap } from '@/features/Annotator/VisualConfiguration/colormaps';
import { AnnotatorVisualConfigurationSlice } from './slice';
import { selectAnnotatorCampaign } from '@/features/Annotator/selectors';
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


export const selectCanChangeColormap = createSelector(
    [
        selectAnnotatorCampaign,
        selectAnalysis,
    ],
    (campaignQuery, analysis) => {
        if (!campaignQuery.data?.annotationCampaignById?.allowColormapTuning) return false;
        return analysis?.colormap.name === 'Greys' as Colormap
    },
)
