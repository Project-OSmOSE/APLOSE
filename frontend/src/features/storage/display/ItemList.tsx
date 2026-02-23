import React, { Fragment, useMemo } from 'react';
import { type StorageItem, useBrowseStorage, useStorageBrowse, useStorageSearch } from '@/api';
import { IonNote, IonSpinner } from '@ionic/react';
import { WarningText } from '@/components/ui';
import styles from './styles.module.scss';
import { AnalysisItem } from './AnalysisItem';
import { FolderItem } from './FolderItem';
import { DatasetItem } from './DatasetItem';

export const ItemList: React.FC<{
    parentNode?: StorageItem,
    search?: string,
    onUpdated?: () => void
}> = ({ parentNode, search, onUpdated }) => {
    const { isLoading, error } = useBrowseStorage({ path: parentNode?.path })
    const subfolders = useStorageBrowse(parentNode?.path)

    return useMemo(() => {
        if (isLoading) return <IonSpinner/>
        if (error) return <WarningText error={ error }/>
        if (!subfolders) return <WarningText>Cannot recover folders</WarningText>
        if (subfolders.length === 0) return <IonNote>Empty</IonNote>
        return <div className={ styles.list }>
            { subfolders.map((node, index) =>
                <Item key={ index } onUpdated={ onUpdated }
                      parentNode={ parentNode }
                      search={ search }
                      path={ node.path }/>,
            ) }
        </div>
    }, [ isLoading, error, subfolders, onUpdated, parentNode, search ])
}

export const Item: React.FC<{
    parentNode?: StorageItem,
    path: string,
    search?: string,
    onUpdated?: () => void,
    fixedOpen?: boolean;
}> = ({ path, parentNode, onUpdated, search, fixedOpen }) => {
    const item = useStorageSearch(path)

    return useMemo(() => {
        if (!item) return <Fragment/>
        switch (item.__typename) {
            case 'FolderNode':
                return <FolderItem folder={ item }
                                   search={ search }
                                   onUpdated={ onUpdated }
                                   fixedOpen={ fixedOpen }/>
            case 'DatasetStorageNode':
                return <DatasetItem dataset={ item }
                                    search={ search }
                                    onUpdated={ onUpdated }
                                    fixedOpen={ fixedOpen }/>
            case 'AnalysisStorageNode':
                return <AnalysisItem dataset={ parentNode! }
                                     analysis={ item }
                                     search={ search }
                                     onUpdated={ onUpdated }/>
        }
    }, [ item, parentNode, onUpdated, search, fixedOpen ])
}
