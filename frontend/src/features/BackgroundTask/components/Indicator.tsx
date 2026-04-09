import React, { Fragment, useCallback, useEffect, useMemo } from 'react';
import { IonNote, IonSpinner } from '@ionic/react';
import { Unread } from '@solar-icons/react';

import { TaskStatusEnum } from '@/api';
import { Button, CopyErrorStackButton, Progress } from '@/components/ui';
import { type AppState, useAppSelector } from '@/features/App';

import { use } from '../hook'
import { Slice } from '../Slice'
import styles from './styles.module.scss'
import { formatTime } from '@/service/function';

export const Indicator: React.FC<{
    identifier?: string | null,
    forceState?: TaskStatusEnum | false | null,
    disableRetry?: boolean,
}> = ({ identifier, forceState, disableRetry = false }) => {
    const { register, unregister, request } = use()
    useEffect(() => {
        if (!identifier) return;

        register(identifier);
        return () => {
            unregister(identifier);
        }
    }, [ identifier ]);

    const taskSelector = useCallback((state: AppState) => {
        if (!identifier) return undefined;
        return Slice.selectors.selectTask(state, identifier)
    }, [ identifier ])
    const task = useAppSelector(taskSelector)

    return useMemo(() => {
        if (!task && !forceState) return <Fragment/>
        switch (task?.status ?? forceState) {
            case TaskStatusEnum.Revoked:
                return <Fragment/>
            case TaskStatusEnum.Pending:
                return <IonNote>Pending...</IonNote>
            case TaskStatusEnum.Success:
                return <Unread color="success" size={ 24 }/>
        }

        if (!task) return <Fragment/>
        switch (task.status) {
            case TaskStatusEnum.Failure:
                return <Fragment>
                    <IonNote color="danger" className={ styles.errorNote }>Import failed: { task.error }</IonNote>
                    <CopyErrorStackButton stack={ task.error_trace }/>
                    { !disableRetry && <Button fill="clear" onClick={ () => request({
                        command: 'retry',
                        identifier: task.identifier,
                    }) }>
                        Retry
                    </Button> }
                </Fragment>
            case TaskStatusEnum.Started:
                return <Fragment>
                    <IonSpinner/>
                    <Progress label="Importing spectrograms"
                              value={ task.other_info.completed_spectrograms }
                              total={ task.other_info.total_spectrograms ?? 0 }
                              note={ `~${ formatTime(task.duration * (1 - task.completion_percentage) / (task.completion_percentage - task.started_at_completion)) } remaining` }/>
                </Fragment>
        }
    }, [ task, forceState, request, disableRetry ])
}
