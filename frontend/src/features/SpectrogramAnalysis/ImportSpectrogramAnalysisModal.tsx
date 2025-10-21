import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Modal, ModalFooter, ModalHeader, useModal } from '@/components/ui';
import { IonButton, IonIcon, IonNote, IonSearchbar, IonSpinner, SearchbarInputEventDetail } from '@ionic/react';
import { downloadOutline } from 'ionicons/icons/index.js';
import { createPortal } from 'react-dom';
import { ImportSpectrogramAnalysisType, useAvailableSpectrogramAnalysisForImport } from '@/api';
import { GenerateDatasetHelpButton } from '@/features/Dataset';
import { ImportAnalysisRow } from './ImportSpectrogramAnalysisRow';
import styles from './styles.module.scss';
import { useFilter, useNavParams, useSort } from '@/features/UX';

export const ImportAnalysisModalButton: React.FC = () => {
  const modal = useModal();

  return <Fragment>
    <IonButton color="primary" fill="clear"
               style={ { zIndex: 2, justifySelf: 'center' } }
               onClick={ modal.toggle }>
      <IonIcon icon={ downloadOutline } slot="start"/>
      Import analysis
    </IonButton>

    { modal.isOpen && createPortal(<ImportAnalysisModal onClose={ modal.close }/>, document.body) }
  </Fragment>
}

export const ImportAnalysisModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { datasetID } = useNavParams()

  const {
    availableSpectrogramAnalysis,
    dataset,
    isLoading,
  } = useAvailableSpectrogramAnalysisForImport({ datasetID })

  const [ imports, setImports ] = useState<string[]>([]);

  const [ search, setSearch ] = useState<string | undefined>();

  const filteredAnalysis = useFilter({
    items: availableSpectrogramAnalysis ?? [],
    search,
    itemToStringArray: (analysis: ImportSpectrogramAnalysisType) => [ analysis.name, analysis.path ],
  })
  const searchedAnalysis = useSort({
    items: filteredAnalysis,
    itemToSortString: (analysis: ImportSpectrogramAnalysisType) => analysis.name,
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

  const onAnalysisImported = useCallback((analysis: ImportSpectrogramAnalysisType) => {
    setImports(prevState => {
      return [ ...new Set([ ...prevState, analysis.name ]) ]
    });
  }, [ setImports ])

  return (
    <Modal onClose={ onClose }
           className={ [ styles.importModal, (!isLoading && !!availableSpectrogramAnalysis && availableSpectrogramAnalysis.length > 0) ? styles.filled : 'empty' ].join(' ') }>
      <ModalHeader title="Import an analysis"
                   onClose={ onClose }/>

      { isLoading && <IonSpinner/> }

      { !isLoading && (!availableSpectrogramAnalysis || availableSpectrogramAnalysis.length == 0) &&
          <IonNote>There is no new analysis</IonNote> }

      { !isLoading && !!availableSpectrogramAnalysis && availableSpectrogramAnalysis.length > 0 && dataset &&
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