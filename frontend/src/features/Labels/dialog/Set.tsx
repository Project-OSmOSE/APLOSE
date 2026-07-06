import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Toast } from '@/components/base/Toast';
import { AnnotationLabelNode } from '@/api';
import { Table } from '../component';
import { useParams } from '@tanstack/react-router';
import { cleanGqlList } from '@/api/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Dialog } from '@/components/base/Dialog';
import { Button, ButtonGroup } from '@/components/base/Button';
import { Spinner } from '@/components/base/Spinner';
import { CampaignAPI } from '@/features/AnnotationCampaign';


type Label = Pick<AnnotationLabelNode, 'id' | 'name'>

export const Set: React.FC = () => {
    const { campaignID } = useParams({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const { data } = useQuery(CampaignAPI.byIdQuery({ id: campaignID }))
    const { campaign, labels } = useMemo(() => ({ ...data }), [ data ])
    const toastManager = Toast.useToastManager();
    const {
        mutateAsync: updateCampaignFeaturedLabels,
        isPending: isSubmitting,
        error: patchError,
        isSuccess: isPatchSuccessful,
    } = useMutation(CampaignAPI.updateFeaturedLabelsMutation);

    const [ labelsWithAcousticFeatures, setLabelsWithAcousticFeatures ] = useState<Label[]>(cleanGqlList(campaign!.labelsWithAcousticFeatures));
    const [ disabled, setDisabled ] = useState<boolean>(true);

    useEffect(() => {
        if (patchError) toastManager.addError({ title: 'Update labels failed', error: patchError });
    }, [ patchError ]);
    useEffect(() => {
        if (isPatchSuccessful) toastManager.add({ title: `Labels successfully updated`, type: 'success' });
    }, [ isPatchSuccessful ]);

    const toggleDisabled = useCallback(() => {
        setDisabled(!disabled);
    }, [ disabled, setDisabled ])

    const onSave = useCallback(async () => {
        try {
            await updateCampaignFeaturedLabels({
                labelsWithAcousticFeatures: labelsWithAcousticFeatures.map(l => l.id),
                id: campaign!.id,
                labelSetID: campaign!.labelSet?.id ?? '',
                allowPointAnnotation: campaign!.allowPointAnnotation,
            });
        } finally {
            toggleDisabled()
        }
    }, [ updateCampaignFeaturedLabels, labelsWithAcousticFeatures, toggleDisabled, campaign ])

    if (!campaign?.labelSet) return <Fragment/>
    return (
        <Dialog.Content>
            <Dialog.Title>{ campaign.labelSet.name }</Dialog.Title>
            <Dialog.CloseIcon/>

            { campaign.labelSet.description && <Dialog.Description>
                { campaign.labelSet.description }
            </Dialog.Description> }

            <Table labels={ labels ?? [] }
                   labelsWithAcousticFeatures={ labelsWithAcousticFeatures }
                   disabled={ disabled }
                   setLabelsWithAcousticFeatures={ setLabelsWithAcousticFeatures }/>


            <ButtonGroup spaceBetween>
                { campaign!.isEditable && campaign!.isUserAllowedToManage && !campaign!.isArchived && (
                    <Button onClick={ toggleDisabled }
                            disabled={ isSubmitting || !disabled }>
                        Update labels with features
                    </Button>
                ) }
                { isSubmitting && <Spinner/> }
                { campaign!.isEditable && campaign!.isUserAllowedToManage && !disabled && (
                    <Button color="primary"
                            disabled={ isSubmitting }
                            onClick={ onSave }>
                        Save
                    </Button>
                ) }
            </ButtonGroup>
        </Dialog.Content>
    )
}
