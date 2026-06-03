import React from 'react';
import { IonIcon } from '@ionic/react';
import { addOutline } from 'ionicons/icons/index.js';
import { ActionBar, Link } from '@/components/ui';

import { AnnotationCampaignResetFiltersButton } from './ResetButton';
import { AnnotationCampaignArchiveFilter } from './ArchiveFilter';
import { AnnotationCampaignOwnerFilter } from './OwnerFilter';
import { AnnotationCampaignPhaseTypeFilter } from './PhaseFilter';
import { AnnotationCampaignAnnotatorFilter } from './AnnotatorFilter';
import { useLoaderData, useNavigate, useSearch } from '@tanstack/react-router';


export const AnnotationCampaignListFilterActionBar: React.FC = () => {
    const search = useSearch({
        from: '/_authenticated/annotation-campaign/',
        select: ({ search }) => search,
    });
    const navigate = useNavigate();

    const { user } = useLoaderData({ from: '/_authenticated' })

    return <ActionBar search={ search ?? undefined }
                      searchPlaceholder="Search campaign name"
                      onSearchChange={ search => navigate({
                          to: '/annotation-campaign',
                          search: (prev) => ({
                              ...prev,
                              search,
                          }),
                          replace: true,
                      }) }
                      actionButton={ user.isAdmin && <Link color="primary"
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
