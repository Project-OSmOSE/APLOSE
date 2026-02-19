import { Status } from '../../../../src/api/types.gql-generated';
import { type StorageAnalysis, type StorageDataset, type StorageFolder } from '../../../../src/api/storage';

export const storageFolder: StorageFolder = {
    __typename: 'FolderNode',
    name: 'test',
    path: 'test',
}
export const storageDataset: StorageDataset = {
    __typename: 'DatasetStorageNode',
    name: 'dataset',
    path: 'test/dataset',
    importStatus: Status.Available,
}
export const storageAnalysis: StorageAnalysis = {
    __typename: 'AnalysisStorageNode',
    name: 'test_analysis',
    path: 'test/dataset/processed/test_analysis',
    importStatus: Status.Available,
}
