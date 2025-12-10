import { type AppState } from '@/features/App';
import { selectAnnotator } from '@/features/Annotator/selectors';
import { createSelector } from '@reduxjs/toolkit';
import { AnnotatorZoomSlice } from './slice'
import { selectAnalysis } from '@/features/Annotator/Analysis';

export const selectZoom = createSelector(
  selectAnnotator, AnnotatorZoomSlice.selectors.selectZoom,
)

export const selectZoomOrigin = createSelector(
  selectAnnotator, AnnotatorZoomSlice.selectors.selectZoomOrigin,
)

export const selectZoomOutLevel = createSelector(
  selectZoom,
  (zoom) => zoom / 2 >= 1 ? zoom / 2 : undefined,
)

export const selectMaxZoom = createSelector(
  [
    // Input selectors
    selectAnalysis,
    // Pass through input arguments
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_state: AppState, _campaignID?: string) => undefined,
  ],
  (analysis) => analysis?.legacyConfiguration?.zoomLevel ?? 0,
)

export const selectZoomInLevel = createSelector(
  [
    // Input selectors
    selectMaxZoom,
    selectZoom,
    // Pass through input arguments
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_state: AppState, _campaignID?: string) => undefined,
  ],
  (maxZoom, zoom) => zoom * 2 <= 2 ** maxZoom ? zoom * 2 : undefined,
)
