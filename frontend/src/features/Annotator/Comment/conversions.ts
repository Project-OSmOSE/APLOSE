import { AnnotationCommentInput, type AnnotationCommentNode } from '@/api/types.gql-generated.ts';
import { Comment } from './slice'

export function convertCommentsToPost(comments: Comment[]): AnnotationCommentInput[] {
  return comments?.map(c => ({
    ...c,
    id: c.id > 0 ? c.id : undefined,
  }))
}

export function convertGqlToComments(comments: (Pick<AnnotationCommentNode, 'id' | 'comment'> | null)[]): Comment[] {
  return comments?.filter(c => !!c).map(c => ({
    id: +c!.id,
    comment: c!.comment,
  }))
}
