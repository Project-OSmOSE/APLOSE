import type { GqlQuery } from './_types';
import { BrowseStorageQuery } from '../../../src/api/storage/storage.generated';
import { storageAnalysis, storageDataset, storageFolder } from './types';

export const STORAGE_QUERIES: {
    browseStorage: GqlQuery<BrowseStorageQuery, 'root' | 'folder' | 'dataset'>,
} = {
    browseStorage: {
        defaultType: 'root',
        empty: { browse: [] },
        root: { browse: [ storageFolder ] },
        folder: { browse: [ storageDataset ] },
        dataset: { browse: [ storageAnalysis ] },
    },
}
