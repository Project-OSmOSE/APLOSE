import React, { Fragment, useCallback, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { Modal, ModalFooter, ModalHeader } from "@/components/ui";
import { IonButton, IonSpinner } from "@ionic/react";
import { getErrorMessage } from "@/service/function.ts";
import { AnnotationCampaignLabelSetDisplay } from "../LabelSetTable";
import { useToast } from "@/service/ui";
import { AnnotationCampaignAPI } from "../api";
import { useModal } from "@/service/ui/modal.ts";
import { createPortal } from "react-dom";

type Props = {
  id: string;
  isEditAllowed?: boolean | null,
  labelSet: {
    description?: string | null,
    labels?: {
      results: Array<{ name: string } | null>
    } | null
  },
  labelsWithAcousticFeatures?: {
    results: Array<{ name: string } | null>
  } | null,
}

export const AnnotationCampaignLabelsWithFeaturesModalButton: React.FC<Omit<Props, 'labelSet'> & {
  labelSet?: Props['labelSet'] | null;
}> = ({ labelSet, ...props }) => {
  const modal = useModal()

  if (!labelSet) return <Fragment/>
  return <Fragment>
    <IonButton fill='outline' color='medium' className='ion-text-wrap' onClick={ modal.toggle }>
      Update labels with features
    </IonButton>
    { modal.isOpen && createPortal(<AnnotationCampaignLabelsWithFeaturesModal { ...props }
                                                                              labelSet={ labelSet }
                                                                              onClose={ modal.toggle }/>, document.body) }
  </Fragment>
}


export const AnnotationCampaignLabelsWithFeaturesModal: React.FC<Props & {
  onClose?(): void
}> = ({
        onClose,
        id,
        isEditAllowed,
        labelSet,
        labelsWithAcousticFeatures: initialLabelsWithAcousticFeatures
      }) => {
  const toast = useToast();
  const [ patch, {
    isLoading,
    error,
    isSuccess
  } ] = AnnotationCampaignAPI.endpoints.postUpdateAnnotationCampaignLabelsWithFeatures.useMutation()

  const [ labelsWithAcousticFeatures, setLabelsWithAcousticFeatures ] = useState<string[]>([]);
  const [ disabled, setDisabled ] = useState<boolean>(true);

  const updateLabelsWithAcousticFeatures = useCallback(() => {
    setLabelsWithAcousticFeatures(initialLabelsWithAcousticFeatures?.results?.filter(l => l !== null).map(l => l.name) ?? [])
  }, [ initialLabelsWithAcousticFeatures ])

  useEffect(() => {
    updateLabelsWithAcousticFeatures()
    return () => {
      toast.dismiss()
    }
  }, []);
  useEffect(() => {
    updateLabelsWithAcousticFeatures()
  }, [ updateLabelsWithAcousticFeatures ]);
  useEffect(() => {
    if (error) toast.presentError(getErrorMessage(error));
  }, [ error ]);
  useEffect(() => {
    if (isSuccess) toast.presentSuccess(`Labels successfully updated`);
  }, [ isSuccess ]);

  const toggleDisabled = useCallback(() => {
    setDisabled(!disabled);
  }, [ setDisabled, disabled ])

  const onSave = useCallback(async () => {
    try {
      await patch({ id, labels: labelsWithAcousticFeatures }).unwrap();
    } finally {
      toggleDisabled()
    }
  }, [ id, labelsWithAcousticFeatures, patch, toggleDisabled ]);

  return (
    <Modal onClose={ onClose } className={ [ styles.labelsModal ].join(' ') }>
      <ModalHeader onClose={ onClose } title='Label set'/>

      <AnnotationCampaignLabelSetDisplay labelSet={ labelSet }
                                         disabled={ disabled }
                                         labelsWithAcousticFeatures={ labelsWithAcousticFeatures }
                                         setLabelsWithAcousticFeatures={ setLabelsWithAcousticFeatures }/>
      <ModalFooter>
        { isEditAllowed && (
          <IonButton fill='outline'
                     onClick={ toggleDisabled }
                     disabled={ isLoading || !disabled }>
            Update labels with features
          </IonButton>
        ) }
        { isEditAllowed && !disabled && (
          <IonButton fill='outline'
                     disabled={ isLoading }
                     onClick={ onSave }>
            Save
            { isLoading && <IonSpinner slot='end'/> }
          </IonButton>
        ) }
      </ModalFooter>
    </Modal>)
}