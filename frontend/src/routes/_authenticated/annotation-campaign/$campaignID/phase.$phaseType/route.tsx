import { createFileRoute, notFound, Outlet } from '@tanstack/react-router'
import { ensureValidQueryData } from '@/api/utils';
import { Phase } from '@/features/AnnotationPhase';

export const Route = createFileRoute(
    '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType',
)({
    params: {
        parse: rawParams => rawParams as { campaignID: string, phaseType: Phase.Type },
    },
    loader: async ({ params: { campaignID, phaseType }, parentMatchPromise }) => {
        const parentData = (await parentMatchPromise).loaderData!
        const phase = await ensureValidQueryData(Phase.getQuery({
            campaignID,
            phase: phaseType,
        }))
        if (!phase) throw notFound()
        return { phase, ...parentData }
    },
    component: Outlet,
})
