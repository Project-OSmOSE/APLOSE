import React, { useCallback } from 'react';
import { useCurrentUser } from '@/api';
import { IonChip, IonIcon } from '@ionic/react';
import { closeCircle } from 'ionicons/icons';
import { Route } from '@/routes/_authenticated/annotation-campaign';
import { useNavigate } from '@tanstack/react-router';

export const AnnotationCampaignOwnerFilter: React.FC = () => {
  const { filter_ownerID } = Route.useSearch();
  const navigate = useNavigate();

  const { user } = useCurrentUser();

  const toggle = useCallback(() => {
    navigate({
      to: Route.to,
      search: (prev) => ({
        ...prev,
        filter_ownerID: prev?.filter_ownerID ? null : user?.id,
      }),
      replace: true,
    })
  }, [ navigate, user ])

  return <IonChip outline={ !filter_ownerID }
                  onClick={ toggle }
                  color={ filter_ownerID ? 'primary' : 'medium' }>
    Owned campaigns
    { filter_ownerID && <IonIcon icon={ closeCircle } color="primary"/> }
  </IonChip>
}
