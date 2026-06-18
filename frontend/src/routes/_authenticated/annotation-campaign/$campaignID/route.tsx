import { createFileRoute, type ErrorComponentProps, notFound, Outlet } from '@tanstack/react-router'
import { queryClient } from '@/api/queryClient';
import { AnnotationCampaign } from '@/features';
import { Content } from '@/components/layout/Content';
import { Head, WarningText } from '@/components/ui';
import { Center } from '@/components/layout/Display';
import { Spinner } from '@/components/base/Spinner';
import React from 'react';

const ErrorComponent: React.FC<ErrorComponentProps> = ({ error }) => {
    const { campaignID } = Route.useParams()
    return <Content oneContent>
        <Head title={ `Error on campaign ${ campaignID }` }/>
        <Center><WarningText error={ error }/></Center>
    </Content>
}

export const Route = createFileRoute(
    '/_authenticated/annotation-campaign/$campaignID',
)({
    loader: async ({ params: { campaignID } }) => {
        const { campaign, phases, analysis, confidences, labels } = await queryClient.ensureQueryData(AnnotationCampaign.API.byIdQuery({ id: campaignID }))
        if (!campaign) throw notFound()
        return { campaign, phases, analysis, confidences, labels }
    },
    component: Outlet,
    errorComponent: (props) => <ErrorComponent { ...props }/>,
    pendingComponent: () => <Content oneContent>
        <Head/>
        <Center><Spinner/></Center>
    </Content>,
})
