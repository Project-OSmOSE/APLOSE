import React from 'react';
import { IonIcon } from '@ionic/react';
import { addOutline } from 'ionicons/icons/index.js';
import { useAllCampaignsFilters } from '@/api';
import { ActionBar, Link } from '@/components/ui';

import { AnnotationCampaignResetFiltersButton } from './ResetButton';
import { AnnotationCampaignArchiveFilter } from './ArchiveFilter';
import { AnnotationCampaignOwnerFilter } from './OwnerFilter';
import { AnnotationCampaignPhaseTypeFilter } from './PhaseFilter';
import { AnnotationCampaignAnnotatorFilter } from './AnnotatorFilter';


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
