import React from 'react';
import { Modal, ModalFooter, ModalHeader, type ModalProps } from '@/components/ui';
import { Item } from '@/features/Storage';
import { useLoaderData } from '@tanstack/react-router';
import { HelpButton } from '@/components/base/Button';

export const ImportDatasetAnalysisModal: React.FC<ModalProps> = ({ onClose }) => {
    const { dataset } = useLoaderData({
        from: '/_authenticated/_admin/dataset/$datasetID',
        select: ({ dataset }) => ({ dataset }),
    })

    return (
        <Modal onClose={ onClose }>
            <ModalHeader title="Import an analysis"
                         onClose={ onClose }/>

            { dataset && <Item path={ dataset.path } forceOpen disableImport/> }

            <ModalFooter>
                <HelpButton url="/doc/user/data/generate">
                    How to generate a dataset
                </HelpButton>
            </ModalFooter>
        </Modal>
    )
}