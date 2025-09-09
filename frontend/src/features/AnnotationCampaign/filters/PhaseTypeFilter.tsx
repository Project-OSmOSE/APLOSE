import React, { useCallback } from "react";
import { IonChip, IonIcon } from "@ionic/react";
import { closeCircle } from "ionicons/icons";
import { useCampaignFilters } from "@/service/slices/filter.ts";

export const PhaseTypeFilter: React.FC = () => {
  const { params, updateParams } = useCampaignFilters()

  const toggle = useCallback(() => {
    if (!params.phases__phase) updateParams({ phases__phase: 'V' })
    else updateParams({ phases__phase: undefined })
  }, [ params ])

  return <IonChip outline={ !params.phases__phase }
                  onClick={ toggle }
                  color={ params.phases__phase === 'V' ? 'primary' : 'medium' }>
    Has verification
    { params.phases__phase === 'V' && <IonIcon icon={ closeCircle } color='primary'/> }
  </IonChip>
}