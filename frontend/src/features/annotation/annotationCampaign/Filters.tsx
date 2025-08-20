import React, { Fragment, useCallback } from "react";
import { useCampaignFilters } from "@/features/annotation/annotationCampaign/filter.ts";
import { IonButton, IonChip, IonIcon } from "@ionic/react";
import { closeCircle, refreshOutline, swapHorizontal } from "ionicons/icons";
import { UserAPI } from "@/service/api/user.ts";

export const AnnotationCampaignFilters: React.FC = () => {
  const { params, updateParams, resetParams, hasFilters } = useCampaignFilters()
  const { data: user } = UserAPI.endpoints.getCurrentUser.useQuery();

  const toggleMyWorkFilter = useCallback(() => {
    updateParams({ annotatorID: params.annotatorID ? undefined : user?.id })
  }, [ params, user ])

  const toggleArchiveFilter = useCallback(() => {
    updateParams({ isArchived: params.isArchived === undefined ? false : !params.isArchived ? true : undefined })
  }, [ params ])

  const toggleModeFilter = useCallback(() => {
    updateParams({ phase: params.phase === undefined ? 'A' : params.phase === 'A' ? 'V' : undefined })
  }, [ params ])

  const toggleOnlyMineFilter = useCallback(() => {
    updateParams({ ownerID: params.ownerID ? undefined : user?.id })
  }, [ params, user ])

  return <Fragment>

    <IonChip outline={ !params.annotatorID }
             onClick={ toggleMyWorkFilter }
             color={ params.annotatorID ? 'primary' : 'medium' }>
      My work
      { params.annotatorID && <IonIcon icon={ closeCircle } color='primary'/> }
    </IonChip>

    <IonChip outline={ params.isArchived === undefined }
             onClick={ toggleArchiveFilter }
             color={ params.isArchived !== undefined ? 'primary' : 'medium' }>
      Archived{ params.isArchived !== undefined && `: ${ params.isArchived ? 'True' : 'False' }` }
      { params.isArchived === false && <IonIcon icon={ swapHorizontal }/> }
      { params.isArchived === true && <IonIcon icon={ closeCircle }/> }
    </IonChip>

    <IonChip outline={ !params.phase }
             onClick={ toggleModeFilter }
             color={ params.phase ? 'primary' : 'medium' }>
      Campaign mode
      filter{ params.phase && `: ${ params.phase === 'A' ? 'Annotation' : 'Verification' }` }
      { params.phase === 'A' && <IonIcon icon={ swapHorizontal }/> }
      { params.phase === 'V' && <IonIcon icon={ closeCircle }/> }
    </IonChip>

    <IonChip outline={ !params.ownerID }
             onClick={ toggleOnlyMineFilter }
             color={ params.ownerID ? 'primary' : 'medium' }>
      Owned campaigns
      { params.ownerID && <IonIcon icon={ closeCircle } color='primary'/> }
    </IonChip>

    { hasFilters && <IonButton fill='clear' color='medium' onClick={ resetParams }>
        <IonIcon icon={ refreshOutline } slot='start'/>
        Reset
    </IonButton> }
  </Fragment>
}