import React, { type MouseEvent, useCallback, useEffect, useMemo } from 'react';
import { Status, type StorageAnalysis, useImportAnalysisFromStorage } from '@/api';
import { CheckRead, FileFavourite, Unread } from '@solar-icons/react';
import styles from '@/features/storage/styles.module.scss';
import { IonButton, IonSpinner } from '@ionic/react';
import { useToast } from '@/components/ui';

export const AnalysisItem: React.FC<{
    analysis: StorageAnalysis,
    dataset: { path: string }
    onUpdated?: () => void
}> = ({ analysis, dataset, onUpdated }) => {
    const { importAnalysis, isLoading, error } = useImportAnalysisFromStorage()
    const toast = useToast()
    const canImport = useMemo(() => {
        return !isLoading && (analysis.importStatus === Status.Partial || analysis.importStatus === Status.Available);
    }, [ analysis, isLoading ])
    const doImport = useCallback((event: MouseEvent) => {
        event.stopPropagation()
        if (!canImport) return;
        importAnalysis({
            name: analysis.name,
            datasetPath: dataset.path,
        }).unwrap().finally(onUpdated)
    }, [ canImport, analysis, importAnalysis, analysis, dataset, onUpdated ])
    const importStatusIcon = useMemo(() => {
        if (isLoading) return <IonSpinner/>
        switch (analysis.importStatus) {
            case Status.Imported:
                return <CheckRead color="success" size={ 24 }/>
            case Status.Partial:
                return <Unread color="success" size={ 24 }/>
        }
    }, [ analysis, isLoading ])

    useEffect(() => {
        if (error) toast.raiseError({ error })
    }, [ error ]);
    useEffect(() => {
        return () => {
            toast.dismiss();
        }
    }, []);

    return <div className={ styles.item }>
        <div className={ styles.analysis }>
            <FileFavourite size={ 24 } weight="BoldDuotone"/>
            <p>{ analysis.name }</p>
            { importStatusIcon }
            { canImport && <IonButton size="small" fill="outline" onClick={ doImport }>
                Import
            </IonButton> }
        </div>
    </div>
}
