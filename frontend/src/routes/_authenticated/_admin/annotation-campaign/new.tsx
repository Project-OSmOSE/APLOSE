import { createFileRoute } from '@tanstack/react-router'
import { DatasetAPI } from '@/features/Dataset';
import { CampaignForm } from '@/features/AnnotationCampaign';
import { Head, WarningText } from '@/components/ui';
import { Center } from '@/components/layout/Display';
import { Content } from '@/components/layout/Content';
import { Spinner } from '@/components/base';
import { ensureValidQueryData } from '@/api/utils';

export const Route = createFileRoute('/_authenticated/_admin/annotation-campaign/new')({
    validateSearch: (search: Record<string, unknown>) => ({
        dataset_id: search['dataset_id'] as string,
    }),
    loader: () => ensureValidQueryData(DatasetAPI.listWithAnalysisQuery),
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