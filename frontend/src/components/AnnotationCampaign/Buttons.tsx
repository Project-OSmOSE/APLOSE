import React, { Fragment, useCallback } from "react";
import { IonButton, IonIcon } from "@ionic/react";
import { archiveOutline } from "ionicons/icons";
import { useAlert } from "@/service/ui";
import { CampaignAPI, useRetrieveCurrentCampaign } from "@/service/api/campaign.ts";
import { useListPhasesForCurrentCampaign } from "@/service/api/campaign-phase.ts";

export const AnnotationCampaignArchiveButton: React.FC = () => {
  const [ archiveCampaign ] = CampaignAPI.endpoints.archiveCampaign.useMutation()
  const { campaign, hasAdminAccess } = useRetrieveCurrentCampaign()
  const { phases } = useListPhasesForCurrentCampaign()
  const alert = useAlert();

  const archive = useCallback(async () => {
    if (!phases || !campaign) return;
    if (phases.length === 0) {
      return alert.showAlert({
        type: 'Warning',
        message: 'The campaign is empty.\nAre you sure you want to archive this campaign?',
        actions: [ {
          label: 'Archive',
          callback: () => archiveCampaign(campaign.id)
        } ]
      })
    }
    const progress = phases.reduce((previousValue, p) => previousValue + (p.ended_by ? p.global_total : p.global_progress), 0);
    const total = phases.reduce((previousValue, p) => previousValue + p.global_total, 0);
    if (progress < total) {
      // If annotators haven't finished yet, ask for confirmation
      return alert.showAlert({
        type: 'Warning',
        message: 'There is still unfinished annotations.\nAre you sure you want to archive this campaign?',
        actions: [ {
          label: 'Archive',
          callback: () => archiveCampaign(campaign.id)
        } ]
      });
    } else archiveCampaign(campaign.id)
  }, [ campaign, phases ]);

  if (!hasAdminAccess || !campaign || campaign.archive) return <Fragment/>
  return <IonButton color='medium' fill='outline' onClick={ archive }>
    <IonIcon icon={ archiveOutline } slot='start'/>
    Archive
  </IonButton>
}
