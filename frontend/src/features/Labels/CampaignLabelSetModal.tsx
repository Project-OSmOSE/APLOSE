import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Modal, ModalFooter, ModalHeader, useModal, useToast, WarningText } from '@/components/ui';
import { IonButton, IonSpinner } from '@ionic/react';
import { createPortal } from 'react-dom';
import { AnnotationLabelNode, ErrorType, useCurrentCampaign, useUpdateCampaignFeaturedLabels } from '@/api';
import { LabelSetFeaturesSelect } from '@/features/Labels';
import styles from './styles.module.scss';


export const LabelSetModalButton: React.FC = () => {
  const modal = useModal()
  return <Fragment>
    <IonButton fill="outline" color="medium" className="ion-text-wrap" onClick={ modal.toggle }>
      Update labels with features
    </IonButton>
    { modal.isOpen && createPortal(<LabelSetModal onClose={ modal.toggle }/>, document.body) }
  </Fragment>
}
type Label = Pick<AnnotationLabelNode, 'id' | 'name'>

export const LabelSetModal: React.FC<{
  onClose?(): void;
}> = ({ onClose }) => {
  const { campaign, isFetching } = useCurrentCampaign()
  const toast = useToast();
  const {
    updateCampaignFeaturedLabels,
    isLoading: isSubmitting,
    error: patchError,
    formErrors,
    isSuccess: isPatchSuccessful,
  } = useUpdateCampaignFeaturedLabels();

  const [ labelsWithAcousticFeatures, setLabelsWithAcousticFeatures ] = useState<Label[]>([]);
  const [ disabled, setDisabled ] = useState<boolean>(true);

  useEffect(() => {
    setLabelsWithAcousticFeatures((campaign?.labelsWithAcousticFeatures?.filter(r => r !== null) ?? []) as Label[]);
  }, [ campaign?.labelsWithAcousticFeatures ]);

  useEffect(() => {
    if (patchError) toast.raiseError({ error: patchError });
  }, [ patchError ]);
  useEffect(() => {
    if (isPatchSuccessful) toast.presentSuccess(`Labels successfully updated`);
  }, [ isPatchSuccessful ]);

  const toggleDisabled = useCallback(() => {
    setDisabled(!disabled);
  }, [ disabled, setDisabled ])

  const onSave = useCallback(async () => {
    if (!campaign) return;
    try {
      await updateCampaignFeaturedLabels({
        id: campaign.id,
        labelsWithAcousticFeatures: labelsWithAcousticFeatures.map(l => l.id),
      }).unwrap();
    } finally {
      toggleDisabled()
    }
  }, [ updateCampaignFeaturedLabels, campaign, labelsWithAcousticFeatures, toggleDisabled ])

  return (
    <Modal onClose={ onClose } className={ [ styles.modal ].join(' ') }>
      <ModalHeader onClose={ onClose } title="Label set"/>

      { isFetching && <IonSpinner/> }

      { formErrors && <WarningText error={ formErrors }/> }

      { campaign?.labelSet && <LabelSetFeaturesSelect description={ campaign.labelSet.description ?? undefined }
                                                      error={ formErrors.find((e: ErrorType) => e.field === 'labelsWithAcousticFeatures')?.messages.join(' ') }
                                                      labels={ (campaign.labelSet.labels ?? []).filter(l => l !== null) as Label[] }
                                                      labelsWithAcousticFeatures={ labelsWithAcousticFeatures }
                                                      setLabelsWithAcousticFeatures={ setLabelsWithAcousticFeatures }/> }


      <ModalFooter>
        { campaign?.canManage && !campaign?.archive && (
          <IonButton fill="outline"
                     onClick={ toggleDisabled }
                     disabled={ isSubmitting || !disabled }>
            Update labels with features
          </IonButton>
        ) }
        { campaign?.canManage && !disabled && (
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
