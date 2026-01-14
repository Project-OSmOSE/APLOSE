import { selectAnnotator } from '@/features/Annotator/selectors';
import { AnnotatorPointerSlice } from './slice'
import { createSelector } from '@reduxjs/toolkit';

export const selectPosition = createSelector(
  selectAnnotator, AnnotatorPointerSlice.selectors.selectPosition,
)
