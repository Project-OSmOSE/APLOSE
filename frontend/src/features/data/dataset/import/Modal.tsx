import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { useSearchedData } from "@/service/ui/search.ts";
import { IonNote, IonSearchbar, IonSpinner, SearchbarInputEventDetail } from "@ionic/react";
import { Modal, ModalFooter, ModalHeader } from "@/components/ui";
import { DatasetAPI, ImportDataset } from "@/features/data/dataset/api";
import { DatasetCheckbox } from "./DatasetCheckbox.tsx";
import { DatasetImportHelpButton } from "./HelpButton.tsx";

export const ImportDatasetModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {

  const { data: availableDatasets, isLoading } = DatasetAPI.endpoints.getAvailableDatasetsForImport.useQuery()

  const [ imports, setImports ] = useState<Map<string, string[]>>(new Map());


  const [ search, setSearch ] = useState<string | undefined>();

  const searchDatasets = useSearchedData({
    items: availableDatasets ?? [],
    search,
    sortField: 'name',
    mapping: (dataset: ImportDataset) => [ dataset.name, dataset.path, ...(dataset.analysis ?? []).flatMap(a => a ? [ a.name, a.path ] : []) ]
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

  const onDatasetImported = useCallback((dataset: ImportDataset) => {
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
            { searchDatasets.map(d => <DatasetCheckbox key={ [ d.name, d.path ].join(' ') }
                                                       dataset={ d }
                                                       importedAnalysis={ imports.get(d.name) }
                                                       search={ search }
                                                       onImported={ onDatasetImported }/>) }
          </div>

          <ModalFooter>
              <DatasetImportHelpButton/>

            { isLoading && <IonSpinner/> }
          </ModalFooter>

      </Fragment> }
    </Modal>
  )
}
