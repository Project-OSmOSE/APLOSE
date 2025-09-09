import React, { Fragment, useMemo } from "react";
import { IonIcon, IonNote, IonSpinner } from "@ionic/react";
import { downloadOutline } from "ionicons/icons";

import { dateToString, getErrorMessage } from "@/service/function.ts";
import { Link, Table, TableContent, TableDivider, TableHead, WarningText } from "@/components/ui";

import { DisplayDataAPI } from "./api";
import styles from './styles.module.scss'

export const SpectrogramAnalysisTable: React.FC<{
  datasetPK?: number;
  annotationCampaignPK?: number;
}> = (option) => {

  const {
    data,
    isLoading,
    error,
    isFetching
  } = DisplayDataAPI.endpoints.getSpectrogramAnalysis.useQuery(option);
  const analysis = useMemo(() => data?.allSpectrogramAnalysis?.results.filter(r => r !== null), [ data ])

  if (isLoading) return <IonSpinner/>
  if (error) <WarningText>{ getErrorMessage(error) }</WarningText>
  if (!analysis) return <IonNote color='medium'>No spectrogram analysis</IonNote>

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

    { analysis.map(analysis => <Fragment key={ analysis.name }>
      <TableContent isFirstColumn={ true }>{ analysis.name }</TableContent>
      <TableContent>Spectrogram</TableContent>
      <TableContent>{ dateToString(analysis.createdAt) }</TableContent>
      <TableContent>{ analysis.filesCount }</TableContent>
      <TableContent>{ dateToString(analysis.start) }</TableContent>
      <TableContent>{ dateToString(analysis.end) }</TableContent>
      <TableContent>{ analysis.dataDuration }</TableContent>
      <TableContent>{ analysis.fft.samplingFrequency }</TableContent>
      <TableContent>{ analysis.fft.nfft }</TableContent>
      <TableContent>{ analysis.fft.windowSize }</TableContent>
      <TableContent>{ analysis.fft.overlap }</TableContent>
      <TableContent className={ styles.downloadCell }>
        <Link size='small'
              href={ `/api/download/analysis-export/${ analysis.pk }/` }>
          <IonIcon icon={ downloadOutline } slot='icon-only'/>
        </Link>
        <IonNote color='medium'>OSEkit v{ analysis.legacy ? '<0.2.5' : '>=0.3.0' }</IonNote>
      </TableContent>
      <TableDivider/>
    </Fragment>) }
  </Table>
}
