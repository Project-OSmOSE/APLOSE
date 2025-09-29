import React, { Fragment, useCallback, useMemo } from "react";
import { IonButton, IonChip, IonIcon } from "@ionic/react";
import { addOutline, closeCircle, refreshOutline, swapHorizontal } from "ionicons/icons";
import { AnnotationPhaseType } from "@/features/_utils_/gql/types.generated.ts";
import { useCampaignFilters } from "../hooks";
import { ActionBar } from "@/components/layout";
import { Link } from "@/components/ui";
import { useCurrentUser } from "@/features/auth/api";


export const AnnotationCampaignListFilterActionBar: React.FC = () => {
  const { params, updateParams } = useCampaignFilters()

  return <ActionBar search={ params.search ?? undefined }
                    searchPlaceholder="Search campaign name"
                    onSearchChange={ search => updateParams({ search }) }
                    actionButton={ <Link color='primary'
                                         fill='outline'
                                         appPath='/annotation-campaign/new'>
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
  const { params, updateParams } = useCampaignFilters()

  const toggle = useCallback(() => {
    switch (params.isArchived) {
      case undefined:
        updateParams({ isArchived: false })
        break;
      case false:
        updateParams({ isArchived: true })
        break;
      case true:
        updateParams({ isArchived: undefined })
        break;
    }
  }, [ params ])

  return <IonChip outline={ params.isArchived === undefined }
                  onClick={ toggle }
                  color={ params.isArchived !== undefined ? 'primary' : 'medium' }>
    Archived{ params.isArchived !== undefined && `: ${ params.isArchived ? 'True' : 'False' }` }
    { params.isArchived === false && <IonIcon icon={ swapHorizontal }/> }
    { params.isArchived === true && <IonIcon icon={ closeCircle }/> }
  </IonChip>
}

const AnnotationCampaignAnnotatorFilter: React.FC = () => {
  const { params, updateParams } = useCampaignFilters()
  const { user } = useCurrentUser();

  const toggle = useCallback(() => {
    if (params.annotatorPk) {
      updateParams({ annotatorPk: undefined })
    } else {
      updateParams({ annotatorPk: user?.pk })
    }
  }, [ params, user ])

  return <IonChip outline={ !params.annotatorPk }
                  onClick={ toggle }
                  color={ params.annotatorPk ? 'primary' : 'medium' }>
    My work
    { params.annotatorPk && <IonIcon icon={ closeCircle } color='primary'/> }
  </IonChip>
}

const AnnotationCampaignPhaseTypeFilter: React.FC = () => {
  const { params, updateParams } = useCampaignFilters()

  const toggle = useCallback(() => {
    if (!params.phase) updateParams({ phase: AnnotationPhaseType.Verification })
    else updateParams({ phase: undefined })
  }, [ params ])

  return <IonChip outline={ !params.phase }
                  onClick={ toggle }
                  color={ params.phase === AnnotationPhaseType.Verification ? 'primary' : 'medium' }>
    Has verification
    { params.phase === AnnotationPhaseType.Verification && <IonIcon icon={ closeCircle } color='primary'/> }
  </IonChip>
}

const AnnotationCampaignOwnerFilter: React.FC = () => {
  const { params, updateParams } = useCampaignFilters()
  const { user } = useCurrentUser();

  const toggle = useCallback(() => {
    if (params.ownerPk) {
      updateParams({ ownerPk: undefined })
    } else {
      updateParams({ ownerPk: user?.pk })
    }
  }, [ params, user ])

  return <IonChip outline={ !params.ownerPk }
                  onClick={ toggle }
                  color={ params.ownerPk ? 'primary' : 'medium' }>
    Owned campaigns
    { params.ownerPk && <IonIcon icon={ closeCircle } color='primary'/> }
  </IonChip>
}

const AnnotationCampaignResetFiltersButton: React.FC = () => {
  const { params, updateParams } = useCampaignFilters()
  const { user } = useCurrentUser();

  const canReset = useMemo(() => {
    return !(!params.search && params.isArchived == false && !params.phase && !!params.annotatorPk && !params.ownerPk)
  }, [ params ]);
  const resetFilters = useCallback(() => {
    updateParams({
      search: undefined,
      isArchived: false,
      phase: undefined,
      annotatorPk: user?.pk,
      ownerPk: undefined,
    })
  }, [ params, user ])

  if (!canReset) return <Fragment/>
  return <IonButton fill='clear' color='medium' onClick={ resetFilters }>
    <IonIcon icon={ refreshOutline } slot='start'/>
    Reset
  </IonButton>
}