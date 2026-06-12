import { createFileRoute, notFound, Outlet } from '@tanstack/react-router'
import { AnnotationCampaign } from '@/features';
import { ensureValidQueryData } from '@/api/utils';

export const Route = createFileRoute(
    '/_authenticated/annotation-campaign/$campaignID',
)({
    loader: async ({ params: { campaignID }, parentMatchPromise }) => {
        const parentData = (await parentMatchPromise).loaderData!
        const { campaign, phases, analysis, confidences, labels } = await ensureValidQueryData(AnnotationCampaign.API.byIdQuery({ id: campaignID }))
        if (!campaign) throw notFound()
        return { campaign, phases, analysis, confidences, labels, ...parentData }
    },
    component: Outlet,
})
