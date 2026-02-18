import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import type { DataNavParams } from '@/features/UX';
import { useDataset } from '@/api';
import { useAppDispatch } from '@/features/App';
import { gqlAPI } from '@/api/baseGqlApi';
import { listSpectrogramAnalysisTag } from '@/api/spectrogram-analysis/api';
import { HelpButton, Modal, ModalFooter, ModalHeader, type ModalProps } from '@/components/ui';
import { DatasetItem } from '@/features/storage/display';

export const ImportDatasetAnalysisModal: React.FC<ModalProps> = ({ onClose }) => {
    const { datasetID } = useParams<DataNavParams>();
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

            <DatasetItem dataset={ dataset as any } fixedOpen onUpdated={ invalidateSpectrogramList }/>

            <ModalFooter>
                <HelpButton url="/doc/user/data/generate"
                            label="How to generate a dataset"/>
            </ModalFooter>
        </Modal>
    )
}