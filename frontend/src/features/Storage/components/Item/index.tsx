import React, { Fragment, useMemo } from 'react';

import { FolderItem } from './Folder'
import { DatasetItem } from './Dataset'
import { AnalysisItem } from './Analysis'
import type { StorageDataset } from '../../types';
import { useSearch } from '../../hook';

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
    const { item } = useSearch(path)

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
