import { api } from './storage.generated'


export const StorageGqlAPI = api.enhanceEndpoints({
    endpoints: {
        importDatasetFromStorage: {
            invalidatesTags: [ 'Dataset', 'DatasetsAndAnalysis' ],
        },
        importAnalysisFromStorage: {
            invalidatesTags: [ 'Dataset', 'DatasetsAndAnalysis' ],
        },
    },
})
