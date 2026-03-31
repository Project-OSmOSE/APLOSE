import React, { Fragment, type MouseEvent, useCallback, useMemo } from 'react';
import { FileFavourite } from '@solar-icons/react';
import { type StorageAnalysis, type StorageDataset, TaskStatusEnum, useImportDatasetFromStorage } from '@/api';
import BackgroundTask from '@/features/BackgroundTask';
import styles from '../styles.module.scss';
import { Structure } from './_Structure'
import { Usages } from './_Usages';
import { useToast } from '@/components/ui';
import { IonButton, IonSpinner } from '@ionic/react';

export const AnalysisItem: React.FC<{
    item: StorageAnalysis,
    parent: StorageDataset,
    search?: string,
    onUpdated?: () => void,
}> = ({ item, parent, search, onUpdated }) => {
    const toast = useToast()
    const { doImport, isLoading } = useImportDatasetFromStorage()
    const currentTask = useMemo(() => {
        const allTasks = item.importTasks?.results.filter(t => !!t)
        return allTasks && allTasks.length > 0 ? allTasks[0] : undefined
    }, [ item ])
    const canImport = useMemo(() => {
        if (item.error || isLoading) return false
        if (!parent) return false
        if (item.model) return false // Already imported
        return !currentTask || currentTask.status === TaskStatusEnum.Failed || currentTask.status === TaskStatusEnum.Cancelled
    }, [ item, isLoading, parent ])
    const importAnalysis = useCallback((event: MouseEvent) => {
        event.stopPropagation()
        if (!canImport) return;
        doImport({
            analysisPath: item.path,
            datasetPath: parent!.path,
        }).unwrap()
            .catch(error => toast.raiseError({ gqlError: error }))
            .finally(onUpdated)
    }, [ canImport, item, doImport, onUpdated, parent, toast ])

    return useMemo(() =>
            <Structure itemClassName={ styles.analysis }
                       error={ item.error }
                       errorStack={ item.stack }
                       name={ <p>{ item.name }</p> }
                       icon={ <FileFavourite size={ 24 } weight="BoldDuotone"/> }
                       otherInfo={
                           <Fragment>
                               <Usages item={ item }/>

                               { isLoading && <IonSpinner/> }
                               { canImport && <IonButton size="small" fill="outline" onClick={ importAnalysis }
                                                         children="Import"/> }

                               <BackgroundTask.Indicator taskID={ currentTask?.id }
                                                         forceState={ item.model && !currentTask && TaskStatusEnum.Completed }/>
                           </Fragment>
                       }/>,
        [ item, search, currentTask, onUpdated, isLoading, canImport, importAnalysis ],
    )
}
