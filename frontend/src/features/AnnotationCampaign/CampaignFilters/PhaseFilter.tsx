import React, { useCallback } from 'react';
import { AnnotationPhaseType, useAllCampaignsFilters } from '@/api';
import { IonChip, IonIcon } from '@ionic/react';
import { closeCircle } from 'ionicons/icons';

export const AnnotationCampaignPhaseTypeFilter: React.FC = () => {
  const { params, updateParams } = useAllCampaignsFilters()

  const toggle = useCallback(() => {
    if (!params.filter_phase) updateParams({ filter_phase: AnnotationPhaseType.Verification })
    else updateParams({ filter_phase: null })
  }, [ params ])

  return <IonChip outline={ !params.filter_phase }
                  onClick={ toggle }
                  color={ params.filter_phase === AnnotationPhaseType.Verification ? 'primary' : 'medium' }>
    Has verification
    { params.filter_phase === AnnotationPhaseType.Verification && <IonIcon icon={ closeCircle } color="primary"/> }
  </IonChip>
}
