import React, { useCallback } from 'react';
import styles from './styles.module.scss'
import { Modal, type ModalProps } from '@/components/ui';
import { Input, Switch } from '@/components/form';
import { AnnotationTaskStatus, useCurrentUser } from '@/api';
import { Route } from '@/routes/_authenticated/annotation-campaign/$campaignID/_detailLayout/phase.$phaseType';
import { useNavigate } from '@tanstack/react-router';

export const StatusFilterModal: React.FC<ModalProps & {
    onUpdate: () => void
}> = ({ onUpdate, onClose }) => {
    const { user } = useCurrentUser()
    const { status, onlyAssigned } = Route.useSearch({select: ({status, onlyAssigned}) => ({ status, onlyAssigned })});
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

    const onOnlyAssignedChanged = useCallback(() => {
        navigate({
            to: Route.to,
            params: routeParams,
            search: (prev) => ({
                ...prev, onlyAssigned: !prev?.onlyAssigned, page: 1,
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

        { user?.isAdmin &&
            <Input type="checkbox"
                   label="Display only assigned tasks"
                   checked={ onlyAssigned ?? false }
                   onChange={ onOnlyAssignedChanged }/>}

    </Modal>
}