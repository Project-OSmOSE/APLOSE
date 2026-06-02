import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Modal, ModalFooter, ModalHeader, type ModalProps, useToast } from '@/components/ui';
import { IonButton, IonSpinner } from '@ionic/react';
import { AnnotationLabelNode } from '@/api';
import { LabelSetFeaturesSelect } from '@/features/Labels';
import { AnnotationCampaign } from '@/features';
import styles from './styles.module.scss';
import { useLoaderData } from '@tanstack/react-router';
import { cleanGqlList } from '@/api/utils';
import { useMutation } from '@tanstack/react-query';


type Label = Pick<AnnotationLabelNode, 'id' | 'name'>

export const LabelSetModal: React.FC<ModalProps> = ({ onClose }) => {
  const { campaign } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
  const toast = useToast();
  const {
    mutateAsync: updateCampaignFeaturedLabels,
    isPending: isSubmitting,
    error: patchError,
    isSuccess: isPatchSuccessful,
  } = useMutation(AnnotationCampaign.API.updateFeaturedLabelsMutation);

  const [ labelsWithAcousticFeatures, setLabelsWithAcousticFeatures ] = useState<Label[]>(cleanGqlList(campaign.labelsWithAcousticFeatures));
  const [ disabled, setDisabled ] = useState<boolean>(true);

  useEffect(() => {
    if (patchError) toast.raiseError({ error: patchError });
  }, [ patchError ]);
  useEffect(() => {
    if (isPatchSuccessful) toast.present(`Labels successfully updated`, 'success');
  }, [ isPatchSuccessful ]);

  const toggleDisabled = useCallback(() => {
    setDisabled(!disabled);
  }, [ disabled, setDisabled ])

  const onSave = useCallback(async () => {
    try {
      await updateCampaignFeaturedLabels({
        labelsWithAcousticFeatures: labelsWithAcousticFeatures.map(l => l.id),
        id: campaign.id,
        labelSetID: campaign.labelSet?.id ?? '',
        allowPointAnnotation: campaign.allowPointAnnotation,
      });
    } finally {
      toggleDisabled()
    }
  }, [ updateCampaignFeaturedLabels, labelsWithAcousticFeatures, toggleDisabled, campaign ])

  return (
    <Modal onClose={ onClose } className={ [ styles.modal ].join(' ') }>
      <ModalHeader onClose={ onClose }
                   title={ campaign.labelSet?.name }
                   subtitle="Label set"/>

      { campaign.labelSet && <Fragment>
          <LabelSetFeaturesSelect description={ campaign.labelSet.description ?? undefined }
                                  labels={ (campaign.labelSet.labels ?? []).filter(l => l !== null) as Label[] }
                                  labelsWithAcousticFeatures={ labelsWithAcousticFeatures }
                                  disabled={ disabled }
                                  setLabelsWithAcousticFeatures={ setLabelsWithAcousticFeatures }/>
      </Fragment> }


      <ModalFooter>
        { campaign.isEditable && campaign.isUserAllowedToManage && !campaign.isArchived && (
          <IonButton fill="outline"
                     onClick={ toggleDisabled }
                     disabled={ isSubmitting || !disabled }>
            Update labels with features
          </IonButton>
        ) }
        { campaign.isEditable && campaign.isUserAllowedToManage && !disabled && (
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
