import React, { Fragment, useCallback } from 'react';
import { HelpButton, Modal, ModalFooter, ModalHeader, useModal } from '@/components/ui';
import { IonButton, IonIcon } from '@ionic/react';
import { downloadOutline } from 'ionicons/icons/index.js';
import { createPortal } from 'react-dom';
import { useDataset } from '@/api';
import { type DataNavParams } from '@/features/UX';
import { useParams } from 'react-router-dom';
import { DatasetItem } from '@/features/storage/DatasetItem';
import { gqlAPI } from '@/api/baseGqlApi';
import { listSpectrogramAnalysisTag } from '@/api/spectrogram-analysis/api';
import { useAppDispatch } from '@/features/App';

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
    const { datasetID } = useParams<DataNavParams>();
    const { dataset } = useDataset({ id: datasetID })
    const dispatch = useAppDispatch();

    const invalidateSpectrogramList = useCallback(() => {
        console.log('will invalidate', dataset?.id, gqlAPI)
        if (!dataset) return
        dispatch(gqlAPI.util.invalidateTags([ listSpectrogramAnalysisTag({
            datasetID: dataset.id,
        }) ]))
    }, [ dataset, dispatch ])

    return (
        <Modal onClose={ onClose }>
            <ModalHeader title="Import an analysis"
                         onClose={ onClose }/>

            <DatasetItem dataset={ dataset as any } fixedOpen onUpdated={ invalidateSpectrogramList }/>

            <ModalFooter>
                <HelpButton url="/doc/user/data/generate"
                            label="How to generate a dataset"/>
            </ModalFooter>
        </Modal>
    )
}