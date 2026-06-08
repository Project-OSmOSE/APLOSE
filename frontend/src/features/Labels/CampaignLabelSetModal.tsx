import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, ModalFooter, ModalHeader, type ModalProps } from '@/components/ui';
import { Toast } from '@/components/base/Toast';
import { IonButton, IonSpinner } from '@ionic/react';
import { AnnotationLabelNode } from '@/api';
import { LabelSetFeaturesSelect } from '@/features/Labels';
import { AnnotationCampaign } from '@/features';
import styles from './styles.module.scss';
import { useParams } from '@tanstack/react-router';
import { cleanGqlList } from '@/api/utils';
import { useMutation, useQuery } from '@tanstack/react-query';


type Label = Pick<AnnotationLabelNode, 'id' | 'name'>

export const LabelSetModal: React.FC<ModalProps> = ({ onClose }) => {
    const { campaignID } = useParams({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const { data } = useQuery(AnnotationCampaign.API.byIdQuery({ id: campaignID }))
    const { campaign, labels } = useMemo(() => ({ ...data }), [ data ])
    const toastManager = Toast.useToastManager();
    const {
        mutateAsync: updateCampaignFeaturedLabels,
        isPending: isSubmitting,
        error: patchError,
        isSuccess: isPatchSuccessful,
    } = useMutation(AnnotationCampaign.API.updateFeaturedLabelsMutation);

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

    return (
        <Modal onClose={ onClose } className={ [ styles.modal ].join(' ') }>
            <ModalHeader onClose={ onClose }
                         title={ campaign!.labelSet?.name }
                         subtitle="Label set"/>

            { campaign!.labelSet && <Fragment>
                <LabelSetFeaturesSelect description={ campaign!.labelSet.description ?? undefined }
                                        labels={ labels ?? [] }
                                        labelsWithAcousticFeatures={ labelsWithAcousticFeatures }
                                        disabled={ disabled }
                                        setLabelsWithAcousticFeatures={ setLabelsWithAcousticFeatures }/>
            </Fragment> }


            <ModalFooter>
                { campaign!.isEditable && campaign!.isUserAllowedToManage && !campaign!.isArchived && (
                    <IonButton fill="outline"
                               onClick={ toggleDisabled }
                               disabled={ isSubmitting || !disabled }>
                        Update labels with features
                    </IonButton>
                ) }
                { campaign!.isEditable && campaign!.isUserAllowedToManage && !disabled && (
                    <IonButton fill="outline"
                               disabled={ isSubmitting }
                               onClick={ onSave }>
                        Save
                        { isSubmitting && <IonSpinner slot="end"/> }
                    </IonButton>
                ) }
            </ModalFooter>
        </Modal>
    )
}
