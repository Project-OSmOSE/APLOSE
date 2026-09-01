import { combineSlices } from '@reduxjs/toolkit';
import { AnnotatorAnnotationSlice } from './Annotation';
import { AnnotatorLabelSlice } from './Label';
import { AnnotatorConfidenceSlice } from './Confidence';
import { AnnotatorUXSlice } from './UX';
import { AnnotatorCommentSlice } from './Comment';

export const AnnotatorReducer = combineSlices(
    AnnotatorAnnotationSlice,
    AnnotatorLabelSlice,
    AnnotatorConfidenceSlice,
    AnnotatorUXSlice,
    AnnotatorCommentSlice,
)
