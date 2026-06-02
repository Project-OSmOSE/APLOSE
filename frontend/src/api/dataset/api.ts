import { api } from './dataset.generated'

export const DatasetGqlAPI = api.enhanceEndpoints({
  endpoints: {
    listDatasetsAndAnalysis: { providesTags: [ 'DatasetsAndAnalysis' ] },
  }
})
