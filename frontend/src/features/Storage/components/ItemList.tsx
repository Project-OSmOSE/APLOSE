import React, { useMemo } from 'react';
import { IonNote, IonSpinner } from '@ionic/react';

import { GraphQLErrorText, WarningText } from '@/components/ui';

import { Item } from './Item';
import type { StorageItem } from '../types';
import { useBrowse } from '../hook';
import styles from './styles.module.scss';
import { QueryStatus } from '@reduxjs/toolkit/query';

export const ItemList: React.FC<{
    parentNode?: StorageItem,
    search?: string,
    onUpdated?: () => void
}> = ({ parentNode, search, onUpdated }) => {
    const {
        children,
        status,
        error
    } = useBrowse(parentNode?.path)

    return useMemo(() => {
        switch (status) {
            case QueryStatus.uninitialized:
            case QueryStatus.pending:
                return <IonSpinner/>
            case QueryStatus.rejected:
                return <GraphQLErrorText error={ error }/>
            case QueryStatus.fulfilled:
                if (!children) return <WarningText>Cannot recover folders</WarningText>
                if (children.length === 0) return <IonNote>Empty</IonNote>
                return <div className={ styles.list }>
                    { children.map((node, index) =>
                        <Item key={ index } onUpdated={ onUpdated }
                              search={ search }
                              path={ node.path }/>,
                    ) }
                </div>
        }
    }, [ error, children, onUpdated, search ])
}
