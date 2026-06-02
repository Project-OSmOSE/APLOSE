import { api } from './dataset.generated'

export const DatasetGqlAPI = api.enhanceEndpoints({
  endpoints: {
    getDatasetByID: {
      // @ts-expect-error: result and error are unused
      providesTags: (result, error, args) => [ { type: 'DetailedDataset', id: JSON.stringify(args) } ]
    },
    listDatasetsAndAnalysis: { providesTags: [ 'DatasetsAndAnalysis' ] },
  }
})
