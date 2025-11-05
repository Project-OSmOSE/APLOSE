import { AnnotationCommentInput, type AnnotationCommentNode, type Maybe } from '@/api';
import { Comment } from './slice'

export function convertCommentsToPost(comments: Comment[]): AnnotationCommentInput[] {
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
