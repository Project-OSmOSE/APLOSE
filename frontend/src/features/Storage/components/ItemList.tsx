import React, { useMemo } from 'react';
import { IonNote, IonSpinner } from '@ionic/react';

import { GraphQLErrorText, WarningText } from '@/components/ui';

import { Item } from './Item';
import type { StorageItem } from '../types';
import { useBrowse } from '../hook';
import styles from './styles.module.scss';

export const ItemList: React.FC<{
    parentNode?: StorageItem,
    search?: string,
    onUpdated?: () => void
}> = ({ parentNode, search, onUpdated }) => {
    const {
        children,
        isLoading,
        error
    } = useBrowse(parentNode?.path)

    return useMemo(() => {
        if (isLoading) return <IonSpinner/>
        if (error) return <GraphQLErrorText error={ error }/>
        if (!children) return <WarningText>Cannot recover folders</WarningText>
        if (children.length === 0) return <IonNote>Empty</IonNote>
        return <div className={ styles.list }>
            { children.map((node, index) =>
                <Item key={ index } onUpdated={ onUpdated }
                      parent={ parentNode?.__typename === 'DatasetStorageNode' ? parentNode : undefined }
                      search={ search }
                      path={ node.path }/>,
            ) }
        </div>
    }, [ isLoading, error, children, onUpdated, parentNode, search ])
}
