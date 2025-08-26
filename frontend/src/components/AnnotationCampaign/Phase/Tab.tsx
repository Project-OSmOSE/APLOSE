import React, { Fragment, useCallback, useMemo } from "react";
import { Phase } from "@/service/types";
import { Link } from "@/components/ui";
import {
  CreateAnnotationPhaseButton,
  CreateVerificationPhaseButton
} from "@/components/AnnotationCampaign/Phase/CreateButton.tsx";
import {
  CampaignPhaseAPI,
  useListPhasesForCurrentCampaign,
  useRetrieveCurrentPhase
} from "@/service/api/campaign-phase.ts";
import { useRetrieveCurrentCampaign } from "@/service/api/campaign.ts";
import styles from './styles.module.scss'
import { closeOutline } from "ionicons/icons";
import { IonIcon, IonSkeletonText } from "@ionic/react";
import { useAlert } from "@/service/ui";

export const CampaignPhaseTab: React.FC<{ phaseType: Phase }> = ({ phaseType: phaseType }) => {
  const { campaign, hasAdminAccess } = useRetrieveCurrentCampaign()
  const { phaseType: currentPhaseType } = useRetrieveCurrentPhase()
  const { phases, isFetching: isFetchingPhases } = useListPhasesForCurrentCampaign()
  const [ endPhase ] = CampaignPhaseAPI.endpoints.endCampaignPhase.useMutation()
  const phase = useMemo(() => phases?.find(p => p.phase === phaseType), [ phases, phaseType ])
  const alert = useAlert();

  const end = useCallback(async () => {
    if (!phase) return;
    if (phase.global_progress < phase.global_total) {
      // If annotators haven't finished yet, ask for confirmation
      return alert.showAlert({
        type: 'Warning',
        message: 'There is still unprocessed files.\nAre you sure you want to end this phase?',
        actions: [ {
          label: 'End',
          callback: () => endPhase(phase.id)
        } ]
      });
    } else endPhase(phase.id)
  }, [ phase ]);

  if (!campaign) return <Fragment/>
  if (isFetchingPhases)
    return <Link appPath={ `/annotation-campaign/${ campaign.id }/phase/${ phaseType }` } replace
                 className={ [ styles.tab, currentPhaseType === phaseType ? styles.active : undefined ].join(' ') }>
      <IonSkeletonText animated style={ { width: 96 } }/>
    </Link>
  if (phase)
    return <Link appPath={ `/annotation-campaign/${ campaign.id }/phase/${ phaseType }` } replace
                 className={ [ styles.tab, currentPhaseType === phaseType ? styles.active : undefined ].join(' ') }>
      { phaseType }

      { hasAdminAccess && currentPhaseType === phaseType && !phase?.ended_by &&
          <IonIcon icon={ closeOutline } slot='end' onClick={ end }/> }
    </Link>
  if (!hasAdminAccess) return <Fragment/>
  return phaseType === 'Annotation' ? <CreateAnnotationPhaseButton/> : <CreateVerificationPhaseButton/>
}