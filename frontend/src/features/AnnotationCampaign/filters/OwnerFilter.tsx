import React, { useCallback } from "react";
import { useCampaignFilters } from "@/service/slices/filter.ts";
import { UserAPI } from "@/service/api/user.ts";
import { IonChip, IonIcon } from "@ionic/react";
import { closeCircle } from "ionicons/icons";

export const OwnerFilter: React.FC = () => {
  const { params, updateParams } = useCampaignFilters()
  const { data: user } = UserAPI.endpoints.getCurrentUser.useQuery();

  const toggle = useCallback(() => {
    if (params.owner) {
      updateParams({ owner: undefined })
    } else {
      updateParams({ owner: user?.id })
    }
  }, [ params, user ])

  return <IonChip outline={ !params.owner }
                  onClick={ toggle }
                  color={ params.owner ? 'primary' : 'medium' }>
    Owned campaigns
    { params.owner && <IonIcon icon={ closeCircle } color='primary'/> }
  </IonChip>
}
