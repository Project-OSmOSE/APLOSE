import React, { Fragment, useCallback } from "react";
import { useAlert } from "@/service/ui";
import { IonButton, IonIcon } from "@ionic/react";
import { archiveOutline, helpBuoyOutline } from "ionicons/icons";
import { AnnotationCampaignAPI } from "./api";
import { Link } from "@/components/ui";

export const AnnotationCampaignArchiveButton: React.FC<{
  id: string;
  archive?: any;
  phases?: {
    results: Array<{
      isFinished?: boolean | null
    } | null>
  } | null,
  isEditAllowed?: boolean | null,
}> = ({ id, archive, phases, isEditAllowed }) => {
  const [ archiveCampaign ] = AnnotationCampaignAPI.endpoints.postArchiveAnnotationCampaign.useMutation()
  const alert = useAlert();

  const doArchive = useCallback(async () => {
    if (!phases?.results || phases.results.filter(p => p !== null).length === 0) {
      return alert.showAlert({
        type: 'Warning',
        message: 'The campaign is empty.\nAre you sure you want to archive this campaign?',
        actions: [ {
          label: 'Archive',
          callback: () => archiveCampaign({ id })
        } ]
      })
    }
    const arePhasesFinished = phases.results.filter(p => p !== null).reduce((previousValue, p) => previousValue && !!p.isFinished, true);
    if (!arePhasesFinished) {
      // If annotators haven't finished yet, ask for confirmation
      return alert.showAlert({
        type: 'Warning',
        message: 'There is still unfinished annotations.\nAre you sure you want to archive this campaign?',
        actions: [ {
          label: 'Archive',
          callback: () => archiveCampaign({ id })
        } ]
      });
    } else archiveCampaign({ id })
  }, [ phases, id ]);

  if (!isEditAllowed || archive) return <Fragment/>
  return <IonButton color='medium' fill='outline' onClick={ doArchive }>
    <IonIcon icon={ archiveOutline } slot='start'/>
    Archive
  </IonButton>
}

export const AnnotationCampaignInstructionsButton: React.FC<{
  instructionsUrl?: string | null,
}> = ({ instructionsUrl }) => {
  if (!instructionsUrl) return <Fragment/>
  return <Link color='warning' fill='outline' href={ instructionsUrl }>
    <IonIcon icon={ helpBuoyOutline } slot="start"/>
    Instructions
  </Link>
}