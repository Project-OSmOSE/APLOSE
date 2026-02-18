import { api } from './storage.generated'

function getInvalidateTagsFromPath(path: string) {
    const splitPath = path.split('/')
    const allPaths = splitPath.map((p, i) => [ ...splitPath.slice(0, i), p ].join('/'))
    return [ ...allPaths.map(p => ({ type: 'Folders', id: p })), { type: 'Folders', id: '' } ]
}

export const StorageGqlAPI = api.enhanceEndpoints({
    endpoints: {
        browseStorage: {
            providesTags: (_result, _error, args) => [
                args ? { type: 'Folders', id: args.path ?? '' } : 'Folders',
            ],
        },
        importDatasetFromStorage: {
            invalidatesTags: (_result, _error, { path }) =>
                getInvalidateTagsFromPath(path),
        },
        importAnalysisFromStorage: {
            invalidatesTags: (_result, _error, { datasetPath }) =>
                getInvalidateTagsFromPath(datasetPath),
        },
    },
})
