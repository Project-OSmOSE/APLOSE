import { Fragment } from 'react';
import { createFileRoute } from '@tanstack/react-router'
import { IonSpinner } from '@ionic/react';
import { Dataset } from '@/features';
import { queryClient } from '@/api/queryClient';
import { CampaignForm } from '@/features/AnnotationCampaign';
import { Head, WarningText } from '@/components/ui';
import { Center } from '@/components/layout/Display';

export const Route = createFileRoute('/_authenticated/_admin/annotation-campaign/new')({
    validateSearch: (search: Record<string, unknown>) => ({
        dataset_id: search['dataset_id'] as string,
    }),
    loader: () => queryClient.ensureQueryData(Dataset.API.listWithAnalysisQuery),
    component: () => <Fragment>
        <Head title="Create Annotation Campaign"/>
        <CampaignForm.Create/>
    </Fragment>,
    pendingComponent: () => <Fragment>
        <Head title="Create Annotation Campaign"/>
        <Center><IonSpinner/></Center>
    </Fragment>,
    errorComponent: (error) => <Fragment>
        <Head title="Create Annotation Campaign"/>
        <WarningText error={ error }/>
    </Fragment>,
})