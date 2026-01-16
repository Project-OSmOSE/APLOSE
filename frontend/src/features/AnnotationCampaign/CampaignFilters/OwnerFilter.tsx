import React, { useCallback } from 'react';
import { useAllCampaignsFilters, useCurrentUser } from '@/api';
import { IonChip, IonIcon } from '@ionic/react';
import { closeCircle } from 'ionicons/icons';

export const AnnotationCampaignOwnerFilter: React.FC = () => {
  const { params, updateParams } = useAllCampaignsFilters()
  const { user } = useCurrentUser();

  const toggle = useCallback(() => {
    if (params.filter_ownerID) {
      updateParams({ filter_ownerID: null })
    } else {
      updateParams({ filter_ownerID: user?.id })
    }
  }, [ params, user ])

  return <IonChip outline={ !params.filter_ownerID }
                  onClick={ toggle }
                  color={ params.filter_ownerID ? 'primary' : 'medium' }>
    Owned campaigns
    { params.filter_ownerID && <IonIcon icon={ closeCircle } color="primary"/> }
  </IonChip>
}
