import { api } from './annotation-file-range.generated'

export const AnnotationFileRangeGqlAPI = api.enhanceEndpoints({
  endpoints: {
    updateFileRanges: {
      invalidatesTags: [ 'AnnotationFileRange', 'AnnotationTask', 'Campaign', 'AnnotationPhase' ]
    }
  }
})