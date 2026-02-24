import type { BrowseStorageQuery } from '@/api/storage/storage.generated';

type N<T> = NonNullable<T>
export type StorageItem = N<N<BrowseStorageQuery['browse']>[number]>
export type StorageFolder = Extract<StorageItem, {__typename: 'FolderNode'}>
export type StorageDataset = Extract<StorageItem, {__typename: 'DatasetStorageNode'}>
export type StorageAnalysis = Extract<StorageItem, {__typename: 'AnalysisStorageNode'}>
