import React, { Fragment, useMemo } from 'react';
import { createFileRoute, notFound } from '@tanstack/react-router'
import { IonButton, IonIcon } from '@ionic/react';
import { addOutline, downloadOutline } from 'ionicons/icons';

import { Link, useModal } from '@/components/ui';

import { ImportDatasetAnalysisModal } from '@/features/Storage';
import { DatasetHead, DatasetInfoCreation } from '@/features/Dataset';
import { ChannelConfigurationTable } from '@/features/ChannelConfiguration';
import { SpectrogramAnalysisTable } from '@/features/SpectrogramAnalysis';
import { Cards } from '@/features/AnnotationCampaign';
import { queryClient } from '@/api/queryClient';
import { AnnotationCampaign, ChannelConfiguration, Dataset } from '@/features';

const DatasetDetail: React.FC = () => {
    const { dataset, campaigns } = Route.useLoaderData({ select: ({ dataset, campaigns }) => ({ dataset, campaigns }) })

    const importAnalysisModal = useModal(ImportDatasetAnalysisModal);

    return useMemo(() => {
        return <Fragment>
            <DatasetHead/>

            <div style={ { overflowX: 'hidden', display: 'grid', gap: '4rem', alignItems: 'start', height: '100%' } }>

                <div>
                    <h5>Channel configurations</h5>
                    <ChannelConfigurationTable/>
                </div>

                <div style={ { overflowX: 'hidden', display: 'grid', gap: '1rem' } }>
                    <h5>Analysis</h5>

                    <SpectrogramAnalysisTable datasetID={ dataset.id }/>

                    <IonButton color="primary" fill="clear"
                               style={ { zIndex: 2, justifySelf: 'center' } }
                               onClick={ importAnalysisModal.toggle }>
                        <IonIcon icon={ downloadOutline } slot="start"/>
                        Import analysis
                    </IonButton>
                </div>

                <div style={ { overflowX: 'hidden', display: 'grid', gap: '1rem' } }>
                    <h5>Annotation campaigns</h5>
                    <Cards campaigns={ campaigns }/>

                    <Link color="primary" fill="clear"
                          style={ { zIndex: 2, justifySelf: 'center' } }
                          to="/annotation-campaign/new"
                          search={ { dataset_id: dataset.id } }>
                        <IonIcon icon={ addOutline } slot="start"/>
                        Create campaign
                    </Link>
                </div>
            </div>

            <DatasetInfoCreation/>

            { importAnalysisModal.element }
        </Fragment>
    }, [ dataset, importAnalysisModal, campaigns ])
}

export const Route = createFileRoute('/_authenticated/_admin/dataset/$datasetID')({
    loader: async ({ params: { datasetID } }) => {
        const [
            dataset,
            allChannelConfigurations,
            campaigns,
        ] = await Promise.all([
            queryClient.ensureQueryData(Dataset.API.byIdQuery({ id: datasetID })),
            queryClient.ensureQueryData(ChannelConfiguration.API.forDatasetQuery({ datasetID })),
            queryClient.ensureQueryData(AnnotationCampaign.API.allQuery({ filter_datasetID: datasetID })),
        ])
        if (!dataset) throw notFound()
        return {
            dataset,
            allChannelConfigurations,
            campaigns,
        }
    },
    component: DatasetDetail,
})
