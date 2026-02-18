import type { BrowseStorageQuery } from './storage.generated';

export * from './hooks'

type N<T> = NonNullable<T>
export type StorageItem = N<N<BrowseStorageQuery['browse']>[number]>
export type StorageFolder = StorageItem & {__typename: 'FolderNode'}
export type StorageDataset = StorageItem & {__typename: 'DatasetStorageNode'}
export type StorageAnalysis = StorageItem & {__typename: 'AnalysisStorageNode'}
