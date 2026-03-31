import React, { Fragment, useMemo } from 'react';
import { type StorageDataset, useStorageSearch } from '@/api';
import { FolderItem } from './Folder'
import { DatasetItem } from './Dataset'
import { AnalysisItem } from './Analysis'

type Props = {
    path: string,
    parent?: StorageDataset,
    search?: string,
    onUpdated?: () => void,
    forceOpen?: boolean,
}

export const Item: React.FC<Props> = ({
                                          path,
                                          parent,
                                          ...props
                                      }) => {
    const item = useStorageSearch(path)

    return useMemo(() => {
        if (!item) return <Fragment/>
        switch (item.__typename) {
            case 'FolderNode':
                return <FolderItem item={ item } { ...props } />
            case 'DatasetStorageNode':
                return <DatasetItem item={ item } { ...props } />
            case 'AnalysisStorageNode':
                return <AnalysisItem item={ item } parent={ parent! } { ...props } />
        }
    }, [ item, props, parent ])
}
