import React, { useCallback } from 'react';
import { useAllCampaignsFilters, useCurrentUser } from '@/api';
import { IonChip, IonIcon } from '@ionic/react';
import { closeCircle } from 'ionicons/icons';

export const AnnotationCampaignAnnotatorFilter: React.FC = () => {
  const { params, updateParams } = useAllCampaignsFilters()
  const { user } = useCurrentUser();

  const toggle = useCallback(() => {
    if (params.filter_annotatorID) {
      updateParams({ filter_annotatorID: null })
    } else {
      updateParams({ filter_annotatorID: user?.id })
    }
  }, [ params, user ])

  return <IonChip outline={ !params.filter_annotatorID }
                  onClick={ toggle }
                  color={ params.filter_annotatorID ? 'primary' : 'medium' }>
    My work
    { params.filter_annotatorID && <IonIcon icon={ closeCircle } color="primary"/> }
  </IonChip>
}
