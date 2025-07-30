import React, { useEffect, useMemo } from "react";
import styles from './styles.module.scss'
import { DatasetAPI, ImportAnalysis, ImportDataset } from '@/features/data/dataset'
import { IonButton, IonNote, IonSpinner } from "@ionic/react";
import { AnalysisCheckbox } from "./AnalysisCheckbox.tsx";
import { useSearchedData } from "@/service/ui/search.ts";
import { FolderCheck, MoveToFolder } from "@solar-icons/react";
import { useToast } from "@/service/ui";

export const DatasetCheckbox: React.FC<{
  dataset: ImportDataset,
  importedAnalysis?: string[]
  search?: string;
  onImported: (dataset: ImportDataset) => void
}> = ({ dataset, search, importedAnalysis, onImported }) => {

  const [ doImport, {
    isLoading,
    isSuccess,
    error
  } ] = DatasetAPI.endpoints.postDatasetForImport.useMutation()
  const toast = useToast()

  const isDownloaded = useMemo(() => {
    return isSuccess || (importedAnalysis && importedAnalysis.length === dataset.analysis.length)
  }, [ isSuccess, importedAnalysis, dataset ])

  useEffect(() => {
    if (error) toast.presentError(error)
  }, [ error ]);

  useEffect(() => {
    if (isSuccess) onImported(dataset)
  }, [ isSuccess ]);

  useEffect(() => {
    return () => {
      toast.dismiss();
    }
  }, []);

  const searchAnalysis = useSearchedData({
    items: dataset.analysis,
    search,
    sortField: 'name',
    mapping: (analysis: ImportAnalysis) => [ analysis.name, analysis.path ]
  })

  return <div className={ styles.dataset }>

    { isDownloaded ? <FolderCheck className={ [ styles.import, styles.icon ].join(' ') }
                                  weight="BoldDuotone"/> : isLoading ?
      <IonSpinner className={ styles.import }/> : (
        <IonButton fill='clear' size='small' className={ styles.import }
                   onClick={ () => doImport(dataset) }>
          <MoveToFolder size={ 24 }/>
        </IonButton>
      ) }

    <span className={ isDownloaded ? 'disabled' : '' }>
      <span><b>{ dataset.name }</b><IonNote>{ search && ` (${ searchAnalysis.length }/${ dataset.analysis.length } analysis)` }</IonNote></span>
      <p>{ dataset.path }</p>
    </span>

    { searchAnalysis.map(a => <AnalysisCheckbox key={ a.name }
                                                analysis={ a } dataset={ dataset }
                                                imported={ importedAnalysis?.includes(a.name) }
                                                onImported={ () => onImported({ ...dataset, analysis: [ a ] }) }/>) }
  </div>
}