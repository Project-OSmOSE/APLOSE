import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Modal, ModalFooter, ModalHeader, useModal, WarningText } from '@/components/ui';
import { IonButton, IonIcon, IonNote, IonSearchbar, IonSpinner, SearchbarInputEventDetail } from '@ionic/react';
import { downloadOutline } from 'ionicons/icons/index.js';
import { createPortal } from 'react-dom';
import { ImportDatasetNode, useAvailableDatasetsForImport } from '@/api';
import { GenerateDatasetHelpButton } from './DatasetHelpButton';
import { ImportDatasetRow } from './ImportDatasetRow';
import styles from './styles.module.scss';
import { useFilter, useSort } from '@/features/UX';


export const ImportDatasetModalButton: React.FC = () => {
    const modal = useModal();

    return <Fragment>
        <IonButton color="primary" fill="clear"
                   style={ { zIndex: 2, justifySelf: 'center' } }
                   onClick={ modal.toggle }>
            <IonIcon icon={ downloadOutline } slot="start"/>
            Import dataset
        </IonButton>

        { modal.isOpen && createPortal(<ImportDatasetModal onClose={ modal.close }/>, document.body) }
    </Fragment>
}

export const ImportDatasetModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {

    const {
        availableDatasets,
        isLoading,
        error,
    } = useAvailableDatasetsForImport()

    const [ imports, setImports ] = useState<Map<string, string[]>>(new Map());


    const [ search, setSearch ] = useState<string | undefined>();

    const filteredDatasets = useFilter({
        items: availableDatasets ?? [],
        search,
        itemToStringArray: (dataset: ImportDatasetNode) => [ dataset.name, dataset.path, ...(dataset.analysis ?? []).flatMap(a => a ? [ a.name, a.path ] : []) ],
    })
    const searchDatasets = useSort({
        items: filteredDatasets,
        itemToSortString: (dataset: ImportDatasetNode) => dataset.name,
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

    const onDatasetImported = useCallback((dataset: ImportDatasetNode) => {
        setImports(prevState => {
            const datasetAnalysis = dataset.analysis?.filter(a => a !== null) ?? []
            if (prevState.get(dataset.name)) {
                return new Map<string, string[]>(
                    [ ...prevState.entries() ]
                        .map(([ datasetName, analysis ]) => {
                            if (datasetName !== dataset.name) return [ datasetName, analysis ];
                            return [
                                datasetName,
                                [ ...new Set([ ...analysis, ...datasetAnalysis.filter(a => !!a).map(a => a!.name) ]) ],
                            ]
                        }),
                )
            } else {
                return new Map<string, string[]>([ ...prevState.entries(), [ dataset.name, datasetAnalysis.filter(a => !!a).map(a => a!.name) ] ])
            }
        });
    }, [ isLoading, availableDatasets, setImports ])

    return (
        <Modal onClose={ onClose }
               className={ [ styles.importModal, (!isLoading && !!availableDatasets && availableDatasets.length > 0) ? styles.filled : 'empty' ].join(' ') }>
            <ModalHeader title="Import a dataset"
                         onClose={ onClose }/>

            { isLoading && <IonSpinner/> }
            { error && <WarningText error={ error }/> }

            { !isLoading && !!availableDatasets && availableDatasets.length == 0 &&
                <IonNote>There is no new dataset or analysis</IonNote> }

            { !isLoading && !!availableDatasets && availableDatasets.length > 0 && <Fragment>

                <IonSearchbar ref={ searchbar } onIonInput={ onSearchUpdated } onIonClear={ onSearchCleared }/>

                <div className={ styles.content }>
                    { searchDatasets.map((d, i) => <ImportDatasetRow key={ i }
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