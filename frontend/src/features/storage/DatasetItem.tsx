import React, { Fragment, type MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Status, type StorageAnalysis, useBrowseStorage, useImportDatasetFromStorage } from '@/api';
import { IonButton, IonNote, IonSpinner } from '@ionic/react';
import { useToast, WarningText } from '@/components/ui';
import { AltArrowDown, AltArrowRight, CheckRead, FolderFavouriteStar, Unread } from '@solar-icons/react';

import { AnalysisItem } from './AnalysisItem';
import styles from './styles.module.scss';

export const DatasetItem: React.FC<{
    dataset: {
        name: string,
        path: string,
        importStatus?: Status
    },
    fixedOpen?: boolean;
    onUpdated?: () => void
}> = ({ dataset, fixedOpen, onUpdated }) => {
    const [ isOpen, setIsOpen ] = useState<boolean>(fixedOpen || false);
    const toggleOpen = useCallback(() => {
        if (fixedOpen) return;
        setIsOpen(prev => !prev);
    }, [ setIsOpen, fixedOpen ])

    const { subfolders, isLoading, error } = useBrowseStorage({ path: dataset.path }, {
        skip: !isOpen,
    })

    const analysisList = useMemo(() => {
        if (!isOpen) return <Fragment/>
        if (isLoading) return <IonSpinner/>
        if (error) return <WarningText error={ error }/>
        if (!subfolders) return <WarningText>Cannot recover folders</WarningText>
        if (subfolders.length === 0) return <IonNote>Empty</IonNote>
        return <div className={ styles.list }>
            { subfolders.map((node, index) =>
                <AnalysisItem key={ index } onUpdated={ onUpdated }
                              analysis={ node as StorageAnalysis }
                              dataset={ dataset }/>,
            ) }
        </div>
    }, [ isLoading, error, subfolders, dataset, onUpdated ])

    const { importDataset, isLoading: isImporting, error: importError } = useImportDatasetFromStorage()
    const toast = useToast()
    const canImport = useMemo(() => {
        return !isImporting && (dataset.importStatus === Status.Partial || dataset.importStatus === Status.Available);
    }, [ dataset, isImporting ])
    const download = useCallback((event: MouseEvent) => {
        event.stopPropagation()
        if (!canImport) return;
        importDataset({
            path: dataset.path,
        }).unwrap().finally(onUpdated)
    }, [ canImport, dataset, importDataset, onUpdated ])
    const importStatusIcon = useMemo(() => {
        if (isImporting) return <IonSpinner/>
        switch (dataset.importStatus) {
            case Status.Imported:
                return <CheckRead color="success" size={ 24 }/>
            case Status.Partial:
                return <Unread color="success" size={ 24 }/>
        }
        return <Fragment/>
    }, [ dataset, isImporting ])

    useEffect(() => {
        if (error) toast.raiseError({ error })
        if (importError) toast.raiseError({ error: importError })
    }, [ error, importError ]);
    useEffect(() => {
        return () => {
            toast.dismiss();
        }
    }, []);

    return <div className={ styles.item }>
        <div onClick={ toggleOpen } className={ styles.dataset }>
            <FolderFavouriteStar size={ 24 } weight="BoldDuotone"/>
            <p>{ dataset.name }</p>
            { importStatusIcon }
            { !fixedOpen && <IonNote>{ isOpen ? <AltArrowDown/> : <AltArrowRight/> }</IonNote> }
            { canImport && <IonButton size="small" fill="outline" onClick={ download }>
                Import
            </IonButton> }
        </div>

        { analysisList }
    </div>
}
