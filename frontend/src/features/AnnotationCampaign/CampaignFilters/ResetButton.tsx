import React, { Fragment, useCallback, useMemo } from 'react';
import { useAllCampaignsFilters, useCurrentUser } from '@/api';
import { IonButton, IonIcon } from '@ionic/react';
import { refreshOutline } from 'ionicons/icons';

export const AnnotationCampaignResetFiltersButton: React.FC = () => {
  const { params, updateParams } = useAllCampaignsFilters()
  const { user } = useCurrentUser();

  const canReset = useMemo(() => {
    return !(!params.search && params.filter_isArchived == false && !params.filter_phase && !!params.filter_annotatorID && !params.filter_ownerID)
  }, [ params ]);
  const resetFilters = useCallback(() => {
    updateParams({
      search: null,
      filter_isArchived: false,
      filter_phase: null,
      filter_annotatorID: user?.id,
      filter_ownerID: null,
    })
  }, [ params, user ])

  if (!canReset) return <Fragment/>
  return <IonButton fill="clear" color="medium" onClick={ resetFilters }>
    <IonIcon icon={ refreshOutline } slot="start"/>
    Reset
  </IonButton>
}