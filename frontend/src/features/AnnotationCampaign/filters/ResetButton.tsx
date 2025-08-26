import React, { Fragment, useCallback, useMemo } from "react";
import { useCampaignFilters } from "@/service/slices/filter.ts";
import { IonButton, IonIcon } from "@ionic/react";
import { refreshOutline } from "ionicons/icons";
import { UserAPI } from "@/service/api/user.ts";

export const ResetButton: React.FC = () => {
  const { params, updateParams } = useCampaignFilters()
  const { data: user } = UserAPI.endpoints.getCurrentUser.useQuery();

  const canReset = useMemo(() => {
    return !(!params.search && params.archive__isnull == true && !params.phases__phase && !!params.phases__annotation_file_ranges__annotator_id && !params.owner)
  }, [ params ]);
  const resetFilters = useCallback(() => {
    updateParams({
      search: undefined,
      archive__isnull: true,
      phases__phase: undefined,
      phases__annotation_file_ranges__annotator_id: user?.id,
      owner: undefined,
    })
  }, [ params, user ])

  if (!canReset) return <Fragment/>
  return <IonButton fill='clear' color='medium' onClick={ resetFilters }>
    <IonIcon icon={ refreshOutline } slot='start'/>
    Reset
  </IonButton>
}