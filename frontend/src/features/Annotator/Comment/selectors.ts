import { createSelector } from '@reduxjs/toolkit';
import { selectAnnotator } from '@/features/Annotator/selectors';
import { AnnotatorCommentSlice } from './slice'
import { selectAnnotation } from '@/features/Annotator/Annotation/selectors';


export const selectTaskComments = createSelector(
  selectAnnotator, AnnotatorCommentSlice.selectors.selectTaskComments,
)

export const selectFocusedComment = createSelector(
  [
    selectTaskComments,
    selectAnnotation,
  ], (taskComments, annotation) => {
    let comments = taskComments
    if (annotation) comments = annotation.comments ?? []
    if (comments.length > 0) return comments[0]
    return undefined
  },
)
