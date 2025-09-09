import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IonButton, IonIcon, IonNote, IonSearchbar, IonSpinner, SearchbarInputEventDetail } from "@ionic/react";
import { downloadOutline } from "ionicons/icons";
import { FolderCheck, MoveToFolder } from "@solar-icons/react";

import { ImportRow, Modal, ModalFooter, ModalHeader } from "@/components/ui";
import { useModal, useSearchedData, useToast } from "@/service/ui";

import { GenerateDatasetHelpButton } from "@/features/data";

import { ImportAnalysisRow } from "./ImportAnalysis.tsx";
import { ImportDataAPI } from "./api";
import { _Analysis, _Dataset } from './types.ts'
import styles from "./styles.module.scss";


export const ImportDatasetModalButton: React.FC = () => {
  const modal = useModal();

  return <Fragment>
    <IonButton color='primary' fill='clear'
               style={ { zIndex: 2, justifySelf: 'center' } }
               onClick={ modal.toggle }>
      <IonIcon icon={ downloadOutline } slot='start'/>
      Import dataset
    </IonButton>

    { modal.isOpen && createPortal(<ImportDataset onClose={ modal.close }/>, document.body) }
  </Fragment>
}

export const ImportDataset: React.FC<{ onClose: () => void }> = ({ onClose }) => {

  const {
    data,
    isLoading
  } = ImportDataAPI.endpoints.getAvailableDatasetsForImport.useQuery({}, { refetchOnMountOrArgChange: true })
  const availableDatasets = useMemo(() => {
    return (data?.allDatasetsAvailableForImport?.filter(d => d !== null) ?? []).map(d => ({
      ...d,
      analysis: d.analysis?.filter(a => a !== null) ?? [],
    }))
  }, [ data ]);

  const [ imports, setImports ] = useState<Map<string, string[]>>(new Map());


  const [ search, setSearch ] = useState<string | undefined>();

  const searchDatasets = useSearchedData({
    items: availableDatasets,
    search,
    sortField: 'name',
    mapping: (dataset: _Dataset) => [ dataset.name, dataset.path, ...(dataset.analysis ?? []).flatMap(a => a ? [ a.name, a.path ] : []) ]
  })

  const searchbar = useRef<HTMLIonSearchbarElement | null>(null)

  useEffect(() => {
    searchbar.current?.getInputElement().then(input => input.focus())
  }, [ searchbar.current ]);

  const onSearchUpdated = useCallback((event: CustomEvent<SearchbarInputEventDetail>) => {
    setSearch(event.detail.value ?? undefined);
  }, [])

  const onSearchCleared = useCallback(() => {
    setSearch(undefined);
  }, [])

  const onDatasetImported = useCallback((dataset: _Dataset) => {
    setImports(prevState => {
      if (prevState.get(dataset.name)) {
        return new Map<string, string[]>(
          [ ...prevState.entries() ]
            .map(([ datasetName, analysis ]) => {
              if (datasetName !== dataset.name) return [ datasetName, analysis ];
              return [
                datasetName,
                [ ...new Set([ ...analysis, ...dataset.analysis.map(a => a.name) ]) ]
              ]
            })
        )
      } else {
        return new Map<string, string[]>([ ...prevState.entries(), [ dataset.name, dataset.analysis.map(a => a.name) ] ])
      }
    });
  }, [ isLoading, availableDatasets, setImports ])

  return (
    <Modal onClose={ onClose }
           className={ [ styles.importModal, (!isLoading && !!availableDatasets && availableDatasets.length > 0) ? styles.filled : 'empty' ].join(' ') }>
      <ModalHeader title='Import a dataset'
                   onClose={ onClose }/>

      { isLoading && <IonSpinner/> }

      { !isLoading && !!availableDatasets && availableDatasets.length == 0 &&
          <IonNote>There is no new dataset or analysis</IonNote> }

      { !isLoading && !!availableDatasets && availableDatasets.length > 0 && <Fragment>

          <IonSearchbar ref={ searchbar } onIonInput={ onSearchUpdated } onIonClear={ onSearchCleared }/>

          <div className={ styles.content }>
            { searchDatasets.map(d => <ImportDatasetRow key={ [ d.name, d.path ].join(' ') }
                                                        dataset={ d }
                                                        importedAnalysis={ imports.get(d.name) }
                                                        search={ search }
                                                        onImported={ onDatasetImported }/>) }
          </div>

          <ModalFooter>
              <GenerateDatasetHelpButton/>
          </ModalFooter>

      </Fragment> }
    </Modal>
  )
}

export const ImportDatasetRow: React.FC<{
  dataset: _Dataset,
  importedAnalysis?: string[]
  search?: string;
  onImported: (dataset: _Dataset) => void
}> = ({ dataset, search, importedAnalysis, onImported }) => {

  const [ doImport, {
    isLoading,
    isSuccess,
    error
  } ] = ImportDataAPI.endpoints.postDatasetForImport.useMutation()
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
    mapping: (analysis: _Analysis) => [ analysis.name, analysis.path ]
  })

  return <ImportRow downloadedIcon={ <FolderCheck size={ 24 } weight="BoldDuotone"/> }
                    downloadIcon={ <MoveToFolder className='download-dataset' size={ 24 }/> }
                    isDownloaded={ isDownloaded }
                    isLoading={ isLoading }
                    name={ dataset.name }
                    path={ dataset.path }
                    doImport={ () => doImport(dataset) }>

    { searchAnalysis.map(a => <ImportAnalysisRow key={ a.name }
                                                 analysis={ a } dataset={ dataset }
                                                 imported={ importedAnalysis?.includes(a.name) }
                                                 onImported={ () => onImported({ ...dataset, analysis: [ a ] }) }/>) }

  </ImportRow>
}
