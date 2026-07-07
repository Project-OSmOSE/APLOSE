import { combineSlices } from '@reduxjs/toolkit';
import { AnnotatorZoomSlice } from './Zoom';
import { AnnotatorAnnotationSlice } from './Annotation';
import { AnnotatorLabelSlice } from './Label';
import { AnnotatorConfidenceSlice } from './Confidence';
import { AnnotatorUXSlice } from './UX';
import { AnnotatorCommentSlice } from './Comment';

export const AnnotatorReducer = combineSlices(
    AnnotatorZoomSlice,
    AnnotatorAnnotationSlice,
    AnnotatorLabelSlice,
    AnnotatorConfidenceSlice,
    AnnotatorUXSlice,
    AnnotatorCommentSlice,
)
