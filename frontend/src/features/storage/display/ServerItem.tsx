import React from 'react';
import styles from './styles.module.scss';
import { ItemList } from './ItemList';

export const ServerItem: React.FC<{
    name: string,
    search?: string,
    onUpdated?: () => void
}> = ({ name, onUpdated, search }) => {
    return <div className={ styles.item }>
        <div className={ styles.folder }>
            <p>{ name }</p>
        </div>

        <ItemList onUpdated={ onUpdated } search={ search }/>
    </div>
}
