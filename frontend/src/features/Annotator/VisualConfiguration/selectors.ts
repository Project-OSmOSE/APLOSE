import { createSelector } from '@reduxjs/toolkit';
import { selectAnalysis } from '@/features/Annotator/Analysis';
import { Colormap } from '@/features/Annotator/VisualConfiguration/colormaps';
import { AnnotatorVisualConfigurationSlice } from './slice';
import { selectAnnotator, selectAnnotatorCampaign } from '@/features/Annotator/selectors';

export const selectContrast = createSelector(
  selectAnnotator, AnnotatorVisualConfigurationSlice.selectors.selectContrast,
)

export const selectBrightness = createSelector(
  selectAnnotator, AnnotatorVisualConfigurationSlice.selectors.selectBrightness,
)

export const selectColormap = createSelector(
  selectAnnotator, AnnotatorVisualConfigurationSlice.selectors.selectColormap,
)

export const selectIsColormapReversed = createSelector(
  selectAnnotator, AnnotatorVisualConfigurationSlice.selectors.selectIsColormapReversed,
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
