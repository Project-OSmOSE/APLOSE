import React, { useCallback } from 'react';
import { useDataset } from '@/api';
import { useAppDispatch } from '@/features/App';
import { gqlAPI } from '@/api/baseGqlApi';
import { listSpectrogramAnalysisTag } from '@/api/spectrogram-analysis/api';
import { HelpButton, Modal, ModalFooter, ModalHeader, type ModalProps } from '@/components/ui';
import { Item } from '@/features/Storage';
import { useParams } from '@tanstack/react-router';

export const ImportDatasetAnalysisModal: React.FC<ModalProps> = ({ onClose }) => {
    const { datasetID } = useParams({ strict: false });
    const { dataset } = useDataset({ id: datasetID })
    const dispatch = useAppDispatch();

    const invalidateSpectrogramList = useCallback(() => {
        if (!dataset) return
        dispatch(gqlAPI.util.invalidateTags([ listSpectrogramAnalysisTag({
            datasetID: dataset.id,
        }) ]))
    }, [ dataset, dispatch ])

    return (
        <Modal onClose={ onClose }>
            <ModalHeader title="Import an analysis"
                         onClose={ onClose }/>

            { dataset && <Item path={ dataset.path } forceOpen disableImport onUpdated={ invalidateSpectrogramList }/> }

            <ModalFooter>
                <HelpButton url="/doc/user/data/generate"
                            label="How to generate a dataset"/>
            </ModalFooter>
        </Modal>
    )
}