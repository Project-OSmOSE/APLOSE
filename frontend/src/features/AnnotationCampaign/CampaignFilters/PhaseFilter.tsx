import React, { useCallback } from 'react';
import { AnnotationPhaseType } from '@/api';
import { IonChip, IonIcon } from '@ionic/react';
import { closeCircle } from 'ionicons/icons';
import { useNavigate, useSearch } from '@tanstack/react-router';

export const AnnotationCampaignPhaseTypeFilter: React.FC = () => {
  const filter_phase  = useSearch({from: '/_authenticated/annotation-campaign/', select: ({ filter_phase }) => filter_phase });
  const navigate = useNavigate();

  const toggle = useCallback(() => {
    navigate({
      to: '/annotation-campaign',
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
