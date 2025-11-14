import React, { Fragment, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IonSpinner } from '@ionic/react';
import { Button, Modal, ModalHeader, WarningText } from '@/components/ui';
import { FormBloc, Input } from '@/components/form';
import { LabelSetSelect } from '@/features/Labels';
import { ConfidenceSetSelect } from '@/features/Confidence';
import {
  AnnotationLabelNode,
  LabelSetNode,
  Maybe,
  useCreateAnnotationPhase,
  useCreateVerificationPhase,
  useCurrentCampaign,
} from '@/api';
import styles from './styles.module.scss';

type Label = Pick<AnnotationLabelNode, 'id' | 'name'>
type LabelSet = Pick<LabelSetNode, 'id' | 'description'> & {
  labels: Array<Maybe<Label>>;
}

export const AnnotationPhaseCreateAnnotationModal: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const { campaign, isFetching: isFetchingCampaign, refetch } = useCurrentCampaign()
  const { isLoading: isPostingPhase, error, createAnnotationPhase, formErrors } = useCreateAnnotationPhase()
  const navigate = useNavigate()

  const [ labelSet, setLabelSet ] = useState<LabelSet | undefined>();
  const selectLabelSet = useCallback((labelSet?: LabelSet) => {
    setLabelSet(labelSet)
  }, []);

  const [ labelsWithAcousticFeatures, setLabelsWithAcousticFeatures ] = useState<Label[]>([]);
  const onLabelsWithFeaturesChange = useCallback((selection: Label[]) => {
    setLabelsWithAcousticFeatures(selection)
  }, [])

  const [ confidenceSetID, setConfidenceSetID ] = useState<string | undefined>();
  const selectConfidenceSetID = useCallback((id?: string) => {
    setConfidenceSetID(id)
  }, []);

  const [ allowPointAnnotation, setAllowPointAnnotation ] = useState<boolean>(false);
  const onAllowPointAnnotationChange = useCallback(() => {
    setAllowPointAnnotation(prev => !prev)
  }, [])


  const create = useCallback(async () => {
    if (!campaign) return;
    if (!labelSet) return;
    await createAnnotationPhase({
      campaignID: campaign.id,
      labelSetID: labelSet.id,
      confidenceSetID,
      labelsWithAcousticFeatures: labelsWithAcousticFeatures.map(l => l.id),
      allowPointAnnotation,
    }).unwrap()
    await refetch().unwrap()
    navigate(`/annotation-campaign/${ campaign.id }/phase/Annotation`)
  }, [ campaign, labelSet, confidenceSetID, labelsWithAcousticFeatures, allowPointAnnotation, createAnnotationPhase ])

  if (campaign?.isArchived) return <Fragment/>
  return <Modal onClose={ onClose } className={ styles.modal }>
    <ModalHeader title="New annotation phase" onClose={ onClose }/>

    <div className={ styles.content }>
      <p>In an "Annotation" phase, you create new annotations.</p>


      <FormBloc>

        <LabelSetSelect placeholder="Select a label set"
                        labelSetError={ formErrors.find(e => e.field === 'labelSet')?.messages.join(', ') }
                        labelsWithFeaturesError={ formErrors.find(e => e.field === 'labelsWithAcousticFeatures')?.messages.join(', ') }
                        selected={ labelSet }
                        onSelected={ selectLabelSet }
                        labelsWithAcousticFeatures={ labelsWithAcousticFeatures }
                        setLabelsWithAcousticFeatures={ onLabelsWithFeaturesChange }/>

        <ConfidenceSetSelect placeholder="Select a confidence set"
                             error={ formErrors.find(e => e.field === 'confidenceSet')?.messages.join(', ') }
                             selected={ confidenceSetID }
                             onSelected={ selectConfidenceSetID }/>

        <Input type="checkbox"
               label='Allow annotations of type "Point"'
               error={ formErrors.find(e => e.field === 'allowPointAnnotation')?.messages.join(', ') }
               checked={ allowPointAnnotation } onChange={ onAllowPointAnnotationChange }/>

      </FormBloc>

      { error && <WarningText error={ error }/> }
    </div>
    <div className={ styles.buttons }>
      <Button color="medium" fill="clear" onClick={ onClose }>
        Cancel
      </Button>

      <div className={ styles.buttons }>
        { (isPostingPhase || isFetchingCampaign) && <IonSpinner/> }
        <Button color="primary" fill="solid"
                disabled={ !campaign || !labelSet }
                onClick={ create }>
          Create
        </Button>
      </div>
    </div>
  </Modal>
}

export const AnnotationPhaseCreateVerificationModal: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const { campaign, phases, isFetching, refetch } = useCurrentCampaign()
  const { isLoading: isPostingPhase, error, createVerificationPhase } = useCreateVerificationPhase()
  const navigate = useNavigate()

  const create = useCallback(async () => {
    if (!campaign) return;
    await createVerificationPhase({ campaignID: campaign.id }).unwrap()
    await refetch().unwrap()
    navigate(`/annotation-campaign/${ campaign.id }/phase/Verification'`)
  }, [ campaign, createVerificationPhase ])

  const createAndImport = useCallback(async () => {
    if (!campaign) return;
    await createVerificationPhase({ campaignID: campaign.id }).unwrap()
    navigate(`/annotation-campaign/${ campaign.id }/phase/Annotation/import-annotations`)
  }, [ campaign, createVerificationPhase ])

  if (campaign?.isArchived || !phases) return <Fragment/>
  return <Modal onClose={ onClose } className={ styles.modal }>
    <ModalHeader title="New verification phase" onClose={ onClose }/>

    <div className={ styles.content }>
      <p>In a "Verification" phase, you can validate, reject, or add missing annotations.</p>
      <p>Annotations come from the "Annotation" phase and may be created manually or imported (e.g., from an automatic
        detector).</p>
      { error && <WarningText error={ error }/> }
    </div>

    <div className={ styles.buttons }>
      <Button color="medium" fill="clear" onClick={ onClose }>
        Cancel
      </Button>

      <div className={ styles.buttons }>
        { (isPostingPhase || isFetching) && <IonSpinner/> }
        <Button color="primary" fill="clear" onClick={ createAndImport }>
          Create and import annotations
        </Button>
        <Button color="primary" fill="solid"
                disabled={ !campaign }
                onClick={ create }>
          Create
        </Button>
      </div>
    </div>
  </Modal>
}
