import React, { useMemo } from 'react';
import { useBrowseStorage } from '@/api';
import { IonNote, IonSpinner } from '@ionic/react';
import { WarningText } from '@/components/ui';
import { Item } from './Item';
import styles from './styles.module.scss';

export const ServerItem: React.FC<{ name: string }> = ({ name }) => {
    const { subfolders: subfolders, isLoading, error } = useBrowseStorage()

    const folderList = useMemo(() => {
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
        <div className={ styles.folder }>
            <p>{ name }</p>
        </div>

        { folderList }
    </div>
}
