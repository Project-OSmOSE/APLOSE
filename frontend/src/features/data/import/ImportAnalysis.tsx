import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { createPortal } from "react-dom";
import { IonButton, IonIcon, IonNote, IonSearchbar, IonSpinner, SearchbarInputEventDetail } from "@ionic/react";
import { downloadOutline } from "ionicons/icons";
import { FileCheck, FileRight } from "@solar-icons/react";

import { ImportRow, Modal, ModalFooter, ModalHeader } from "@/components/ui";
import { useModal, useSearchedData, useToast } from "@/service/ui";

import { GenerateDatasetHelpButton } from "@/features/data";
import { ImportDataAPI } from "./api";
import { _Analysis, _Dataset } from './types.ts'
import styles from "./styles.module.scss";

export const ImportAnalysisModalButton: React.FC = () => {
  const modal = useModal();

  return <Fragment>
    <IonButton color='primary' fill='clear'
               style={ { zIndex: 2, justifySelf: 'center' } }
               onClick={ modal.toggle }>
      <IonIcon icon={ downloadOutline } slot='start'/>
      Import analysis
    </IonButton>

    { modal.isOpen && createPortal(<ImportAnalysisModal onClose={ modal.close }/>, document.body) }
  </Fragment>
}

export const ImportAnalysisModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { datasetID } = useParams<{ datasetID: string }>()

  const {
    data,
    isLoading
  } = ImportDataAPI.endpoints.getAvailableSpectrogramAnalysisForImport.useQuery({ datasetID: datasetID ?? -1 }, {
    skip: !datasetID,
    refetchOnMountOrArgChange: true
  })
  const dataset = useMemo(() => data?.datasetByPk, [ data ]);
  const availableAnalysis = useMemo(() => {
    return data?.allSpectrogramAnalysisForImport?.filter(r => r !== null) ?? []
  }, [ data ])

  const [ imports, setImports ] = useState<string[]>([]);

  const [ search, setSearch ] = useState<string | undefined>();

  const searchedAnalysis = useSearchedData({
    items: availableAnalysis ?? [],
    search,
    sortField: 'name',
    mapping: (analysis: _Analysis) => [ analysis.name, analysis.path ]
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

  const onAnalysisImported = useCallback((analysis: _Analysis) => {
    setImports(prevState => {
      return [ ...new Set([ ...prevState, analysis.name ]) ]
    });
  }, [ setImports ])

  return (
    <Modal onClose={ onClose }
           className={ [ styles.importModal, (!isLoading && !!availableAnalysis && availableAnalysis.length > 0) ? styles.filled : 'empty' ].join(' ') }>
      <ModalHeader title='Import an analysis'
                   onClose={ onClose }/>

      { isLoading && <IonSpinner/> }

      { !isLoading && !!availableAnalysis && availableAnalysis.length == 0 &&
          <IonNote>There is no new analysis</IonNote> }

      { !isLoading && !!availableAnalysis && availableAnalysis.length > 0 && dataset &&
          <Fragment>

              <IonSearchbar ref={ searchbar } onIonInput={ onSearchUpdated } onIonClear={ onSearchCleared }/>

              <div className={ styles.content }>
                { searchedAnalysis.map(a => <ImportAnalysisRow key={ [ a.name, a.path ].join(' ') }
                                                               analysis={ a }
                                                               dataset={ dataset }
                                                               imported={ imports.includes(a.name) }
                                                               onImported={ onAnalysisImported }/>) }
              </div>

              <ModalFooter>
                  <GenerateDatasetHelpButton/>
              </ModalFooter>

          </Fragment> }
    </Modal>
  )
}

export const ImportAnalysisRow: React.FC<{
  analysis: _Analysis,
  dataset: Omit<_Dataset, 'analysis'>,
  imported?: boolean
  onImported?: (analysis: _Analysis) => void
}> = ({ analysis, dataset, imported, onImported }) => {

  const [ doImport, {
    isLoading,
    isSuccess,
    error
  } ] = ImportDataAPI.endpoints.postAnalysisForImport.useMutation()
  const toast = useToast()

  const isDownloaded = useMemo(() => isSuccess || imported, [ isSuccess, imported ])

  useEffect(() => {
    if (error) toast.presentError(error)
  }, [ error ]);

  useEffect(() => {
    if (isSuccess && onImported) onImported(analysis)
  }, [ isSuccess ]);

  useEffect(() => {
    return () => {
      toast.dismiss();
    }
  }, []);

  return <ImportRow downloadedIcon={ <FileCheck size={ 24 } weight="BoldDuotone"/> }
                    downloadIcon={ <FileRight className='download-analysis' size={ 24 }/> }
                    isLoading={ isLoading }
                    isDownloaded={ isDownloaded }
                    name={ analysis.name }
                    path={ analysis.path }
                    doImport={ () => doImport({
                      datasetName: dataset.name,
                      datasetPath: dataset.path,
                      legacy: dataset.legacy ?? false,
                      ...analysis
                    }) }/>
}
