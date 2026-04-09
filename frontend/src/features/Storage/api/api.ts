import { api } from './queries.generated'


export const API = api.enhanceEndpoints({
    endpoints: {
        importDataFromStorage: {
            invalidatesTags: [ 'Dataset', 'DatasetsAndAnalysis' ],
        },
    },
})
