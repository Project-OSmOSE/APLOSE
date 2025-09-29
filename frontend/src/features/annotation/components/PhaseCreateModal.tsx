import React, { Fragment, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IonSpinner } from "@ionic/react";
import { getErrorMessage } from "@/service/function.ts";
import { Button, Modal, ModalHeader, WarningText } from "@/components/ui";
import {
  useCreateAnnotationPhaseMutation,
  useCreateVerificationPhaseMutation,
  useCurrentAnnotationCampaign
} from "../api";
import styles from "./styles.module.scss";
import { FormBloc, Input } from "@/components/form";
import { LabelSetSelect } from "./LabelSetSelect.tsx";
import { ConfidenceSetSelect } from "./ConfidenceSetSelect";
import { CreateAnnotationPhaseMutationVariables } from "../api/annotation.generated.ts";

type Errors = { [key in keyof CreateAnnotationPhaseMutationVariables]?: string }

export const AnnotationPhaseCreateAnnotationModal: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const { campaign, isFetching: isFetchingCampaign, refetch } = useCurrentAnnotationCampaign()
  const [ post, { isLoading: isPostingPhase, error } ] = useCreateAnnotationPhaseMutation()
  const navigate = useNavigate()

  const [ errors, setErrors ] = useState<Errors>({});

  const [ labelSetPk, setLabelSetPk ] = useState<number | undefined>();
  const selectLabelSetPk = useCallback((pk?: number) => {
    setLabelSetPk(pk)
    setErrors(prev => ({ ...prev, labelSetPk: undefined }))
  }, []);

  const [ labelsWithAcousticFeatures, setLabelsWithAcousticFeatures ] = useState<string[]>([]);
  const onLabelsWithFeaturesChange = useCallback((selection: string[]) => {
    setLabelsWithAcousticFeatures(selection)
    setErrors(prev => ({ ...prev, labelsWithAcousticFeatures: undefined }))
  }, [])

  const [ confidenceSetPk, setConfidenceSetPk ] = useState<number | undefined>();
  const selectConfidenceSetPk = useCallback((pk?: number) => {
    setConfidenceSetPk(pk)
    setErrors(prev => ({ ...prev, confidenceSetPk: undefined }))
  }, []);

  const [ allowPointAnnotation, setAllowPointAnnotation ] = useState<boolean>(false);
  const onAllowPointAnnotationChange = useCallback(() => {
    setAllowPointAnnotation(prev => !prev)
    setErrors(prev => ({ ...prev, allowPointAnnotation: undefined }))
  }, [])


  const create = useCallback(async () => {
    if (!campaign) return;
    await post({
      campaignPk: campaign.pk,
      labelSetPk, confidenceSetPk,
      labelsWithAcousticFeatures,
      allowPointAnnotation
    }).unwrap()
    await refetch().unwrap()
    navigate(`/annotation-campaign/${ campaign.pk }/phase/Annotation`)
  }, [ campaign, labelSetPk, confidenceSetPk, labelsWithAcousticFeatures, allowPointAnnotation ])

  if (campaign?.isArchived) return <Fragment/>
  return <Modal onClose={ onClose } className={ styles.modal }>
    <ModalHeader title='New annotation phase' onClose={ onClose }/>

    <div className={ styles.content }>
      <p>In an "Annotation" phase, you create new annotations.</p>


      <FormBloc>

        <LabelSetSelect placeholder="Select a label set"
                        error={ errors.labelSetPk }
                        selected={ labelSetPk }
                        onSelected={ selectLabelSetPk }
                        labelsWithAcousticFeatures={ labelsWithAcousticFeatures }
                        setLabelsWithAcousticFeatures={ onLabelsWithFeaturesChange }/>

        <ConfidenceSetSelect placeholder="Select a confidence set"
                             error={ errors.confidenceSetPk }
                             selected={ confidenceSetPk }
                             onSelected={ selectConfidenceSetPk }/>

        <Input type="checkbox" label='Allow annotations of type "Point"'
               checked={ allowPointAnnotation } onChange={ onAllowPointAnnotationChange }/>

      </FormBloc>

      { error && <WarningText>{ getErrorMessage(error) }</WarningText> }
    </div>
    <div className={ styles.buttons }>
      <Button color="medium" fill='clear' onClick={ onClose }>
        Cancel
      </Button>

      <div className={ styles.buttons }>
        { (isPostingPhase || isFetchingCampaign) && <IonSpinner/> }
        <Button color="primary" fill='solid' onClick={ create }>
          Create
        </Button>
      </div>
    </div>
  </Modal>
}

export const AnnotationPhaseCreateVerificationModal: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const { campaign, phases, isFetching, refetch } = useCurrentAnnotationCampaign()
  const [ post, { isLoading: isPostingPhase, error } ] = useCreateVerificationPhaseMutation()
  const navigate = useNavigate()

  const create = useCallback(async () => {
    if (!campaign) return;
    await post({ campaignPk: campaign.pk }).unwrap()
    await refetch().unwrap()
    navigate(`/annotation-campaign/${ campaign.pk }/phase/Verification'`)
  }, [ campaign ])

  const createAndImport = useCallback(async () => {
    if (!campaign) return;
    await post({ campaignPk: campaign.pk }).unwrap()
    navigate(`/annotation-campaign/${ campaign.pk }/phase/Annotation/import-annotations`)
  }, [ campaign ])

  if (campaign?.isArchived || !phases) return <Fragment/>
  return <Modal onClose={ onClose } className={ styles.modal }>
    <ModalHeader title='New verification phase' onClose={ onClose }/>

    <div className={ styles.content }>
      <p>In a "Verification" phase, you can validate, reject, or add missing annotations.</p>
      <p>Annotations come from the "Annotation" phase and may be created manually or imported (e.g., from an automatic
        detector).</p>
      { error && <WarningText>{ getErrorMessage(error) }</WarningText> }
    </div>

    <div className={ styles.buttons }>
      <Button color="medium" fill='clear' onClick={ onClose }>
        Cancel
      </Button>

      <div className={ styles.buttons }>
        { (isPostingPhase || isFetching) && <IonSpinner/> }
        <Button color="primary" fill='clear' onClick={ createAndImport }>
          Create and import annotations
        </Button>
        <Button color="primary" fill='solid' onClick={ create }>
          Create
        </Button>
      </div>
    </div>
  </Modal>
}
