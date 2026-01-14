import React, { Fragment, useCallback, useMemo } from 'react';
import { IonButton, IonChip, IonIcon } from '@ionic/react';
import { addOutline, closeCircle, refreshOutline, swapHorizontal } from 'ionicons/icons/index.js';
import { AnnotationPhaseType, useAllCampaignsFilters, useCurrentUser } from '@/api';
import { ActionBar, Link } from '@/components/ui';


export const AnnotationCampaignListFilterActionBar: React.FC = () => {
  const { params, updateParams } = useAllCampaignsFilters()

  return <ActionBar search={ params.search ?? undefined }
                    searchPlaceholder="Search campaign name"
                    onSearchChange={ search => updateParams({ search }) }
                    actionButton={ <Link color="primary"
                                         fill="outline"
                                         appPath="/annotation-campaign/new">
                      <IonIcon icon={ addOutline } slot="start"/>
                      New annotation campaign
                    </Link> }>
    <AnnotationCampaignAnnotatorFilter/>
    <AnnotationCampaignArchiveFilter/>
    <AnnotationCampaignPhaseTypeFilter/>
    <AnnotationCampaignOwnerFilter/>
    <AnnotationCampaignResetFiltersButton/>
  </ActionBar>
}

const AnnotationCampaignArchiveFilter: React.FC = () => {
  const { params, updateParams } = useAllCampaignsFilters()

  const exists = useMemo(() => params.isArchived !== undefined && params.isArchived !== null, [ params.isArchived ])

  const toggle = useCallback(() => {
    switch (params.isArchived) {
      case false:
        updateParams({ isArchived: true })
        break;
      case true:
        updateParams({ isArchived: null })
        break;
      default: // undefined | null
        updateParams({ isArchived: false })
        break;
    }
  }, [ params.isArchived ])

  return <IonChip outline={ !exists }
                  onClick={ toggle }
                  color={ exists ? 'primary' : 'medium' }>
    Archived{ exists && `: ${ params.isArchived ? 'True' : 'False' }` }
    { params.isArchived === false && <IonIcon icon={ swapHorizontal }/> }
    { params.isArchived === true && <IonIcon icon={ closeCircle }/> }
  </IonChip>
}

const AnnotationCampaignAnnotatorFilter: React.FC = () => {
  const { params, updateParams } = useAllCampaignsFilters()
  const { user } = useCurrentUser();

  const toggle = useCallback(() => {
    if (params.annotatorID) {
      updateParams({ annotatorID: null })
    } else {
      updateParams({ annotatorID: user?.id })
    }
  }, [ params, user ])

  return <IonChip outline={ !params.annotatorID }
                  onClick={ toggle }
                  color={ params.annotatorID ? 'primary' : 'medium' }>
    My work
    { params.annotatorID && <IonIcon icon={ closeCircle } color="primary"/> }
  </IonChip>
}

const AnnotationCampaignPhaseTypeFilter: React.FC = () => {
  const { params, updateParams } = useAllCampaignsFilters()

  const toggle = useCallback(() => {
    if (!params.phase) updateParams({ phase: AnnotationPhaseType.Verification })
    else updateParams({ phase: null })
  }, [ params ])

  return <IonChip outline={ !params.phase }
                  onClick={ toggle }
                  color={ params.phase === AnnotationPhaseType.Verification ? 'primary' : 'medium' }>
    Has verification
    { params.phase === AnnotationPhaseType.Verification && <IonIcon icon={ closeCircle } color="primary"/> }
  </IonChip>
}

const AnnotationCampaignOwnerFilter: React.FC = () => {
  const { params, updateParams } = useAllCampaignsFilters()
  const { user } = useCurrentUser();

  const toggle = useCallback(() => {
    if (params.ownerID) {
      updateParams({ ownerID: null })
    } else {
      updateParams({ ownerID: user?.id })
    }
  }, [ params, user ])

  return <IonChip outline={ !params.ownerID }
                  onClick={ toggle }
                  color={ params.ownerID ? 'primary' : 'medium' }>
    Owned campaigns
    { params.ownerID && <IonIcon icon={ closeCircle } color="primary"/> }
  </IonChip>
}

const AnnotationCampaignResetFiltersButton: React.FC = () => {
  const { params, updateParams } = useAllCampaignsFilters()
  const { user } = useCurrentUser();

  const canReset = useMemo(() => {
    return !(!params.search && params.isArchived == false && !params.phase && !!params.annotatorID && !params.ownerID)
  }, [ params ]);
  const resetFilters = useCallback(() => {
    updateParams({
      search: null,
      isArchived: false,
      phase: null,
      annotatorID: user?.id,
      ownerID: null,
    })
  }, [ params, user ])

  if (!canReset) return <Fragment/>
  return <IonButton fill="clear" color="medium" onClick={ resetFilters }>
    <IonIcon icon={ refreshOutline } slot="start"/>
    Reset
  </IonButton>
}