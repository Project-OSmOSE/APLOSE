import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/service/app.ts";
import { Annotation, AnnotatorSlice, selectAnnotationID, selectComments } from "../slice";

export const useCommentsForAnnotator = () => {
  const allComments = useAppSelector(selectComments);
  const annotationID = useAppSelector(selectAnnotationID);
  const dispatch = useAppDispatch()

  const comment = useMemo(() => {
    return allComments.find(c => c.annotationId === annotationID)
  }, [ allComments, annotationID ]);

  const removeCurrent = useCallback(() => {
    if (comment) dispatch(AnnotatorSlice.actions.removeComment(comment))
  }, [ comment ])

  const updateCurrent = useCallback((content: string) => {
    if (content.trim().length === 0) {
      if (comment) removeCurrent()
      return;
    }
    if (comment) {
      dispatch(AnnotatorSlice.actions.assignComment({
        id: comment.id,
        partialUpdate: { comment: content }
      }))
    } else {
      dispatch(AnnotatorSlice.actions.addComment({
        comment: content,
        id: (Math.min(0, ...allComments.map(a => +a.id)) - 1).toString(),
      }))
    }
  }, [ comment, allComments, removeCurrent ])

  const getCommentForAnnotation = useCallback((annotation: Pick<Annotation, 'id'>) => {
    return allComments.find(c => c.annotationId === annotation.id)
  }, [ allComments, ])

  return {
    allComments, comment,
    removeCurrent, updateCurrent,
    getCommentForAnnotation
  }
}