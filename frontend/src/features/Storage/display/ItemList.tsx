import React, { useMemo } from 'react';
import { WarningText } from '@/components/ui';
import styles from './styles.module.scss';
import { Item } from './Item';
import { useQuery } from '@tanstack/react-query';
import { browseQuery, type StorageItemFragment } from '../api';
import { useStorageBrowse } from '../hooks';
import { Spinner } from '@/components/base/Spinner';
import { Note } from '@/components/base/Note';

export const ItemList: React.FC<{
    parentNode?: StorageItemFragment,
    search?: string,
    onUpdated?: () => void
}> = ({ parentNode, search, onUpdated }) => {
    const { isLoading, error } = useQuery(browseQuery({ path: parentNode?.path ?? '' }))
    const subfolders = useStorageBrowse(parentNode?.path)

    return useMemo(() => {
        if (isLoading) return <Spinner/>
        if (error) return <WarningText error={ error }/>
        if (!subfolders) return <WarningText>Cannot recover folders</WarningText>
        if (subfolders.length === 0) return <Note color="medium">Empty</Note>
        return <div className={ styles.list }>
            { subfolders.map((node, index) =>
                <Item key={ index } onUpdated={ onUpdated }
                      parentItem={ parentNode }
                      search={ search }
                      path={ node.path }/>,
            ) }
        </div>
    }, [ isLoading, error, subfolders, onUpdated, parentNode, search ])
}
