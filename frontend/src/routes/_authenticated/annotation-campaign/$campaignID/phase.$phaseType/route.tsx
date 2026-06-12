import { createFileRoute, notFound, Outlet } from '@tanstack/react-router'
import { AnnotationPhase } from '@/features';
import { AnnotationPhaseType } from '@/api';
import { ensureValidQueryData } from '@/api/utils';

export const Route = createFileRoute(
    '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType',
)({
    params: {
        parse: rawParams => rawParams as { campaignID: string, phaseType: AnnotationPhaseType },
    },
    loader: async ({ params: { campaignID, phaseType }, parentMatchPromise }) => {
        const parentData = (await parentMatchPromise).loaderData!
        const phase = await ensureValidQueryData(AnnotationPhase.API.getQuery({
            campaignID,
            phase: phaseType,
        }))
        if (!phase) throw notFound()
        return { phase, ...parentData }
    },
    component: Outlet,
})
