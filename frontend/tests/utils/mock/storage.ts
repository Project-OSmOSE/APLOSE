import type { GqlQuery } from './_types';
import {
    BrowseStorageQuery,
    type ImportDataFromStorageMutation,
    type SearchStorageQuery,
} from '../../../src/features/Storage/api/queries.generated';
import { storageAnalysis, storageDataset, storageFolder } from './types';

export const STORAGE_QUERIES: {
    browseStorage: GqlQuery<BrowseStorageQuery, 'root' | 'folder' | 'dataset'>,
    searchStorage: GqlQuery<SearchStorageQuery, 'folder' | 'dataset'>,
} = {
    browseStorage: {
        defaultType: 'root',
        empty: { browse: [] },
        root: { browse: [ storageFolder ] },
        folder: { browse: [ storageDataset ] },
        dataset: { browse: [ storageAnalysis ] },
    },
    searchStorage: {
        defaultType: 'empty',
        empty: { search: null },
        folder: { search: storageFolder },
        dataset: { search: storageDataset },
    },
}

export const STORAGE_MUTATIONS: {
    importDataFromStorage: GqlQuery<ImportDataFromStorageMutation, never>
} = {
    importDataFromStorage: {
        defaultType: 'empty',
        empty: {},
    },
}
