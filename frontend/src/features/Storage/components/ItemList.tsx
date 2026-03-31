import React, { useMemo } from 'react';
import { type StorageItem, useBrowseStorage, useStorageBrowse } from '@/api';
import { IonNote, IonSpinner } from '@ionic/react';
import { GraphQLErrorText, WarningText } from '@/components/ui';
import styles from './styles.module.scss';
import { Item } from './Item';

export const ItemList: React.FC<{
    parentNode?: StorageItem,
    search?: string,
    onUpdated?: () => void
}> = ({ parentNode, search, onUpdated }) => {
    const { isLoading, error } = useBrowseStorage({ path: parentNode?.path ?? '' })
    const subfolders = useStorageBrowse(parentNode?.path)

    return useMemo(() => {
        if (isLoading) return <IonSpinner/>
        if (error) return <GraphQLErrorText error={ error }/>
        if (!subfolders) return <WarningText>Cannot recover folders</WarningText>
        if (subfolders.length === 0) return <IonNote>Empty</IonNote>
        return <div className={ styles.list }>
            { subfolders.map((node, index) =>
                <Item key={ index } onUpdated={ onUpdated }
                      parent={ parentNode?.__typename === 'DatasetStorageNode' ? parentNode : undefined }
                      search={ search }
                      path={ node.path }/>,
            ) }
        </div>
    }, [ isLoading, error, subfolders, onUpdated, parentNode, search ])
}
