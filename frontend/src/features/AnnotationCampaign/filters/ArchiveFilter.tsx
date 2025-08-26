import React, { useCallback } from "react";
import { IonChip, IonIcon } from "@ionic/react";
import { closeCircle, swapHorizontal } from "ionicons/icons";
import { useCampaignFilters } from "@/service/slices/filter.ts";

export const ArchiveFilter: React.FC = () => {
  const { params, updateParams } = useCampaignFilters()

  const toggle = useCallback(() => {
    switch (params.archive__isnull) {
      case undefined:
        updateParams({ archive__isnull: true })
        break;
      case false:
        updateParams({ archive__isnull: undefined })
        break;
      case true:
        updateParams({ archive__isnull: false })
        break;
    }
  }, [ params ])

  return <IonChip outline={ params.archive__isnull === undefined }
                  onClick={ toggle }
                  color={ params.archive__isnull !== undefined ? 'primary' : 'medium' }>
    Archived{ params.archive__isnull !== undefined && `: ${ params.archive__isnull ? 'False' : 'True' }` }
    { params.archive__isnull === true && <IonIcon icon={ swapHorizontal }/> }
    { params.archive__isnull === false && <IonIcon icon={ closeCircle }/> }
  </IonChip>
}