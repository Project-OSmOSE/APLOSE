import React, { Fragment, useCallback } from 'react';
import { ArchiveLinearIcon } from '@solar-icons/react';
import { useMutation } from '@tanstack/react-query';
import { Alert, Button, Spinner, Toast } from '@/components/base';
import type { AlertButton } from '@/components/base/Alert/Alert';
import { archiveMutation } from '../api';
import { AnnotationCampaignNode, AnnotationPhaseNode } from "@/api/types.gql-generated.ts";


export type ArchiveCampaignButtonProps = {
    campaign: Pick<AnnotationCampaignNode, 'id' | 'archived' | 'hasChangePermission'>
    phases: Pick<AnnotationPhaseNode, 'id' | 'archived' | 'completedTasksCount' | 'tasksCount'>[]
}
export const ArchiveCampaignButton: React.FC<ArchiveCampaignButtonProps> = ({ campaign, phases }) => {
    const { mutateAsync: archiveCampaign, isPending } = useMutation(archiveMutation)

    const alert = Alert.useManager()
    const toast = Toast.useManager()

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

        const progress = phases.reduce((previousValue, p) => previousValue + ((!p.archived ? p.completedTasksCount : p.tasksCount) ?? 0), 0);
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

        try {
            const data = await archiveCampaign(campaign)
            if (data?.error)
                toast.addError({ title: 'Fail archiving campaign', error: data.error })
        } catch (error) {
            toast.addError({ title: 'Fail archiving campaign', error })
        }
    }, [ phases, archiveCampaign, campaign, alert, toast ]);

    if (campaign.archived || !campaign.hasChangePermission) return <Fragment/>
    return <Fragment>
        <Button color="medium" onClick={ archive }>
            <ArchiveLinearIcon size={ 20 }/>
            Archive
            { isPending && <Spinner size={20}/> }
        </Button>
    </Fragment>
}
