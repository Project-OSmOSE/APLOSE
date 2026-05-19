import React, { Fragment, useCallback, useMemo } from 'react';
import { type AllCampaignFilters, useCurrentUser } from '@/api';
import { IonButton, IonIcon } from '@ionic/react';
import { refreshOutline } from 'ionicons/icons';
import { Route } from '@/routes/_authenticated/annotation-campaign';
import { useNavigate } from '@tanstack/react-router';

export const AnnotationCampaignResetFiltersButton: React.FC = () => {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();
  const { user } = useCurrentUser();

  const canReset = useMemo(() => {
    return !(!searchParams.search && searchParams.filter_isArchived == false && !searchParams.filter_phase && !!searchParams.filter_annotatorID && !searchParams.filter_ownerID)
  }, [ searchParams ]);
  const resetFilters = useCallback(() => {
    navigate({
      to: Route.to,
      search: {
        search: null,
        filter_isArchived: false,
        filter_phase: null,
        filter_annotatorID: user?.id,
        filter_ownerID: null,
        filter_datasetID: null,
      } as AllCampaignFilters,
    })
  }, [ navigate, user ])

  if (!canReset) return <Fragment/>
  return <IonButton fill="clear" color="medium" onClick={ resetFilters }>
    <IonIcon icon={ refreshOutline } slot="start"/>
    Reset
  </IonButton>
}