import { useAnnotatorAnnotation } from '@/features/Annotator/Annotation';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { addTaskComment, Comment, removeTaskComment, selectTaskComments, updateTaskComment } from './slice';
import { useCallback, useMemo } from 'react';
import { getNewItemID } from '@/service/function';

export const useAnnotatorComment = () => {
  const { allAnnotations, focusedAnnotation, updateAnnotation } = useAnnotatorAnnotation()
  const taskComments = useAppSelector(state => selectTaskComments(state.annotator))
  const dispatch = useAppDispatch();

  const focusedComment = useMemo(() => {
    let comments = taskComments
    if (focusedAnnotation) comments = focusedAnnotation.comments ?? []
    if (comments.length > 0) return comments[0]
    return undefined
  }, [ focusedAnnotation, taskComments ])

  const getCommentAnnotation = useCallback((comment: Comment) => {
    return allAnnotations.find(a => a.comments?.some(c => c.id === comment.id))
  }, [ allAnnotations ])

  const add = useCallback((comment: string) => {
    const newComment: Comment = {
      id: getNewItemID([ ...allAnnotations.flatMap(a => a.comments?.filter(c => !!c).map(c => c!) ?? []), ...taskComments ]),
      comment,
    }
    if (focusedAnnotation) updateAnnotation(focusedAnnotation, { comments: [ ...(focusedAnnotation.comments ?? []), newComment ] })
    else dispatch(addTaskComment(newComment))
  }, [ allAnnotations, taskComments, updateAnnotation, focusedAnnotation ])

  const remove = useCallback((comment: Comment) => {
    const annotation = getCommentAnnotation(comment)
    if (annotation) updateAnnotation(annotation, { comments: annotation.comments?.filter(c => c.id !== comment.id) })
    else dispatch(removeTaskComment(comment))
  }, [ getCommentAnnotation, updateAnnotation ])

  const update = useCallback((comment: Comment) => {
    if (comment.comment.trim().length === 0) {
      return remove(comment)
    }
    const annotation = getCommentAnnotation(comment)
    if (annotation) updateAnnotation(annotation, { comments: annotation.comments?.map(c => c.id === comment.id ? comment : c) })
    else dispatch(updateTaskComment(comment))
  }, [ getCommentAnnotation, remove ])

  return {
    taskComments,
    focusedComment,
    add,
    update,
    remove,
  }
}
