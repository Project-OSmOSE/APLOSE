import { createFileRoute, useLoaderData, useNavigate } from '@tanstack/react-router';
import React, { Fragment, useCallback, useEffect, useMemo } from 'react';

import { Head } from '@/components/ui';

import {
    type AllCampaignsQueryVariables,
    AnnotationCampaignListFilterActionBar,
    Cards,
} from '@/features/AnnotationCampaign';
import { AnnotationCampaign } from '@/features';
import { useQuery } from '@tanstack/react-query';
import { ensureValidQueryData } from '@/api/utils';

const AnnotationCampaignList: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useLoaderData({ from: '/_authenticated' })
    const params = Route.useParams()
    const search = Route.useSearch()
    const { data: campaigns } = useQuery(AnnotationCampaign.API.allQuery({ ...search, ...params }))

    const init = useCallback(() => {
        navigate({
            to: Route.to,
            search: (prev) => {
                const updatedFilters: AllCampaignsQueryVariables = {
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

            <Cards campaigns={ campaigns }/>

        </div>
    </Fragment>, [ campaigns ])
}


export const Route = createFileRoute('/_authenticated/annotation-campaign/')({
    validateSearch: (search: Record<string, unknown>) => search as AllCampaignsQueryVariables,
    loaderDeps: ({ search }) => search as AllCampaignsQueryVariables,
    loader: ({ params, deps }) => ensureValidQueryData(AnnotationCampaign.API.allQuery({
        ...deps,
        ...params,
    })),
    component: AnnotationCampaignList,
})
