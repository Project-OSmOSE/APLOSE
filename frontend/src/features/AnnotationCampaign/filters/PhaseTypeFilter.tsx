import React, { useCallback } from "react";
import { IonChip, IonIcon } from "@ionic/react";
import { closeCircle, swapHorizontal } from "ionicons/icons";
import { useCampaignFilters } from "@/service/slices/filter.ts";

export const PhaseTypeFilter: React.FC = () => {
  const { params, updateParams } = useCampaignFilters()

  const toggle = useCallback(() => {
    switch (params.phases__phase) {
      case undefined:
        updateParams({ phases__phase: 'A' })
        break;
      case 'A':
        updateParams({ phases__phase: 'V' })
        break;
      case 'V':
        updateParams({ phases__phase: undefined })
        break;
    }
  }, [ params ])

  return <IonChip outline={ !params.phases__phase }
                  onClick={ toggle }
                  color={ params.phases__phase ? 'primary' : 'medium' }>
    Campaign mode
    filter{ params.phases__phase && `: ${ params.phases__phase === 'A' ? 'Annotation' : 'Verification' }` }
    { params.phases__phase === 'A' && <IonIcon icon={ swapHorizontal }/> }
    { params.phases__phase === 'V' && <IonIcon icon={ closeCircle }/> }
  </IonChip>
}