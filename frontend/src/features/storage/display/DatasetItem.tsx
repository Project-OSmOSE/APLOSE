import React, { Fragment, type MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Status, type StorageDataset, useImportDatasetFromStorage } from '@/api';
import { IonButton, IonNote, IonSpinner } from '@ionic/react';
import { TooltipOverlay, useToast } from '@/components/ui';
import { AltArrowDown, AltArrowRight, CheckRead, FolderFavouriteStar, InfoCircle, Unread } from '@solar-icons/react';
import { DatasetName } from '@/features/Dataset';
import styles from './styles.module.scss';
import { ItemList } from './ItemList';

export const DatasetItem: React.FC<{
    dataset: StorageDataset,
    fixedOpen?: boolean;
    search?: string,
    onUpdated?: () => void
}> = ({ dataset, fixedOpen, onUpdated, search }) => {
    const [ isOpen, setIsOpen ] = useState<boolean>(fixedOpen || false);
    const toggleOpen = useCallback(() => {
        if (fixedOpen) return;
        setIsOpen(prev => !prev);
    }, [ setIsOpen, fixedOpen ])

    const { importDataset, isLoading, error } = useImportDatasetFromStorage()
    const toast = useToast()
    const canImport = useMemo(() => {
        return !isLoading && (dataset.importStatus === Status.Partial || dataset.importStatus === Status.Available);
    }, [ dataset, isLoading ])
    const download = useCallback((event: MouseEvent) => {
        event.stopPropagation()
        if (!canImport) return;
        importDataset({
            path: dataset.path,
        }).unwrap().finally(onUpdated)
    }, [ canImport, dataset, importDataset, onUpdated ])
    const importStatusIcon = useMemo(() => {
        if (isLoading) return <IonSpinner/>
        switch (dataset.importStatus) {
            case Status.Imported:
                return <CheckRead color="success" size={ 24 }/>
            case Status.Partial:
                return <Unread color="success" size={ 24 }/>
        }
        return <Fragment/>
    }, [ dataset, isLoading ])

    const inUseWarning = useMemo(() => {
        const campaigns = dataset.model?.annotationCampaigns.edges
            .map(e => e?.node)
            .filter(n => !!n && !n.isArchived) ?? []
        if (campaigns.length > 0)
            return <TooltipOverlay tooltipContent={ `Dataset is currently used in ${ campaigns.length } campaigns.` }>
                <InfoCircle size={ 24 } color='medium'/>
            </TooltipOverlay>
        return <Fragment/>
    }, [ dataset ])

    useEffect(() => {
        if (error) toast.raiseError({ error: error })
    }, [ error ]);
    useEffect(() => {
        return () => {
            toast.dismiss();
        }
    }, []);

    return <div className={ styles.item }>
        <div onClick={ toggleOpen } className={ styles.dataset }>
            <FolderFavouriteStar size={ 24 } weight="BoldDuotone"/>
            <DatasetName name={ dataset.name } id={ dataset.model?.id } link/>
            { importStatusIcon }
            { inUseWarning }
            { !fixedOpen && <IonNote>{ isOpen ? <AltArrowDown/> : <AltArrowRight/> }</IonNote> }
            { canImport && <IonButton size="small" fill="outline" onClick={ download }>
                Import
            </IonButton> }
        </div>

        { isOpen && <ItemList search={ search } parentNode={ dataset } onUpdated={ onUpdated }/> }
    </div>
}
