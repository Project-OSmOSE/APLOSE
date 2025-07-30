import React, { useEffect, useMemo } from "react";
import styles from './styles.module.scss'
import { IonButton, IonSpinner } from "@ionic/react";
import { ImportAnalysis, ImportDataset } from "@/features/data/dataset/api";
import { useToast } from "@/service/ui";
import { FileCheck, FileRight } from "@solar-icons/react";
import { SpectrogramAnalysisAPI } from "@/features/data/spectrogramAnalysis/api";

export const AnalysisCheckbox: React.FC<{
  analysis: ImportAnalysis,
  dataset: ImportDataset,
  imported?: boolean
  onImported: (analysis: ImportAnalysis) => void
}> = ({ analysis, dataset, imported, onImported }) => {

  const [ doImport, {
    isLoading,
    isSuccess,
    error
  } ] = SpectrogramAnalysisAPI.endpoints.postAnalysisForImport.useMutation()
  const toast = useToast()

  const isDownloaded = useMemo(() => isSuccess || imported, [ isSuccess, imported ])

  useEffect(() => {
    if (error) toast.presentError(error)
  }, [ error ]);

  useEffect(() => {
    if (isSuccess) onImported(analysis)
  }, [ isSuccess ]);

  useEffect(() => {
    return () => {
      toast.dismiss();
    }
  }, []);

  return <div className={ styles.analysis }>

    { isDownloaded ?
      <FileCheck className={ [ styles.import, styles.icon ].join(' ') } weight="BoldDuotone"/> : isLoading ?
        <IonSpinner className={ styles.import }/> : (
          <IonButton fill='clear' size='small' className={ styles.import }
                     onClick={ () => doImport({
                       datasetName: dataset.name,
                       datasetPath: dataset.path,
                       legacy: dataset.legacy,
                       ...analysis
                     }) }>
            <FileRight size={ 24 }/>
          </IonButton>
        ) }

    <span className={ isDownloaded ? 'disabled' : '' }>
      <b>{ analysis.name }</b>
      <p>{ analysis.path }</p>
    </span>
  </div>
}