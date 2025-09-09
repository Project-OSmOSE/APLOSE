import { api } from "./import-data.generated.ts";

const Tags = [ 'ImportDataset', 'ImportSpectrogramAnalysis' ]

const enhancedAPI = api.enhanceEndpoints<typeof Tags[number]>({
  addTagTypes: Tags,
  endpoints: {
    getAvailableDatasetsForImport: {
      providesTags: [ 'ImportDataset' ],
    },
    postDatasetForImport: {
      invalidatesTags: [ 'Dataset', 'DatasetsAndAnalysis' ]
    },
    getAvailableSpectrogramAnalysisForImport: {
      // @ts-expect-error: result and error are unused
      providesTags: (result, error, args) => [
        { type: 'ImportSpectrogramAnalysis', id: JSON.stringify(args) }
      ]
    },
    postAnalysisForImport: {
      invalidatesTags: (_, error) => error ? [] : [ 'Dataset', 'SpectrogramAnalysis' ]
    },
  }
})

export {
  enhancedAPI as ImportDataAPI,
}