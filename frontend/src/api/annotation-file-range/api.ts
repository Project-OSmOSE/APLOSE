import { api } from './annotation-file-range.generated'

export const AnnotationFileRangeGqlAPI = api.enhanceEndpoints({
  endpoints: {
    listFileRanges: {
      // @ts-expect-error: result and error are unused
      providesTags: (result, error, args) => [ {
        type: 'AnnotationFileRange',
        id: JSON.stringify(args)
      } ],
    },
    updateFileRanges: {
      invalidatesTags: [ 'AnnotationFileRange', 'AnnotationTask', 'Campaign', 'AnnotationPhase' ]
    }
  }
})