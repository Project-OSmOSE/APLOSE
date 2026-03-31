import React, { useMemo } from 'react';
import { type StorageFolder } from '@/api';
import { Folder as FolderIcon, FolderOpen } from '@solar-icons/react';
import styles from '../styles.module.scss';
import { ItemList } from '../ItemList';
import { Structure } from './_Structure'

export const FolderItem: React.FC<{
    item: StorageFolder,
    forceOpen?: boolean,
    search?: string,
    onUpdated?: () => void,
}> = ({ item, forceOpen, search, onUpdated }) => {

    return useMemo(() =>
            <Structure itemClassName={ styles.folder }
                       openable forceOpen={ forceOpen }
                       error={ item.error }
                       errorStack={ item.stack }
                       name={ <p>{ item.name }</p> }
                       icon={ <FolderIcon size={ 24 } weight="Linear"/> }
                       openIcon={ <FolderOpen size={ 24 } weight="Linear"/> }>
                <ItemList search={ search }
                                  parentNode={ item }
                                  onUpdated={ onUpdated }/>
            </Structure>,
        [ item, forceOpen, search, onUpdated ],
    )
}