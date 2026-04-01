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
    taskID?: string | null,
    forceState?: TaskStatusEnum | false | null,
    disableRetry?: boolean,
}> = ({ taskID, forceState, disableRetry = false }) => {
    const { register, unregister, request } = use()
    useEffect(() => {
        if (!taskID) return;

        register(taskID);
        return () => {
            unregister(taskID);
        }
    }, [ taskID ]);

    const taskSelector = useCallback((state: AppState) => {
        if (!taskID) return undefined;
        return Slice.selectors.selectTask(state, taskID)
    }, [ taskID ])
    const task = useAppSelector(taskSelector)

    return useMemo(() => {
        if (!task && !forceState) return <Fragment/>
        switch (task?.status ?? forceState) {
            case TaskStatusEnum.Cancelled:
                return <Fragment/>
            case TaskStatusEnum.Pending:
                return <IonNote>Pending...</IonNote>
            case TaskStatusEnum.Completed:
                return <Unread color="success" size={ 24 }/>
        }

        if (!task) return <Fragment/>
        switch (task.status) {
            case TaskStatusEnum.Failed:
                return <Fragment>
                    <IonNote color="danger" className={ styles.errorNote }>Import failed: { task.error }</IonNote>
                    <CopyErrorStackButton stack={ task.error_trace }/>
                    { !disableRetry && <Button fill="clear" onClick={ () => request({
                        command: 'retry',
                        task_id: task.id.toString(),
                    }) }>
                        Retry
                    </Button> }
                </Fragment>
            case TaskStatusEnum.Processing:
                return <Fragment>
                    <IonSpinner/>
                    <Progress label="Importing spectrograms"
                              value={ task.completed_spectrograms }
                              total={ task.total_spectrograms ?? 0 }
                              note={`~${formatTime(task.duration * (1 - task.completion_percentage) / task.completion_percentage)} remaining`}/>
                </Fragment>
        }
    }, [ task, forceState, request, disableRetry ])
}
