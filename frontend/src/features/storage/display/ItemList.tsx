import React, { useMemo } from 'react';
import { type StorageItem, useBrowseStorage } from '@/api';
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
    const { subfolders, isLoading, error } = useBrowseStorage({ path: parentNode?.path })

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
                      node={ node }/>,
            ) }
        </div>
    }, [ isLoading, error, subfolders, onUpdated, parentNode, search ])
}

export const Item: React.FC<{
    parentNode?: StorageItem,
    node: StorageItem,
    search?: string,
    onUpdated?: () => void,
}> = ({ node, parentNode, onUpdated, search }) => {
    return useMemo(() => {
        switch (node.__typename) {
            case 'FolderNode':
                return <FolderItem folder={ node }
                                   search={ search }
                                   onUpdated={ onUpdated }/>
            case 'DatasetStorageNode':
                return <DatasetItem dataset={ node }
                                    search={ search }
                                    onUpdated={ onUpdated }/>
            case 'AnalysisStorageNode':
                return <AnalysisItem dataset={ parentNode! }
                                     analysis={ node }
                                     search={ search }
                                     onUpdated={ onUpdated }/>
        }
    }, [ node, parentNode, onUpdated, search ])
}
