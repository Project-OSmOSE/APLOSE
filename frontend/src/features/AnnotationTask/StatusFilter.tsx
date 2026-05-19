import React, { useCallback } from 'react';
import styles from './styles.module.scss'
import { Modal, type ModalProps } from '@/components/ui';
import { Switch } from '@/components/form';
import { AnnotationTaskStatus } from '@/api';
import { Route } from '@/routes/_authenticated/annotation-campaign/$campaignID/_detailLayout/phase.$phaseType';
import { useNavigate } from '@tanstack/react-router';

export const StatusFilterModal: React.FC<ModalProps & {
    onUpdate: () => void
}> = ({ onUpdate, onClose }) => {
    const status = Route.useSearch({select: ({status}) => status});
    const routeParams = Route.useParams()
    const navigate = useNavigate();

    const setState = useCallback((option: string) => {
        let status: AnnotationTaskStatus | undefined = undefined;
        switch (option) {
            case AnnotationTaskStatus.Created:
            case AnnotationTaskStatus.Finished:
                status = option
                break;
        }
        navigate({
            to: Route.to,
            params: routeParams,
            search: (prev) => ({
                ...prev, status, page: 1,
            }),
            replace: true,
        })
        onUpdate()
    }, [ navigate, routeParams, onUpdate ])

    function valueToBooleanOption(value?: AnnotationTaskStatus | null): 'Unset' | 'Created' | 'Finished' {
        return value ?? 'Unset'
    }

    return <Modal className={ styles.filterModal }
                  onClose={ onClose }>

        <Switch label="Status" options={ [ 'Unset', 'Created', 'Finished' ] }
                value={ valueToBooleanOption(status) }
                onValueSelected={ setState }/>

    </Modal>
}