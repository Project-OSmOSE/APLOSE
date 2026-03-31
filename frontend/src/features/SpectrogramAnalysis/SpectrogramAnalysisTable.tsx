import React, { Fragment, useCallback, useEffect, useMemo } from 'react';
import { IonIcon, IonNote, IonSpinner } from '@ionic/react';
import { downloadOutline } from 'ionicons/icons/index.js';
import { dateToString } from '@/service/function';
import { Button, GraphQLErrorText, Table, TableContent, TableDivider, TableHead, useToast } from '@/components/ui';
import styles from './styles.module.scss'
import {
    type ListSpectrogramAnalysisQuery,
    type ListSpectrogramAnalysisQueryVariables,
    TaskStatusEnum,
    useAllSpectrogramAnalysis,
} from '@/api';
import { useDownloadAnalysis } from '@/api/download';
import BackgroundTask from '@/features/BackgroundTask'
import { type AppState, useAppSelector } from '@/features/App';
import { BackgroundTaskSlice } from '@/features/BackgroundTask/Slice';

export const SpectrogramAnalysisTable: React.FC<ListSpectrogramAnalysisQueryVariables> = (option) => {

    const {
        data,
        isLoading,
        error,
        isFetching,
    } = useAllSpectrogramAnalysis(option);
    const analysis = useMemo(() => data?.allSpectrogramAnalysis?.results.filter(r => r && r.spectrograms).map(r => r!), [ data ])


    if (isLoading) return <IonSpinner/>
    if (error) return <GraphQLErrorText error={ error }/>
    if (!analysis || analysis.length === 0) return <IonNote color="medium">No spectrogram analysis</IonNote>

    return <Table columns={ 12 }>
        <TableHead topSticky isFirstColumn={ true }>
            Analysis
            { isFetching && <IonSpinner className={ styles.gridSpinner }/> }
        </TableHead>
        <TableHead topSticky>Type</TableHead>
        <TableHead topSticky>Created at</TableHead>
        <TableHead topSticky>Number of files</TableHead>
        <TableHead topSticky>Start date</TableHead>
        <TableHead topSticky>End date</TableHead>
        <TableHead topSticky>File duration</TableHead>
        <TableHead topSticky>Sampling frequency</TableHead>
        <TableHead topSticky>NFFT</TableHead>
        <TableHead topSticky>Window size</TableHead>
        <TableHead topSticky>Overlap</TableHead>
        <TableHead topSticky>Configuration</TableHead>
        <TableDivider/>

        { analysis.map(analysis => <SpectrogramAnalysisRow key={ analysis.name } analysis={ analysis }/>) }
    </Table>
}

const SpectrogramAnalysisRow: React.FC<{
    analysis: NonNullable<ListSpectrogramAnalysisQuery['allSpectrogramAnalysis']>['results'][number];
}> = ({ analysis }) => {
    const [ downloadAnalysis, { error: downloadError } ] = useDownloadAnalysis()
    const toast = useToast();
    useEffect(() => {
        if (downloadError) toast.raiseError({ error: downloadError })
    }, [ downloadError ]);

    const importTasks = useMemo(() => analysis?.importAnalysisBackgroundTasks.edges
            .map(e => e?.node)
            .filter(n => !!n) ?? []
        , [ analysis ])

    const taskSelector = useCallback((state: AppState) => {
        if (importTasks.length === 0) return undefined;
        return BackgroundTaskSlice.selectors.selectTask(state, importTasks[0]!.id)
    }, [ importTasks ])
    const task = useAppSelector(taskSelector)

    return useMemo(() => {
        if (!analysis) return <Fragment/>;

        return <Fragment>
            <TableContent isFirstColumn={ true }>{ analysis.name }</TableContent>
            <TableContent>Spectrogram</TableContent>
            <TableContent>{ dateToString(analysis.createdAt) }</TableContent>
            <TableContent>
                <div className={ styles.spectrogramsCell }>
                    { !task || task.status === TaskStatusEnum.Completed ?
                        analysis.spectrograms!.totalCount :
                        <BackgroundTask.Indicator taskID={ task.id.toString() }/>
                    }
                </div>
            </TableContent>
            <TableContent>{ dateToString(analysis.start) }</TableContent>
            <TableContent>{ dateToString(analysis.end) }</TableContent>
            <TableContent>{ analysis.dataDuration }</TableContent>
            <TableContent>{ analysis.fft.samplingFrequency }</TableContent>
            <TableContent>{ analysis.fft.nfft }</TableContent>
            <TableContent>{ analysis.fft.windowSize }</TableContent>
            <TableContent>{ analysis.fft.overlap }</TableContent>
            <TableContent className={ styles.downloadCell }>
                <Button size="small" color="dark" fill="clear" onClick={ () => downloadAnalysis(analysis) }>
                    <IonIcon icon={ downloadOutline } slot="icon-only"/>
                </Button>
                { analysis.legacy && <IonNote color="medium">{ 'OSEkit v<0.2.5' }</IonNote> }
            </TableContent>
            <TableDivider/>
        </Fragment>
    }, [ analysis, downloadAnalysis, task ])
}