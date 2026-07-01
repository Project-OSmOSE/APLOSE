import React, { Fragment, useCallback } from 'react';
import { archiveMutation } from '../api';
import { useLoaderData } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/base/Button';
import { Archive } from '@solar-icons/react';
import { Alert } from '@/components/base';
import type { AlertButton } from '@/components/base/Alert/Alert';

export const ArchiveButton: React.FC = () => {
    const { campaign, phases } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const { mutate: archiveCampaign } = useMutation(archiveMutation)

    const alert = Alert.useManager()

    const archive = useCallback(async () => {
        const buttons: AlertButton<boolean>[] = [
            { type: 'Cancel' },
            {
                type: 'Confirm',
                confirmData: true,
                color: 'warning',
                text: 'Archive',
            },
        ]
        if (phases.length === 0) {
            const confirm = await alert.present({
                color: 'warning',
                title: 'Empty campaign',
                message: <Fragment>
                    The campaign is empty.<br/>
                    Are you sure you want to archive this campaign?
                </Fragment>,
                buttons,
            })
            if (!confirm) return;
        }

        const progress = phases.reduce((previousValue, p) => previousValue + ((p.isOpen ? p.completedTasksCount : p.tasksCount) ?? 0), 0);
        const total = phases.reduce((previousValue, p) => previousValue + (p.tasksCount ?? 0), 0);
        if (progress < total) {
            const confirm = await alert.present({
                color: 'warning',
                title: 'Unfinished campaign',
                message: <Fragment>
                    There is still unfinished annotations.<br/>
                    Are you sure you want to archive this campaign?
                </Fragment>,
                buttons,
            })
            if (!confirm) return;
        }

        archiveCampaign(campaign)
    }, [ phases, archiveCampaign, campaign, alert ]);

    if (campaign.isArchived || !campaign.isEditable || !campaign.isUserAllowedToManage) return <Fragment/>
    return <Fragment>
        <Button color="medium" onClick={ archive }>
            <Archive weight="Linear" size={ 20 }/>
            Archive
        </Button>
    </Fragment>
}
