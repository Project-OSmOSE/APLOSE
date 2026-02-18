import React, { useMemo } from 'react';
import { type StorageItem } from '@/api';
import { DatasetItem } from './DatasetItem';
import { FolderItem } from './FolderItem';

export const Item: React.FC<{
    node: StorageItem
}> = ({ node }) => {
    return useMemo(() => {
        switch (node.__typename) {
            case 'FolderNode':
                return <FolderItem folder={ node }/>
            case 'DatasetStorageNode':
                return <DatasetItem dataset={ node }/>
        }
    }, [ node ])
}
