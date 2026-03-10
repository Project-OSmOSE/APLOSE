import React from 'react';
import styles from './styles.module.scss'
import { Modal, type ModalProps } from '@/components/ui';
import { Switch } from '@/components/form';
import { AnnotationTaskStatus, useAllTasksFilters } from '@/api';

export const StatusFilterModal: React.FC<ModalProps & {
    onUpdate: () => void
}> = ({ onUpdate, onClose }) => {
    const { params, updateParams } = useAllTasksFilters()

    function setState(option: string) {
        let status: AnnotationTaskStatus | undefined = undefined;
        switch (option) {
            case AnnotationTaskStatus.Created:
            case AnnotationTaskStatus.Finished:
                status = option
                break;
        }
        updateParams({ status })
        onUpdate()
    }

    function valueToBooleanOption(value?: AnnotationTaskStatus | null): 'Unset' | 'Created' | 'Finished' {
        return value ?? 'Unset'
    }

    return <Modal className={ styles.filterModal }
                  onClose={ onClose }>

        <Switch label="Status" options={ [ 'Unset', 'Created', 'Finished' ] }
                value={ valueToBooleanOption(params.status) }
                onValueSelected={ setState }/>

    </Modal>
}