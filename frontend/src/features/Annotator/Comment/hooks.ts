import { selectAllAnnotations, selectAnnotation, useUpdateAnnotation } from '@/features/Annotator/Annotation';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { addTaskComment, Comment, removeTaskComment, updateTaskComment } from './slice';
import { selectTaskComments } from './selectors';
import { useCallback } from 'react';
import { getNewItemID } from '@/service/function';


const useGetCommentAnnotation = () => {
  const allAnnotations = useAppSelector(selectAllAnnotations)

  return useCallback((comment: Comment) => {
    return allAnnotations.find(a => a.comments?.some(c => c.id === comment.id))
  }, [ allAnnotations ])
}

export const useAddComment = () => {
  const allAnnotations = useAppSelector(selectAllAnnotations)
  const focusedAnnotation = useAppSelector(selectAnnotation)
  const taskComments = useAppSelector(selectTaskComments)
  const updateAnnotation = useUpdateAnnotation()
  const dispatch = useAppDispatch();

  return useCallback((comment: string) => {
    const newComment: Comment = {
      id: getNewItemID([ ...allAnnotations.flatMap(a => a.comments?.filter(c => !!c).map(c => c!) ?? []), ...taskComments ]),
      comment,
    }
    if (focusedAnnotation) updateAnnotation(focusedAnnotation, { comments: [ ...(focusedAnnotation.comments ?? []), newComment ] })
    else dispatch(addTaskComment(newComment))
  }, [ dispatch, allAnnotations, taskComments, updateAnnotation, focusedAnnotation ])
}

export const useRemoveComment = () => {
  const getCommentAnnotation = useGetCommentAnnotation()
  const updateAnnotation = useUpdateAnnotation()
  const dispatch = useAppDispatch();

  return useCallback((comment: Comment) => {
    const annotation = getCommentAnnotation(comment)
    if (annotation) updateAnnotation(annotation, { comments: annotation.comments?.filter(c => c.id !== comment.id) })
    else dispatch(removeTaskComment(comment))
  }, [ dispatch, getCommentAnnotation, updateAnnotation ])
}

export const useUpdateComment = () => {
  const getCommentAnnotation = useGetCommentAnnotation()
  const remove = useRemoveComment()
  const updateAnnotation = useUpdateAnnotation()
  const dispatch = useAppDispatch();

  return useCallback((comment: Comment) => {
    if (comment.comment.trim().length === 0) {
      return remove(comment)
    }
    const annotation = getCommentAnnotation(comment)
    if (annotation) updateAnnotation(annotation, { comments: annotation.comments?.map(c => c.id === comment.id ? comment : c) })
    else dispatch(updateTaskComment(comment))
  }, [ dispatch, getCommentAnnotation, remove, updateAnnotation ])
}
