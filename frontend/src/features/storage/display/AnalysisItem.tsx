import React, { Fragment, type MouseEvent, useCallback, useEffect, useMemo } from 'react';
import { ImportStatus, type StorageAnalysis, useImportDatasetFromStorage } from '@/api';
import { CheckRead, FileFavourite, InfoCircle, Unread } from '@solar-icons/react';
import styles from './styles.module.scss';
import { IonButton, IonSpinner } from '@ionic/react';
import { TooltipOverlay, useToast } from '@/components/ui';

export const AnalysisItem: React.FC<{
    analysis: StorageAnalysis,
    dataset: { path: string }
    search?: string,
    onUpdated?: () => void
}> = ({ analysis, dataset, onUpdated }) => {
    const { importDataset, isLoading, error } = useImportDatasetFromStorage()
    const toast = useToast()
    const canImport = useMemo(() => {
        return !isLoading && (analysis.importStatus === ImportStatus.Partial || analysis.importStatus === ImportStatus.Available);
    }, [ analysis, isLoading ])
    const doImport = useCallback((event: MouseEvent) => {
        event.stopPropagation()
        if (!canImport) return;
        importDataset({
            analysisPath: analysis.path,
            datasetPath: dataset.path,
        }).unwrap().finally(onUpdated)
    }, [ canImport, analysis, importDataset, analysis, dataset, onUpdated ])
    const importStatusIcon = useMemo(() => {
        if (isLoading) return <IonSpinner/>
        switch (analysis.importStatus) {
            case ImportStatus.Imported:
                return <CheckRead color="success" size={ 24 }/>
            case ImportStatus.Partial:
                return <Unread color="success" size={ 24 }/>
        }
    }, [ analysis, isLoading ])

    const inUseWarning = useMemo(() => {
        const campaigns = analysis.model?.annotationCampaigns.edges
            .map(e => e?.node)
            .filter(n => !!n && !n.isArchived) ?? []
        if (campaigns.length > 0)
            return <TooltipOverlay tooltipContent={ `Dataset is currently used in ${ campaigns.length } campaigns.` }>
                <InfoCircle size={ 24 } color="medium"/>
            </TooltipOverlay>
        return <Fragment/>
    }, [ analysis ])

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
            { inUseWarning }
            { canImport && <IonButton size="small" fill="outline" onClick={ doImport }>
                Import
            </IonButton> }
        </div>
    </div>
}
