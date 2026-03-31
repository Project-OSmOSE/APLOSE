import type { StorageAnalysis, StorageDataset, StorageFolder } from '../../../../src/features/Storage';

export const storageFolder: StorageFolder = {
    __typename: 'FolderNode',
    name: 'Storage folder',
    path: 'test',
}
export const storageDataset: StorageDataset = {
    __typename: 'DatasetStorageNode',
    name: 'Storage dataset',
    path: 'test/dataset',
}
export const storageAnalysis: StorageAnalysis = {
    __typename: 'AnalysisStorageNode',
    name: 'Storage analysis',
    path: 'test/dataset/processed/test_analysis',
}
