import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React, { Fragment, useCallback, useEffect, useMemo } from 'react';

import { Head } from '@/components/ui';

import { type AllCampaignFilters, useCurrentUser } from '@/api';

import { AnnotationCampaignListFilterActionBar, Cards } from '@/features/AnnotationCampaign';

const AnnotationCampaignList: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useCurrentUser();

    const init = useCallback(() => {
        if (!user) return;
        navigate({
            to: Route.to,
            search: (prev) => {
                const updatedFilters: AllCampaignFilters = {
                    filter_annotatorID: user.id,
                    filter_isArchived: false,
                    ...prev,
                }
                if (updatedFilters.filter_annotatorID !== user.id) {
                    updatedFilters.filter_annotatorID = user.id
                }
                if (updatedFilters.filter_ownerID && updatedFilters.filter_ownerID !== user.id) {
                    updatedFilters.filter_ownerID = user.id
                }
                return updatedFilters
            },
            replace: true,
        })
    }, [ user, navigate ])

    useEffect(() => {
        init()
    }, [ user ]);

    useEffect(() => {
        init()
    }, []);

    return useMemo(() => <Fragment>
        <Head title="Annotation campaigns"/>

        <div style={ {
            display: 'grid',
            maxHeight: '100%',
            gridTemplateRows: 'auto 1fr',
            overflow: 'hidden',
            gap: '1rem',
        } }>

            <AnnotationCampaignListFilterActionBar/>

            <Cards/>

        </div>
    </Fragment>, [])
}


export const Route = createFileRoute('/_authenticated/annotation-campaign')({
    validateSearch: (search: Record<string, unknown>) => search as AllCampaignFilters,
    component: AnnotationCampaignList,
})
