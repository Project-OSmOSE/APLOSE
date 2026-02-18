import React, { useCallback, useState } from 'react';
import { type StorageFolder } from '@/api';
import { AltArrowDown, AltArrowRight, Folder as FolderIcon, FolderOpen } from '@solar-icons/react';
import { IonNote } from '@ionic/react';
import { ItemList } from './ItemList';
import styles from './styles.module.scss';


export const FolderItem: React.FC<{
    folder: StorageFolder
    onUpdated?: () => void
    search?: string,
}> = ({ folder, onUpdated, search }) => {
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    const toggleOpen = useCallback(() => {
        setIsOpen(prev => !prev);
    }, [ setIsOpen ])

    return <div className={ styles.item }>
        <div onClick={ toggleOpen } className={ styles.folder }>
            { isOpen ? <FolderOpen size={ 24 } weight="Linear"/> : <FolderIcon size={ 24 } weight="Linear"/> }
            <p>{ folder.name }</p>
            <IonNote>{ isOpen ? <AltArrowDown/> : <AltArrowRight/> }</IonNote>
        </div>

        { isOpen && <ItemList parentNode={ folder } onUpdated={ onUpdated } search={ search }/> }
    </div>
}
