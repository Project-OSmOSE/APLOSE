import { combineSlices } from '@reduxjs/toolkit';
import { AnnotatorZoomSlice } from './Zoom';
import { AnnotatorAnalysisSlice } from './Analysis';
import { AnnotatorVisualConfigurationSlice } from './VisualConfiguration';
import { AnnotatorAnnotationSlice } from './Annotation';
import { AnnotatorLabelSlice } from './Label';
import { AnnotatorConfidenceSlice } from './Confidence';
import { AnnotatorPointerSlice } from './Pointer';
import { AnnotatorUXSlice } from './UX';
import { AnnotatorCommentSlice } from './Comment';

export const AnnotatorReducer = combineSlices(
  AnnotatorAnalysisSlice,
  AnnotatorZoomSlice,
  AnnotatorVisualConfigurationSlice,
  AnnotatorAnnotationSlice,
  AnnotatorLabelSlice,
  AnnotatorConfidenceSlice,
  AnnotatorPointerSlice,
  AnnotatorUXSlice,
  AnnotatorCommentSlice,
)
