import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Modal, ModalFooter, ModalHeader, type ModalProps, useToast, WarningText } from '@/components/ui';
import { IonButton, IonSpinner } from '@ionic/react';
import { AnnotationLabelNode, ErrorType, useCurrentCampaign, useUpdateCampaignFeaturedLabels } from '@/api';
import { LabelSetFeaturesSelect } from '@/features/Labels';
import styles from './styles.module.scss';


type Label = Pick<AnnotationLabelNode, 'id' | 'name'>

export const LabelSetModal: React.FC<ModalProps> = ({ onClose }) => {
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
    setLabelsWithAcousticFeatures((campaign?.labelsWithAcousticFeatures ?? []) as Label[]);
  }, [ campaign ]);

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
    try {
      await updateCampaignFeaturedLabels({
        labelsWithAcousticFeatures: labelsWithAcousticFeatures.map(l => l.id),
      });
    } finally {
      toggleDisabled()
    }
  }, [ updateCampaignFeaturedLabels, labelsWithAcousticFeatures, toggleDisabled ])

  return (
    <Modal onClose={ onClose } className={ [ styles.modal ].join(' ') }>
      <ModalHeader onClose={ onClose }
                   title={ campaign?.labelSet?.name }
                   subtitle="Label set"/>

      { isFetching && <IonSpinner/> }

      { formErrors.length > 0 && <WarningText error={ formErrors }/> }

      { campaign?.labelSet && <Fragment>
          <LabelSetFeaturesSelect description={ campaign?.labelSet.description ?? undefined }
                                  error={ formErrors.find((e: ErrorType) => e.field === 'labelsWithAcousticFeatures')?.messages.join(' ') }
                                  labels={ (campaign?.labelSet.labels ?? []).filter(l => l !== null) as Label[] }
                                  labelsWithAcousticFeatures={ labelsWithAcousticFeatures }
                                  disabled={ disabled }
                                  setLabelsWithAcousticFeatures={ setLabelsWithAcousticFeatures }/>
      </Fragment> }


      <ModalFooter>
        { campaign?.canManage && !campaign?.isArchived && (
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
