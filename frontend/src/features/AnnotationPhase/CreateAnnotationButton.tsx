import React, { Fragment, useCallback, useState } from "react";
import styles from "./styles.module.scss";
import { CampaignAPI, PatchAnnotationCampaign, useRetrieveCurrentCampaign } from "@/service/api/campaign.ts";
import { useModal } from "@/service/ui/modal.ts";
import { Button, Modal, ModalHeader, WarningText } from "@/components/ui";
import { IonIcon, IonNote, IonSpinner } from "@ionic/react";
import { addOutline } from "ionicons/icons";
import { createPortal } from "react-dom";
import { CampaignPhaseAPI } from "@/service/api/campaign-phase.ts";
import { LabelSetAPI } from "@/service/api/label-set.ts";
import { ConfidenceSetAPI } from "@/service/api/confidence-set.ts";
import { useNavigate } from "react-router-dom";
import { ConfidenceIndicatorSet, LabelSet } from "@/service/types";
import { FormBloc, Input, Select } from "@/components/form";
import { getErrorMessage } from "@/service/function.ts";
import { LabelSetDisplay } from "@/components/AnnotationCampaign";

type Errors = { [key in keyof PatchAnnotationCampaign]?: string }

export const CreateAnnotationButton: React.FC = () => {
  const { campaign } = useRetrieveCurrentCampaign()
  const modal = useModal();

  if (campaign?.archive) return <Fragment/>
  return <Fragment>
    <Button fill='clear' color='medium' onClick={ modal.toggle }>
      Annotation
      <IonIcon icon={ addOutline } slot="end"/>
    </Button>

    { modal.isOpen && createPortal(<CreateAnnotationModal onClose={ modal.close }/>, document.body) }
  </Fragment>
}

