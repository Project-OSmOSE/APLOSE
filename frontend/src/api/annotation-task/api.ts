import { api } from './annotation-task.generated'

export const AnnotationTaskGqlAPI = api.enhanceEndpoints({
  endpoints: {
    submitTask: {
      invalidatesTags: [ 'AnnotationPhase' ],
    },
  },
})
