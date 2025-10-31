import React, { Fragment, useCallback } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { archiveOutline } from 'ionicons/icons/index.js';
import { useAlert } from '@/components/ui';
import { useArchiveCampaign, useCurrentCampaign } from '@/api';

export const AnnotationCampaignArchiveButton: React.FC = () => {
  const { campaign, phases } = useCurrentCampaign()
  const { archiveCampaign } = useArchiveCampaign()
  const alert = useAlert();

  const archive = useCallback(async () => {
    if (!phases || !campaign) return;
    if (phases.length === 0) {
      return alert.showAlert({
        type: 'Warning',
        message: 'The campaign is empty.\nAre you sure you want to archive this campaign?',
        actions: [ {
          label: 'Archive',
          callback: () => archiveCampaign(campaign),
        } ],
      })
    }
    const progress = phases.reduce((previousValue, p) => previousValue + ((p.isOpen ? p.completedTasksCount : p.tasksCount) ?? 0), 0);
    const total = phases.reduce((previousValue, p) => previousValue + (p.tasksCount ?? 0), 0);
    if (progress < total) {
      // If annotators haven't finished yet, ask for confirmation
      return alert.showAlert({
        type: 'Warning',
        message: 'There is still unfinished annotations.\nAre you sure you want to archive this campaign?',
        actions: [ {
          label: 'Archive',
          callback: () => archiveCampaign(campaign),
        } ],
      });
    } else archiveCampaign(campaign)
  }, [ campaign, phases ]);

  if (!campaign || campaign.isArchived || !campaign.canManage) return <Fragment/>
  return <IonButton color="medium" fill="outline" onClick={ archive }>
    <IonIcon icon={ archiveOutline } slot="start"/>
    Archive
  </IonButton>
}
