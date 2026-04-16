import React, { Fragment, type MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { ImportStatusEnum, type StorageItem, useImportDatasetFromStorage, useStorageSearch } from '@/api';
import styles from './styles.module.scss';
import { ItemList } from '@/features/Storage';
import { IonButton, IonNote, IonSpinner } from '@ionic/react';
import {
    AltArrowDown,
    AltArrowRight,
    CheckRead,
    FileFavourite,
    Folder as FolderIcon,
    FolderFavouriteStar,
    FolderOpen,
    InfoCircle,
    Unread,
} from '@solar-icons/react';
import { CopyErrorStackButton, TooltipOverlay, useToast } from '@/components/ui';
import { DatasetName } from '@/features/Dataset';

type Props = {
    parentItem?: StorageItem,
    path: string,
    search?: string,
    onUpdated?: () => void,
    forceOpen?: boolean,
    disableImport?: boolean,
}

export const Item: React.FC<Props> = ({
                                          path,
                                          parentItem,
                                          search,
                                          onUpdated,
                                          forceOpen,
                                          disableImport,
                                      }) => {
    const item = useStorageSearch(path)

    // Open
    const [ _isOpen, _setIsOpen ] = useState<boolean>(forceOpen || false);
    const isOpen = useMemo(() => {
        return item && !item.error && (forceOpen || _isOpen)
    }, [ _isOpen, item ])
    const canToggle = useMemo(() => {
        return item && !item.error && !forceOpen && item.__typename !== 'AnalysisStorageNode'
    }, [ forceOpen, item ])
    const toggleOpen = useCallback(() => {
        if (!canToggle) return;
        _setIsOpen(prev => !prev);
    }, [ _setIsOpen, canToggle ])

    // Import
    const { importDataset, isLoading } = useImportDatasetFromStorage()
    const toast = useToast()
    const canImport = useMemo(() => {
        if (!item || item.error || isLoading || disableImport) return false
        switch (item.__typename) {
            case 'FolderNode':
                return false
            case 'DatasetStorageNode':
            case 'AnalysisStorageNode':
                return parentItem && item.importStatus === ImportStatusEnum.Partial || item.importStatus === ImportStatusEnum.Available
        }
    }, [ item, isLoading, disableImport ])
    const download = useCallback((event: MouseEvent) => {
        event.stopPropagation()
        if (!canImport || !item) return;
        let importCall;
        switch (item.__typename) {
            case 'DatasetStorageNode':
                importCall = importDataset({
                    datasetPath: item.path,
                })
                break;
            case 'AnalysisStorageNode':
                importCall = importDataset({
                    analysisPath: item.path,
                    datasetPath: parentItem!.path,
                })
                break;
            default:
                return;
        }
        importCall.unwrap().catch(error => toast.raiseError({ gqlError: error })).finally(onUpdated)
    }, [ canImport, item, importDataset, onUpdated, parentItem, toast ])
    useEffect(() => {
        return () => {
            toast.dismiss();
        }
    }, []);

    return useMemo(() => {
        let rowIcon;
        let className;
        if (!item) return <Fragment/>
        switch (item.__typename) {
            case 'FolderNode':
                rowIcon = isOpen ? <FolderOpen size={ 24 } weight="Linear"/> : <FolderIcon size={ 24 } weight="Linear"/>
                className = styles.folder
                break;
            case 'DatasetStorageNode':
                rowIcon = <FolderFavouriteStar size={ 24 } weight="BoldDuotone"/>
                className = styles.dataset
                break;
            case 'AnalysisStorageNode':
                rowIcon = <FileFavourite size={ 24 } weight="BoldDuotone"/>
                className = styles.analysis
                break;
        }
        let importIcon = <Fragment/>;
        let usages = 0;
        if (item.__typename !== 'FolderNode') {
            switch (item.importStatus) {
                case ImportStatusEnum.Imported:
                    importIcon = <CheckRead color="success" size={ 24 }/>
                    break;
                case ImportStatusEnum.Partial:
                    importIcon = <Unread color="success" size={ 24 }/>
                    break;
            }
            usages = item.model?.annotationCampaigns.edges
                .map(e => e?.node)
                .filter(n => !!n && !n.isArchived).length ?? 0
        }

        return <div className={ styles.item }>
            <div onClick={ toggleOpen } className={ className }>
                { rowIcon }
                { item.__typename === 'DatasetStorageNode' ?
                    <DatasetName name={ item.name } id={ item.model?.id } link/>
                    : <p>{ item.name }</p> }

                {/* Import Icon */ }
                { isLoading ? <IonSpinner/> : importIcon }

                {/* Use Icon */ }
                { usages > 0 && <TooltipOverlay tooltipContent={ `Currently used in ${ usages } campaigns.` }>
                    <InfoCircle size={ 24 } color="medium"/>
                </TooltipOverlay> }

                {/* Open Icon */ }
                { canToggle && <IonNote>{ isOpen ? <AltArrowDown/> : <AltArrowRight/> }</IonNote> }

                {/* Import button */ }
                { canImport && <IonButton size="small" fill="outline" onClick={ download }>
                    Import
                </IonButton> }

                {/* Error */ }
                { item.error && <Fragment>
                    <IonNote color="danger">{ item.error }</IonNote>
                    <CopyErrorStackButton stack={ item.stack }/>
                </Fragment> }
            </div>

            { isOpen && <ItemList search={ search } parentNode={ item } onUpdated={ onUpdated }/> }
        </div>
    }, [ item, isOpen, isLoading, search, onUpdated, toggleOpen, canToggle, canImport, download ])
}