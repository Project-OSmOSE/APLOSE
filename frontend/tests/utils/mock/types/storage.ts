import { ImportStatusEnum } from '../../../../src/api/types.gql-generated';
import {
    type StorageAnalysisFragment,
    type StorageDatasetFragment,
    type StorageFolderFragment,
} from '../../../../src/features/Storage';

export const storageFolder: StorageFolderFragment = {
    __typename: 'FolderNode',
    name: 'Storage folder',
    path: 'test',
}
export const storageDataset: StorageDatasetFragment = {
    __typename: 'DatasetStorageNode',
    name: 'Storage dataset',
    path: 'test/dataset',
    importStatus: ImportStatusEnum.Available,
}
export const storageAnalysis: StorageAnalysisFragment = {
    __typename: 'AnalysisStorageNode',
    name: 'Storage analysis',
    path: 'test/dataset/processed/test_analysis',
    importStatus: ImportStatusEnum.Available,
}