export const CreateAnnotationModal: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const { campaign, isFetching: isFetchingCampaign, refetch } = useRetrieveCurrentCampaign()
  const [ postPhase, {
    isLoading: isPostingPhase,
    error: phaseError
  } ] = CampaignPhaseAPI.endpoints.postCampaignPhase.useMutation()
  const [ patchCampaign, {
    isLoading: isUpdatingCampaign,
    error: campaignError
  } ] = CampaignAPI.endpoints.patchCampaign.useMutation()
  const {
    data: allLabelSets,
    isFetching: isFetchingLabelSets,
    error: labelSetsError
  } = LabelSetAPI.endpoints.listLabelSet.useQuery();
  const {
    data: allConfidenceSets,
    isFetching: isFetchingConfidenceSets,
    error: confidenceSetsError
  } = ConfidenceSetAPI.endpoints.listConfidenceSet.useQuery();
  const navigate = useNavigate()

  const [ errors, setErrors ] = useState<Errors>({});
  const [ labelSet, setLabelSet ] = useState<LabelSet | null | undefined>(); // null stands for empty label set
  const [ labels_with_acoustic_features, setLabelsWithAcousticFeatures ] = useState<Array<string>>([]);
  const [ confidenceSet, setConfidenceSet ] = useState<ConfidenceIndicatorSet | undefined>();
  const [ allow_point_annotation, setAllowPointAnnotation ] = useState<boolean>(false);
  const onLabelSetChange = useCallback((value: number | string | undefined) => {
    if (value === 0) {
      setLabelSet(null)
    } else {
      setLabelSet(allLabelSets?.find(l => l.id === value))
    }
    setErrors(prev => ({ ...prev, label_set: undefined }))
  }, [ allLabelSets ])
  const onLabelWithAcousticFeaturesChange = useCallback((selection: Array<string>) => {
    setLabelsWithAcousticFeatures(selection)
    setErrors(prev => ({ ...prev, labels_with_acoustic_features: undefined }))
  }, [])
  const onConfidenceSetChange = useCallback((value: number | string | undefined) => {
    setConfidenceSet(allConfidenceSets?.find(c => c.id === value))
    setErrors(prev => ({ ...prev, confidence_set: undefined }))
  }, [ allConfidenceSets ])
  const onAllowPointAnnotationChange = useCallback(() => {
    setAllowPointAnnotation(prev => !prev)
    setErrors(prev => ({ ...prev, allow_point_annotation: undefined }))
  }, [])

  const create = useCallback(async () => {
    if (!campaign) return;
    await patchCampaign({
      id: campaign.id,
      label_set: labelSet === null ? 0 : labelSet?.id,
      confidence_set: confidenceSet?.id,
      labels_with_acoustic_features,
      allow_point_annotation,
    }).unwrap()
    const phase = await postPhase({ campaign, phase: 'Annotation' }).unwrap()
    await refetch().unwrap()
    navigate(`/annotation-campaign/${ campaign?.id }/phase/${ phase.phase }`)
  }, [ campaign, labelSet, confidenceSet, labels_with_acoustic_features, allow_point_annotation ])

  if (campaign?.archive) return <Fragment/>
  return <Modal onClose={ onClose } className={ styles.modal }>
    <ModalHeader title='New annotation phase' onClose={ onClose }/>

    <div className={ styles.content }>
      <p>In an "Annotation" phase, you create new annotations.</p>


      <FormBloc>
        { (isFetchingLabelSets || isFetchingConfidenceSets) && <IonSpinner/> }

        {/*  /!* Label set */ }
        { labelSetsError &&
            <WarningText>Fail loading label sets:<br/>{ getErrorMessage(labelSetsError) }</WarningText> }
        { allLabelSets && <Select label="Label set" placeholder="Select a label set" error={ errors.label_set }
                                  options={ [ { value: 0, label: 'Empty' }, ...(allLabelSets?.map(s => ({
                                    value: s.id,
                                    label: s.name
                                  })) ?? []) ] }
                                  optionsContainer="alert"
                                  disabled={ !allLabelSets?.length }
                                  value={ labelSet === null ? 0 : labelSet?.id }
                                  onValueSelected={ onLabelSetChange }
                                  required>
          { labelSet && (<LabelSetDisplay set={ labelSet }
                                          labelsWithAcousticFeatures={ labels_with_acoustic_features }
                                          setLabelsWithAcousticFeatures={ onLabelWithAcousticFeaturesChange }/>) }

          { allLabelSets.length === 0 &&
              <IonNote>You need to create a label set to use it in your campaign</IonNote> }
        </Select> }

        {/*  /!* Confidence set */ }
        { confidenceSetsError &&
            <WarningText>Fail loading confidence sets:<br/>{ getErrorMessage(confidenceSetsError) }
            </WarningText> }
        { allConfidenceSets && <Select label="Confidence indicator set" placeholder="Select a confidence set"
                                       error={ errors.confidence_set }
                                       options={ allConfidenceSets?.map(s => ({ value: s.id, label: s.name })) ?? [] }
                                       optionsContainer="alert"
                                       disabled={ !allConfidenceSets?.length }
                                       value={ confidenceSet?.id }
                                       onValueSelected={ onConfidenceSetChange }>
          { confidenceSet && (
            <Fragment>
              { confidenceSet.desc.split('\r\n').map(d => <p key={ d }>{ d }</p>) }
              { confidenceSet.confidence_indicators.map(c => (
                <p key={ c.level }><b>{ c.level }:</b> { c.label }</p>
              )) }
            </Fragment>)
          }
          { allConfidenceSets.length === 0 &&
              <IonNote>You need to create a confidence set to use it in your campaign</IonNote> }
        </Select> }

        <Input type="checkbox" label='Allow annotations of type "Point"'
               checked={ allow_point_annotation } onChange={ onAllowPointAnnotationChange }/>

      </FormBloc>

      { phaseError && <WarningText>{ getErrorMessage(phaseError) }</WarningText> }
      { campaignError && <WarningText>{ getErrorMessage(campaignError) }</WarningText> }
    </div>
    <div className={ styles.buttons }>
      <Button color="medium" fill='clear' onClick={ onClose }>
        Cancel
      </Button>

      <div className={ styles.buttons }>
        { (isUpdatingCampaign || isPostingPhase || isFetchingCampaign) && <IonSpinner/> }
        <Button color="primary" fill='solid' onClick={ create }>
          Create
        </Button>
      </div>
    </div>
  </Modal>
}