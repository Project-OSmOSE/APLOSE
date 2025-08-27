import React, { Fragment, useCallback } from "react";
import styles from "./styles.module.scss";
import { useRetrieveCurrentCampaign } from "@/service/api/campaign.ts";
import { useModal } from "@/service/ui/modal.ts";
import { Button, Modal, ModalHeader, WarningText } from "@/components/ui";
import { IonIcon, IonSpinner } from "@ionic/react";
import { addOutline } from "ionicons/icons";
import { createPortal } from "react-dom";
import { CampaignPhaseAPI, useListPhasesForCurrentCampaign } from "@/service/api/campaign-phase.ts";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "@/service/function.ts";
import { useAlert } from "@/service/ui";
import { CreateAnnotationModal } from './CreateAnnotationButton'

export const CreateVerificationButton: React.FC = () => {
  const { campaign } = useRetrieveCurrentCampaign()
  const { phases } = useListPhasesForCurrentCampaign()
  const verificationModal = useModal();
  const annotationModal = useModal();
  const alert = useAlert();


  const openModal = useCallback(() => {
    if (!phases) return;
    if (phases.find(p => p.phase === 'Annotation')) verificationModal.toggle()
    else {
      return alert.showAlert({
        type: 'Warning',
        message: 'A verification phase is made to check results from the "Annotation" phase. You should first create an "Annotation" phase, either to annotate the dataset or to import detectors annotations on it.',
        actions: [ {
          label: 'Create an "Annotation" campaign',
          callback: annotationModal.toggle
        } ]
      })
    }
  }, [ phases, verificationModal ])

  if (campaign?.archive || !phases) return <Fragment/>
  return <Fragment>
    <Button fill='clear' color='medium' onClick={ openModal }>
      Verification
      <IonIcon icon={ addOutline } slot="end"/>
    </Button>

    { verificationModal.isOpen && createPortal(<CreateVerificationModal
      onClose={ verificationModal.close }/>, document.body) }
    { annotationModal.isOpen && createPortal(<CreateAnnotationModal
      onClose={ annotationModal.close }/>, document.body) }
  </Fragment>
}

export const CreateVerificationModal: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const { campaign, isFetching: isFetchingCampaign, refetch } = useRetrieveCurrentCampaign()
  const { phases } = useListPhasesForCurrentCampaign()
  const [ post, { isLoading: isPostingPhase, error } ] = CampaignPhaseAPI.endpoints.postCampaignPhase.useMutation()
  const navigate = useNavigate()

  const create = useCallback(async () => {
    if (!campaign) return;
    const phase = await post({ campaign, phase: 'Verification' }).unwrap()
    await refetch().unwrap()
    navigate(`/annotation-campaign/${ campaign?.id }/phase/${ phase.phase }`)
  }, [ campaign ])

  const createAndImport = useCallback(async () => {
    if (!campaign) return;
    const phase = await post({ campaign, phase: 'Verification' }).unwrap()
    navigate(`/annotation-campaign/${ campaign?.id }/phase/${ phase.phase }/import-annotations`)
  }, [ campaign ])

  if (campaign?.archive || !phases) return <Fragment/>
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
        { (isPostingPhase || isFetchingCampaign) && <IonSpinner/> }
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