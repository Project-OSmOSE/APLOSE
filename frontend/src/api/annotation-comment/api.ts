import { api } from './annotation-comment.generated'

export const AnnotationCommentGqlAPI = api.enhanceEndpoints({
  endpoints: {
    updateTaskComments: {
      invalidatesTags: ['AnnotationTask']
    }
  }
})
