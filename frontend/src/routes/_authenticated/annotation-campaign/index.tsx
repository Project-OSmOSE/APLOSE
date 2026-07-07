import { createFileRoute, useLoaderData, useNavigate } from '@tanstack/react-router';
import React, { useCallback, useEffect } from 'react';

import { Head, WarningText } from '@/components/ui';

import {
    type AllCampaignsQueryVariables,
    AnnotationCampaignListFilterActionBar,
    CampaignAPI,
    Cards,
} from '@/features/AnnotationCampaign';
import { useQuery } from '@tanstack/react-query';
import { Content } from '@/components/layout/Content';
import { Center } from '@/components/layout/Display';
import { Spinner } from '@/components/base/Spinner';
import { Page } from '@/components/layout';
import { ensureValidQueryData } from '@/api/utils';

const AnnotationCampaignList: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useLoaderData({ from: '/_authenticated' })
    const params = Route.useParams()
    const search = Route.useSearch()
    const { data: campaigns, isFetching } = useQuery(CampaignAPI.allQuery({ ...search, ...params }))

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

    return <Page.Authenticated>
        <Content style={ { gridTemplateRows: 'auto auto 1fr' } }>
            <Head title="Annotation campaigns"/>

            <AnnotationCampaignListFilterActionBar/>

            <Cards campaigns={ campaigns } isFetching={ isFetching }/>
        </Content>
    </Page.Authenticated>
}


export const Route = createFileRoute('/_authenticated/annotation-campaign/')({
    validateSearch: (search: Record<string, unknown>) => search as AllCampaignsQueryVariables,
    loaderDeps: ({ search }) => search as AllCampaignsQueryVariables,
    loader: ({ params, deps }) => ensureValidQueryData(CampaignAPI.allQuery({
        ...deps,
        ...params,
    })),
    component: AnnotationCampaignList,
    pendingComponent: () => <Content oneContent>
        <Head title="Annotation campaigns"/>
        <Center><Spinner/></Center>
    </Content>,
    errorComponent: ({ error }) => <Content oneContent>
        <Head title="Annotation campaigns"/>
        <Center><WarningText error={ error }/></Center>
    </Content>,
})
