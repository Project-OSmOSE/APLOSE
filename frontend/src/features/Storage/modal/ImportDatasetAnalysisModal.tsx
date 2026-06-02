import React, { useCallback } from 'react';
import { useAppDispatch } from '@/features/App';
import { HelpButton, Modal, ModalFooter, ModalHeader, type ModalProps } from '@/components/ui';
import { Item } from '@/features/Storage';
import { useLoaderData } from '@tanstack/react-router';
import { queryClient } from '@/api/queryClient';
import { queryKeys } from '@/api/queryKeys';

export const ImportDatasetAnalysisModal: React.FC<ModalProps> = ({ onClose }) => {
    const { dataset } = useLoaderData({
        from: '/_authenticated/_admin/dataset/$datasetID',
        select: ({ dataset }) => ({ dataset }),
    })
    const dispatch = useAppDispatch();

    const invalidateSpectrogramList = useCallback(() => {
        if (!dataset) return
        queryClient.invalidateQueries({ queryKey: queryKeys.analysis.all({ datasetID: dataset.id }) })
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