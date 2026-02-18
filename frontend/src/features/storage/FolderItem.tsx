import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { type StorageFolder, useBrowseStorage } from '@/api';
import { AltArrowDown, AltArrowRight, Folder as FolderIcon, FolderOpen } from '@solar-icons/react';
import { IonNote, IonSpinner } from '@ionic/react';
import { WarningText } from '@/components/ui';
import { Item } from './Item';
import styles from './styles.module.scss';


export const FolderItem: React.FC<{
    folder: StorageFolder
}> = ({ folder }) => {
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    const toggleOpen = useCallback(() => {
        setIsOpen(prev => !prev);
    }, [ setIsOpen ])

    const { subfolders: subfolders, isLoading, error } = useBrowseStorage({ path: folder.path }, {
        skip: !isOpen,
    })

    const folderList = useMemo(() => {
        if (!isOpen) return <Fragment/>
        if (isLoading) return <IonSpinner/>
        if (error) return <WarningText error={ error }/>
        if (!subfolders) return <WarningText>Cannot recover folders</WarningText>
        if (subfolders.length === 0) return <IonNote>Empty</IonNote>
        return <div className={ styles.list }>
            { subfolders.map((node, index) =>
                <Item key={ index } node={ node }/>,
            ) }
        </div>
    }, [ isLoading, error, subfolders ])


    return <div className={ styles.item }>
        <div onClick={ toggleOpen } className={ styles.folder }>
            { isOpen ? <FolderOpen size={ 24 } weight="Linear"/> : <FolderIcon size={ 24 } weight="Linear"/> }
            <p>{ folder.name }</p>
            <IonNote>{ isOpen ? <AltArrowDown/> : <AltArrowRight/> }</IonNote>
        </div>

        { folderList }
    </div>
}
