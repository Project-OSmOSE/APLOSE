import { createFileRoute, notFound, Outlet } from '@tanstack/react-router'
import { queryClient } from '@/api/queryClient';
import { AnnotationPhase } from '@/features';
import { AnnotationPhaseType } from '@/api';

export const Route = createFileRoute(
    '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType',
)({
    params: {
        parse: rawParams => rawParams as { campaignID: string, phaseType: AnnotationPhaseType },
    },
    loader: async ({ params: { campaignID, phaseType } }) => {
        const phase = await queryClient.ensureQueryData(AnnotationPhase.API.getQuery({
            campaignID,
            phase: phaseType,
        }))
        if (!phase) throw notFound()
        return { phase }
    },
    component: Outlet,
})
