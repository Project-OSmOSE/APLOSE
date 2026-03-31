import React, { useMemo } from 'react';
import { FolderFavouriteStar } from '@solar-icons/react';
import { type StorageDataset } from '@/api';
import { DatasetName } from '@/features/Dataset';
import styles from '../styles.module.scss';
import { Structure } from './_Structure'
import { ItemList } from '../ItemList';
import { Usages } from '@/features/Storage/components/Item/_Usages';

export const DatasetItem: React.FC<{
    item: StorageDataset,
    forceOpen?: boolean,
    search?: string,
    onUpdated?: () => void,
}> = ({ item, forceOpen, search, onUpdated }) => {

    return useMemo(() => {
        return <Structure itemClassName={ styles.dataset }
                          openable forceOpen={ forceOpen }
                          error={ item.error }
                          errorStack={ item.stack }
                          name={ <DatasetName name={ item.name } id={ item.model?.id } link/> }
                          icon={ <FolderFavouriteStar size={ 24 } weight="BoldDuotone"/> }
                          otherInfo={ <Usages item={ item }/> }>
            <ItemList search={ search }
                      parentNode={ item }
                      onUpdated={ onUpdated }/>
        </Structure>
    }, [ item, forceOpen, search, onUpdated ])
}