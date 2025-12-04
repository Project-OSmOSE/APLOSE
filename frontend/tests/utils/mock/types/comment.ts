import type { AnnotationCommentNode } from '../../../../src/api/types.gql-generated';

export type Comment = Pick<AnnotationCommentNode, 'id' | 'comment'>

export const taskComment: Comment = {
  id: '1',
  comment: 'A task comment',
}

export const weakAnnotationComment: Comment = {
  id: '2',
  comment: 'A presence comment',
}
