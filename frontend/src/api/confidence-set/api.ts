import { api } from './confidence-set.generated'

export const ConfidenceSetGqlAPI = api.enhanceEndpoints({
  endpoints: {
    listConfidenceSets: {
      providesTags: [ 'ConfidenceSet' ]
    },
  }
})