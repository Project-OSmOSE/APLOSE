import React, { Fragment, useEffect, useMemo } from 'react';
import { IonNote, IonSpinner } from '@ionic/react';
import { CheckRead, Unread } from '@solar-icons/react';

import { TaskStatusEnum } from '@/api';
import { Progress } from '@/components/ui';
import { useAppSelector } from '@/features/App';

import { use } from '../hook'
import { Slice } from '../Slice'

/**
 *
 * @param taskIDs
 * @param otherStates {TaskStatusEnum[]} in TaskStatusEnum.Cancelled, TaskStatusEnum.Completed
 * @constructor
 */
export const GroupIndicator: React.FC<{ taskIDs: string[] }> = ({ taskIDs }) => {
    const { register, unregister } = use()
    useEffect(() => {
        for (const taskID of taskIDs) register(taskID);
        return () => {
            for (const taskID of taskIDs) unregister(taskID);
        }
    }, [ taskIDs ]);

    const tasks = useAppSelector(state => Slice.selectors.selectTasks(state, taskIDs))

    return useMemo(() => {
        const completion = tasks.reduce((count, task) => {
            switch (task.status) {
                case TaskStatusEnum.Success:
                    return count + 1
                case TaskStatusEnum.Started:
                    return count + task.completion_percentage
                default:
                    return count
            }
        }, 0);

        if (completion === tasks.length) {
            return <CheckRead color="success" size={ 24 }/>
        } else if (completion > 1) {
            return <Fragment>
                <IonSpinner/>
                <Progress label="Imported spectrograms"
                          value={ completion } total={ tasks.length }/>
                <Unread/>
            </Fragment>
        } else if (completion > 0) {
            return <Fragment>
                <IonSpinner/>
                <Progress label="Imported spectrograms"
                          value={ completion } total={ tasks.length }/>
            </Fragment>
        }

        const allStatus = tasks.map(t => t.status)
        if (allStatus.find(s => s == TaskStatusEnum.Pending))
            return <IonNote>Pending...</IonNote>
        return <Fragment/>
    }, [ tasks ])
}
