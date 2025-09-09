import { api } from "./display-data.generated.ts";


const Tags = [ 'Dataset', 'SpectrogramAnalysis', 'DetailedDataset' ]

export const DisplayDataAPI = api.enhanceEndpoints<typeof Tags[number]>({
  addTagTypes: Tags,
  endpoints: {
    getDatasets: {
      providesTags: [ 'Dataset' ],
    },
    getSpectrogramAnalysis: {
      // @ts-expect-error: result and error are unused
      providesTags: (result, error, args) => [
        { type: 'SpectrogramAnalysis', id: JSON.stringify(args) }
      ]
    },
    getDatasetByPk: {
      // @ts-expect-error: result and error are unused
      providesTags: (result, error, args) => [ { type: 'DetailedDataset', id: JSON.stringify(args) } ]
    },
  }
})
