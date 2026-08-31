import { createFileRoute } from '@tanstack/react-router';
import { AnnotationPhaseType } from '@/api/types.gql-generated';
import { ImportAnnotationsPage } from './(components)/-page';


export const Route = createFileRoute('/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/import-annotations')({
    params: {
        parse: rawParams => rawParams as { campaignID: string, phaseType: AnnotationPhaseType },
    },
    component: ImportAnnotationsPage,
})
