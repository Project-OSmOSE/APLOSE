import { api } from './input.generated.ts'

const Tags = [ 'DatasetsAndAnalysis' ]

export const InputDataAPI = api.enhanceEndpoints<typeof Tags[number]>({
  addTagTypes: Tags,
  endpoints: {
    getDatasetsAndAnalysis: { providesTags: [ 'DatasetsAndAnalysis' ] },
  }
})
