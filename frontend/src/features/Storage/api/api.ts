import { api } from './queries.generated'


export const API = api.enhanceEndpoints({
    endpoints: {
        importDatasetFromStorage: {
            invalidatesTags: [ 'Dataset', 'DatasetsAndAnalysis' ],
        },
    },
})
