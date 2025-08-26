import React, { useCallback } from "react";
import { useCampaignFilters } from "@/service/slices/filter.ts";
import { UserAPI } from "@/service/api/user.ts";
import { IonChip, IonIcon } from "@ionic/react";
import { closeCircle } from "ionicons/icons";

export const AnnotatorFilter: React.FC = () => {
  const { params, updateParams } = useCampaignFilters()
  const { data: user } = UserAPI.endpoints.getCurrentUser.useQuery();

  const toggle = useCallback(() => {
    if (params.phases__annotation_file_ranges__annotator_id) {
      updateParams({ phases__annotation_file_ranges__annotator_id: undefined })
    } else {
      updateParams({ phases__annotation_file_ranges__annotator_id: user?.id })
    }
  }, [ params, user ])

  return <IonChip outline={ !params.phases__annotation_file_ranges__annotator_id }
                  onClick={ toggle }
                  color={ params.phases__annotation_file_ranges__annotator_id ? 'primary' : 'medium' }>
    My work
    { params.phases__annotation_file_ranges__annotator_id && <IonIcon icon={ closeCircle } color='primary'/> }
  </IonChip>
}
