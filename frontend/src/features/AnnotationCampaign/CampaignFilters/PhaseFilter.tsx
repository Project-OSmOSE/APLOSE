import React, { useCallback } from 'react';
import { AnnotationPhaseType } from '@/api';
import { IonChip, IonIcon } from '@ionic/react';
import { closeCircle } from 'ionicons/icons';
import { Route } from '@/routes/_authenticated/annotation-campaign';
import { useNavigate } from '@tanstack/react-router';

export const AnnotationCampaignPhaseTypeFilter: React.FC = () => {
  const { filter_phase } = Route.useSearch();
  const navigate = useNavigate();

  const toggle = useCallback(() => {
    navigate({
      to: Route.to,
      search: (prev) => ({
        ...prev,
        filter_phase: !prev?.filter_phase ? AnnotationPhaseType.Verification : null,
      }),
      replace: true,
    })
  }, [ navigate ])

  return <IonChip outline={ !filter_phase }
                  onClick={ toggle }
                  color={ filter_phase === AnnotationPhaseType.Verification ? 'primary' : 'medium' }>
    Has verification
    { filter_phase === AnnotationPhaseType.Verification && <IonIcon icon={ closeCircle } color="primary"/> }
  </IonChip>
}
