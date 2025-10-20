import { type AnnotationCommentNode, type Maybe, type PostAnnotationComment, useUpdateTaskComments } from '@/api';
import { useCallback, useEffect, useRef } from 'react';
import { useAnnotatorComment } from './hooks';
import { Comment } from './slice'

export function convertCommentsToPost(comments: Comment[]): PostAnnotationComment[] {
  return comments?.map(c => ({
    ...c,
    id: c.id > 0 ? c.id : undefined,
  }))
}

export function convertGqlToComments(comments: Maybe<Pick<AnnotationCommentNode, 'id' | 'comment'>>[]): Comment[] {
  return comments?.filter(c => !!c).map(c => ({
    id: +c!.id,
    comment: c!.comment,
  }))
}

export const useAnnotatorTaskCommentsPost = () => {
  const { updateTaskComments, ...info } = useUpdateTaskComments()
  const { taskComments } = useAnnotatorComment()

  const taskCommentsRef = useRef<Comment[]>(taskComments)
  useEffect(() => {
    taskCommentsRef.current = taskComments
  }, [ taskComments ]);

  const post = useCallback(async () => {
    await updateTaskComments(convertCommentsToPost(taskCommentsRef.current))
  }, [ updateTaskComments ])

  return {
    taskCommentsRef,
    postTaskComments: post,
    ...info,
  }
}
