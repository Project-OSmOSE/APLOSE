import React from 'react';
import { IonIcon } from '@ionic/react';
import { addOutline } from 'ionicons/icons/index.js';
import { useCurrentUser } from '@/api';
import { ActionBar, Link } from '@/components/ui';

import { AnnotationCampaignResetFiltersButton } from './ResetButton';
import { AnnotationCampaignArchiveFilter } from './ArchiveFilter';
import { AnnotationCampaignOwnerFilter } from './OwnerFilter';
import { AnnotationCampaignPhaseTypeFilter } from './PhaseFilter';
import { AnnotationCampaignAnnotatorFilter } from './AnnotatorFilter';
import { Route } from '@/routes/_authenticated/annotation-campaign';
import { useNavigate } from '@tanstack/react-router';


export const AnnotationCampaignListFilterActionBar: React.FC = () => {
    const { search } = Route.useSearch();
    const navigate = useNavigate();

    const { user } = useCurrentUser();

    return <ActionBar search={ search ?? undefined }
                      searchPlaceholder="Search campaign name"
                      onSearchChange={ search => navigate({
                          to: Route.to,
                          search: (prev) => ({
                              ...prev,
                              search,
                          }),
                          replace: true,
                      }) }
                      actionButton={ user?.isAdmin && <Link color="primary"
                                                            fill="outline"
                                                            to="/annotation-campaign/new">
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
