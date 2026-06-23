import { createFileRoute } from '@tanstack/react-router'
import { Dataset } from '@/features';
import { queryClient } from '@/api/queryClient';
import { CampaignForm } from '@/features/AnnotationCampaign';
import { Head, WarningText } from '@/components/ui';
import { Center } from '@/components/layout/Display';
import { Content } from '@/components/layout/Content';
import { Spinner } from '@/components/base';

export const Route = createFileRoute('/_authenticated/_admin/annotation-campaign/new')({
    validateSearch: (search: Record<string, unknown>) => ({
        dataset_id: search['dataset_id'] as string,
    }),
    loader: () => queryClient.ensureQueryData(Dataset.API.listWithAnalysisQuery),
    component: () => <Content oneContent>
        <Head title="Create Annotation Campaign"/>
        <CampaignForm.Create/>
    </Content>,
    pendingComponent: () => <Content oneContent>
        <Head title="Create Annotation Campaign"/>
        <Center><Spinner/></Center>
    </Content>,
    errorComponent: (error) => <Content oneContent>
        <Head title="Create Annotation Campaign"/>
        <WarningText error={ error }/>
    </Content>,
})