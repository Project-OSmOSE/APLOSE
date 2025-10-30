import { api } from './annotation-task.generated'

export const AnnotationTaskGqlAPI = api.enhanceEndpoints({
  endpoints: {
    listAnnotationTask: {
      // @ts-expect-error: result and error are unused
      providesTags: (result, error, args) => [ {
        type: 'AnnotationTask',
        id: JSON.stringify(args),
      } ],
    },
    getAnnotationTask: {
      // @ts-expect-error: result and error are unused
      providesTags: (result, error, args) => [ {
        type: 'AnnotationTask',
        id: JSON.stringify(args),
      } ],
    },
    submitTask: {
      invalidatesTags: [ 'AnnotationTask', 'AnnotationPhase', ]
    }
  },
})
