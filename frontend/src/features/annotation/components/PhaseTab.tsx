import React, { Fragment, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { IonIcon, IonSkeletonText } from "@ionic/react";
import { addOutline, closeOutline } from "ionicons/icons";
import { useAlert, useModal } from "@/service/ui";
import { Button, Link } from "@/components/ui";
import { AnnotationPhaseType } from "@/features/_utils_";
import { useCurrentAnnotationCampaign, useEndPhaseMutation } from "../api";
import { usePathParams } from "../hooks";
import styles from "./styles.module.scss";
import { AnnotationPhaseCreateAnnotationModal, AnnotationPhaseCreateVerificationModal } from "./PhaseCreateModal.tsx";

export const AnnotationPhaseTab: React.FC<{ phaseType: AnnotationPhaseType }> = ({ phaseType: phaseType }) => {
  const { campaignID, phaseType: currentPhaseType } = usePathParams()
  const { campaign, phases, isFetching } = useCurrentAnnotationCampaign()
  const phase = useMemo(() => phases?.find(p => p.phase === phaseType), [ phases, phaseType ])

  const alert = useAlert();
  const verificationModal = useModal();
  const annotationModal = useModal();

  const openModal = useCallback(() => {
    switch (phaseType) {
      case AnnotationPhaseType.Annotation:
        annotationModal.toggle()
        break;
      case AnnotationPhaseType.Verification:
        if (!phases) return;
        if (phases.find(p => p.phase === 'Annotation')) return verificationModal.toggle()
        else {
          return alert.showAlert({
            type: 'Warning',
            message: 'A verification phase is made to check results from the "Annotation" phase. You should first create an "Annotation" phase, either to annotate the dataset or to import detectors annotations on it.',
            actions: [ {
              label: 'Create an "Annotation" phase',
              callback: annotationModal.toggle
            } ]
          })
        }
    }
  }, [ phases, verificationModal ])

  const [ endPhase ] = useEndPhaseMutation()
  const end = useCallback(async () => {
    if (!phase) return;
    if (phase.completedTasksCount < phase.tasksCount) {
      // If annotators haven't finished yet, ask for confirmation
      return alert.showAlert({
        type: 'Warning',
        message: 'There is still unprocessed files.\nAre you sure you want to end this phase?',
        actions: [ {
          label: 'End',
          callback: () => endPhase({ pk: phase.pk, campaignPk: campaignID })
        } ]
      });
    } else endPhase({ pk: phase.pk, campaignPk: campaignID })
  }, [ endPhase, phase, campaignID ]);

  if (!campaign) return <Fragment/>
  if (isFetching)
    return <Link appPath={ `/annotation-campaign/${ campaignID }/phase/${ phaseType }` } replace
                 className={ [ styles.tab, currentPhaseType === phaseType ? styles.active : undefined ].join(' ') }>
      <IonSkeletonText animated style={ { width: 96 } }/>
    </Link>
  if (phase)
    return <Link appPath={ `/annotation-campaign/${ campaignID }/phase/${ phaseType }` } replace
                 className={ [ styles.tab, currentPhaseType === phaseType ? styles.active : undefined ].join(' ') }>
      { phaseType }

      { campaign.canManage && currentPhaseType === phaseType && phase?.isOpen &&
          <IonIcon icon={ closeOutline } slot='end' onClick={ end }/> }
    </Link>
  if (!campaign.canManage) return <Fragment/>

  return <Fragment>
    <Button fill='clear' color='medium' onClick={ openModal }>
      { phaseType }
      <IonIcon icon={ addOutline } slot="end"/>
    </Button>

    { annotationModal.isOpen && createPortal(<AnnotationPhaseCreateAnnotationModal
      onClose={ annotationModal.close }/>, document.body) }
    { verificationModal.isOpen && createPortal(<AnnotationPhaseCreateVerificationModal
      onClose={ verificationModal.close }/>, document.body) }
  </Fragment>
}