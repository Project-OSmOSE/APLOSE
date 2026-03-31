import React, { useMemo } from 'react';
import { FolderFavouriteStar } from '@solar-icons/react';

import { DatasetName } from '@/features/Dataset';

import { ItemList } from '../ItemList';
import { Structure } from './_Structure'
import { Usages } from './_Usages';
import { type StorageDataset } from '../../types';
import styles from '../styles.module.scss';

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