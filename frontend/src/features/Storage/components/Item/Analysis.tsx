import React, { Fragment, type MouseEvent, useCallback, useMemo } from 'react';
import { IonButton, IonSpinner } from '@ionic/react';
import { FileFavourite } from '@solar-icons/react';

import { TaskStatusEnum } from '@/api';
import BackgroundTask from '@/features/BackgroundTask';
import { useToast } from '@/components/ui';

import { Structure } from './_Structure'
import { Usages } from './_Usages';
import { API } from '../../api';
import type { StorageAnalysis } from '../../types';
import styles from '../styles.module.scss';

export const AnalysisItem: React.FC<{
    item: StorageAnalysis,
    search?: string,
    onUpdated?: () => void,
}> = ({ item, search, onUpdated }) => {
    const toast = useToast()
    const [ doImport, { isLoading } ] = API.endpoints.importDataFromStorage.useMutation()
    const canImport = useMemo(() => {
        if (item.error || isLoading) return false
        if (item.model?.isImportCompleted) return false // Already imported
        return !item.importTask || item.importTask.status === TaskStatusEnum.Failure || item.importTask.status === TaskStatusEnum.Revoked
    }, [ item, isLoading ])
    const importAnalysis = useCallback((event: MouseEvent) => {
        event.stopPropagation()
        if (!canImport) return;
        doImport({ path: item.path }).unwrap()
            .catch(error => toast.raiseError({ gqlError: error }))
            .finally(onUpdated)
    }, [ canImport, item, doImport, onUpdated, toast ])

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

                               <BackgroundTask.Indicator identifier={ item.importTask?.identifier }
                                                         forceState={ item.model?.isImportCompleted && TaskStatusEnum.Success }/>
                           </Fragment>
                       }/>,
        [ item, search, onUpdated, isLoading, canImport, importAnalysis ],
    )
}
