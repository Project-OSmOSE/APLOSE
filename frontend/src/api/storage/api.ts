import { api } from './storage.generated'

export const StorageGqlAPI = api.enhanceEndpoints({
    endpoints: {
        browseStorage: {
            providesTags: (_result, _error, args) => [
                { type: 'Folders', id: args?.path ?? '' },
            ],
        },
        searchStorage: {
            providesTags: (result) => [ { type: 'Folders', id: result?.search?.path ?? '' } ],
        },
    },
})
