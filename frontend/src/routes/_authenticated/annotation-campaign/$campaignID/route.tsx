import { createFileRoute, notFound, Outlet } from '@tanstack/react-router'
import { queryClient } from '@/api/queryClient';
import { AnnotationCampaign } from '@/features';

export const Route = createFileRoute(
    '/_authenticated/annotation-campaign/$campaignID',
)({
    loader: async ({ params: { campaignID } }) => {
        const { campaign, phases, analysis, confidences, labels } = await queryClient.ensureQueryData(AnnotationCampaign.API.byIdQuery({ id: campaignID }))
        if (!campaign) throw notFound()
        return { campaign, phases, analysis, confidences, labels }
    },
    component: Outlet,
})
