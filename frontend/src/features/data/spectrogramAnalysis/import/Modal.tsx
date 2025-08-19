import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { useSearchedData } from "@/service/ui/search.ts";
import { IonNote, IonSearchbar, IonSpinner, SearchbarInputEventDetail } from "@ionic/react";
import { Modal, ModalFooter, ModalHeader } from "@/components/ui";
import { DatasetAPI, DatasetImportHelpButton } from "@/features/data/dataset";
import { ImportSpectrogramAnalysis, SpectrogramAnalysisAPI } from "@/features/data/spectrogramAnalysis/api";
import { AnalysisImportRow } from "@/features/data/spectrogramAnalysis/import/ImportRow.tsx";
import { useParams } from "react-router-dom";

export const ImportAnalysisModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { datasetID } = useParams<{ datasetID: string }>()

  const {
    data: dataset,
    isLoading: isLoadingDataset
  } = DatasetAPI.endpoints.getDatasetByID.useQuery({ id: datasetID ?? '' }, { skip: !datasetID })

  const {
    data: availableAnalysis,
    isLoading: isLoadingAnalysis
  } = SpectrogramAnalysisAPI.endpoints.getAvailableSpectrogramAnalysisForImport.useQuery({ datasetID: datasetID ?? '' }, {
    skip: !datasetID,
    refetchOnMountOrArgChange: true
  })

  const isLoading = useMemo(() => isLoadingAnalysis || isLoadingDataset, [ isLoadingAnalysis, isLoadingDataset ])

  const [ imports, setImports ] = useState<string[]>([]);

  const [ search, setSearch ] = useState<string | undefined>();

  const searchedAnalysis = useSearchedData({
    items: availableAnalysis ?? [],
    search,
    sortField: 'name',
    mapping: (analysis: ImportSpectrogramAnalysis) => [ analysis.name, analysis.path ]
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

  const onAnalysisImported = useCallback((analysis: ImportSpectrogramAnalysis) => {
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

      { !isLoading && !!availableAnalysis && availableAnalysis.length > 0 && dataset && <Fragment>

          <IonSearchbar ref={ searchbar } onIonInput={ onSearchUpdated } onIonClear={ onSearchCleared }/>

          <div className={ styles.content }>
            { searchedAnalysis.map(a => <AnalysisImportRow key={ [ a.name, a.path ].join(' ') }
                                                           analysis={ a }
                                                           dataset={ dataset }
                                                           imported={ imports.includes(a.name) }
                                                           onImported={ onAnalysisImported }/>) }
          </div>

          <ModalFooter>
              <DatasetImportHelpButton/>
          </ModalFooter>

      </Fragment> }
    </Modal>
  )
}
