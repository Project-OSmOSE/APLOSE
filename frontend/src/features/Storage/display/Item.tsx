import React, { Fragment, type MouseEvent, useCallback, useMemo, useState } from 'react';
import { ImportStatusEnum } from '@/api';
import styles from './styles.module.scss';
import {
    type ImportDatasetFromStorageMutationVariables,
    ItemList,
    type StorageAnalysisFragment,
    type StorageItemFragment,
    StorageSlice,
} from '@/features/Storage';
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
import { Toast } from '@/components/base/Toast';
import { DatasetName } from '@/features/Dataset';
import { importMutation } from '../api'
import { useStorageSearch } from '../hooks'
import { useMutation } from '@tanstack/react-query';
import { useAppDispatch } from '@/features/App';
import { Button, CopyErrorStackButton } from '@/components/base/Button';
import { Spinner } from '@/components/base/Spinner';
import { Note } from '@/components/base/Note';
import { Popover } from '@/components/base/Popover';

type Props = {
    parentItem?: StorageItemFragment,
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
    const toastManager = Toast.useToastManager()
    const dispatch = useAppDispatch()
    const { mutateAsync, isPending } = useMutation(importMutation)
    const canImport = useMemo(() => {
        if (!item || item.error || isPending || disableImport) return false
        switch (item.__typename) {
            case 'FolderNode':
                return false
            case 'DatasetStorageNode':
            case 'AnalysisStorageNode':
                return parentItem && item.importStatus === ImportStatusEnum.Partial || item.importStatus === ImportStatusEnum.Available
        }
    }, [ item, isPending, disableImport ])
    const download = useCallback(async (event: MouseEvent) => {
        event.stopPropagation()
        if (!canImport || !item) return;
        const options: ImportDatasetFromStorageMutationVariables = {
            datasetPath: item.path,
        }
        switch (item.__typename) {
            case 'DatasetStorageNode':
                options.datasetPath = item.path
                break;
            case 'AnalysisStorageNode':
                options.analysisPath = item.path
                options.datasetPath = parentItem!.path
                break;
            default:
                return;
        }
        try {
            const data = await mutateAsync(options)
            const path = data.importDataset?.dataset.path
            if (!path) return
            dispatch(StorageSlice.actions.invalidatePath(path))
        } catch (error) {
            toastManager.addError({ title: 'Import failed', error })
        }
    }, [ canImport, item, mutateAsync, parentItem, toastManager, dispatch ])

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
            usages = (item as StorageAnalysisFragment).model?.annotationCampaigns.edges
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
                { isPending ? <Spinner/> : importIcon }

                {/* Use Icon */ }
                { usages > 0 && <Popover.Root>
                    <Popover.Trigger color="medium">
                        <InfoCircle size={ 24 }/>
                    </Popover.Trigger>
                    <Popover.Content>
                        Currently used in { usages } campaigns
                    </Popover.Content>
                </Popover.Root> }

                {/* Open Icon */ }
                { canToggle && <Note>{ isOpen ? <AltArrowDown/> : <AltArrowRight/> }</Note> }

                {/* Import button */ }
                { canImport && <Button color="primary" onClick={ download }>
                    Import
                </Button> }

                {/* Error */ }
                { item.error && <Fragment>
                    <Note color="danger">{ item.error }</Note>
                    <CopyErrorStackButton stack={ item.stack }/>
                </Fragment> }
            </div>

            { isOpen && <ItemList search={ search } parentNode={ item } onUpdated={ onUpdated }/> }
        </div>
    }, [ item, isOpen, isPending, search, onUpdated, toggleOpen, canToggle, canImport, download ])
}