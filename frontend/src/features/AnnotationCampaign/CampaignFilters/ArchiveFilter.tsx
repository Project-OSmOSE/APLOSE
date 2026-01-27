import React, { useCallback, useMemo } from 'react';
import { useAllCampaignsFilters } from '@/api';
import { IonChip, IonIcon } from '@ionic/react';
import { closeCircle, swapHorizontal } from 'ionicons/icons';

export const AnnotationCampaignArchiveFilter: React.FC = () => {
  const { params, updateParams } = useAllCampaignsFilters()

  const exists = useMemo(() => params.filter_isArchived !== undefined && params.filter_isArchived !== null, [ params.filter_isArchived ])

  const toggle = useCallback(() => {
    switch (params.filter_isArchived) {
      case false:
        updateParams({ filter_isArchived: true })
        break;
      case true:
        updateParams({ filter_isArchived: null })
        break;
      default: // undefined | null
        updateParams({ filter_isArchived: false })
        break;
    }
  }, [ params.filter_isArchived ])

  return <IonChip outline={ !exists }
                  onClick={ toggle }
                  color={ exists ? 'primary' : 'medium' }>
    Archived{ exists && `: ${ params.filter_isArchived ? 'True' : 'False' }` }
    { params.filter_isArchived === false && <IonIcon icon={ swapHorizontal }/> }
    { params.filter_isArchived === true && <IonIcon icon={ closeCircle }/> }
  </IonChip>
}