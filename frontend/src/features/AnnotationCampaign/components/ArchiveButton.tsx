import React, { Fragment, useCallback } from 'react';
import { archiveMutation } from '../api';
import { useLoaderData } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/base/Button';
import { Archive } from '@solar-icons/react';
import { Dialog } from '@/components/base/Dialog';
import { ArchiveEmptyConfirmation, ArchiveUnfinishedConfirmation } from '@/features/AnnotationCampaign/modal';

export const ArchiveButton: React.FC = () => {
    const { campaign, phases } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const { mutate: archiveCampaign } = useMutation(archiveMutation)

    const emptyConfirmDialog = Dialog.createHandle();
    const unfinishedConfirmDialog = Dialog.createHandle();

    const confirmArchive = useCallback(() => {
        archiveCampaign(campaign)
    }, [ archiveCampaign, campaign ])

    const archive = useCallback(async () => {
        if (phases.length === 0)
            return emptyConfirmDialog.open(null)

        const progress = phases.reduce((previousValue, p) => previousValue + ((p.isOpen ? p.completedTasksCount : p.tasksCount) ?? 0), 0);
        const total = phases.reduce((previousValue, p) => previousValue + (p.tasksCount ?? 0), 0);
        if (progress < total)
            return unfinishedConfirmDialog.open(null)

        confirmArchive()
    }, [ phases, confirmArchive, emptyConfirmDialog, unfinishedConfirmDialog ]);

    if (campaign.isArchived || !campaign.isEditable || !campaign.isUserAllowedToManage) return <Fragment/>
    return <Fragment>
        <Button color="medium" onClick={ archive }>
            <Archive weight="Linear" size={ 20 }/>
            Archive
        </Button>

        <Dialog.Root handle={ emptyConfirmDialog }>
            <Dialog.Portal>
                <ArchiveEmptyConfirmation onConfirm={ confirmArchive }/>
            </Dialog.Portal>
        </Dialog.Root>

        <Dialog.Root handle={ unfinishedConfirmDialog }>
            <Dialog.Portal>
                <ArchiveUnfinishedConfirmation onConfirm={ confirmArchive }/>
            </Dialog.Portal>
        </Dialog.Root>
    </Fragment>
}
