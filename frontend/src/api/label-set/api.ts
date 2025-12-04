import { api } from './label-set.generated'

export const LabelSetGqlAPI = api.enhanceEndpoints({
  endpoints: {
    listLabelSets: {
      providesTags: [ 'LabelSet' ],
    },
  },
})
