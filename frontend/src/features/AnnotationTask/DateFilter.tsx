import React, { ChangeEvent, useCallback, useMemo } from 'react';
import { Button, Modal, type ModalProps } from '@/components/ui';
import { Input } from '@/components/form';
import { IonIcon } from '@ionic/react';
import { closeOutline } from 'ionicons/icons/index.js';
import { AllTasksFilters } from '@/api';
import styles from './styles.module.scss'
import { Route } from '@/routes/_authenticated/annotation-campaign/$campaignID/_detailLayout/phase.$phaseType';
import { useNavigate } from '@tanstack/react-router';


function getDateString(event: ChangeEvent<HTMLInputElement>): string | undefined {
    const value = event.currentTarget.value;
    if (!value) return undefined;
    const date = new Date(value);
    return new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
    )).toISOString()
}

export const DateFilterModal: React.FC<ModalProps & {
    onUpdate: () => void
}> = ({ onUpdate, onClose }) => {
    const { from, to } = Route.useSearch();
    const routeParams = Route.useParams()
    const navigate = useNavigate();

    const minDate: string = useMemo(() => {
        if (!from) return '';
        const date = from.split('');
        date.pop();
        return date.join('');
    }, [ from ]);
    const maxDate: string = useMemo(() => {
        if (!to) return '';
        const date = to.split('');
        date.pop();
        return date.join('');
    }, [ to ]);

    const update = useCallback((update: Partial<AllTasksFilters>) => {
        navigate({
            to: Route.to,
            params: routeParams,
            search: (prev) => ({
                ...prev,
                ...update,
                page: 1,
            }),
            replace: true,
        })
        onUpdate()
    }, [ navigate, routeParams, onUpdate ])

    return <Modal className={ styles.dateFilterModal }
                  onClose={ onClose }>
        <Input label="Minimum date" type="datetime-local" placeholder="Min date" step="1"
               value={ minDate }
               onChange={ event => update({ from: getDateString(event) }) }/>
        <Button fill="clear" onClick={ () => update({ from: undefined }) } disabled={ !minDate }>
            <IonIcon icon={ closeOutline }/>
        </Button>

        <Input label="Maximum date" type="datetime-local" placeholder="Max date" step="1"
               value={ maxDate }
               onChange={ event => update({ to: getDateString(event) }) }/>
        <Button fill="clear" onClick={ () => update({ to: undefined }) } disabled={ !maxDate }>
            <IonIcon icon={ closeOutline }/>
        </Button>
    </Modal>
}