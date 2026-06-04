import React, { Fragment, useMemo } from 'react';
import { createFileRoute, notFound } from '@tanstack/react-router'

import { useModal } from '@/components/ui';

import { ImportDatasetAnalysisModal } from '@/features/Storage';
import { DatasetHead, DatasetInfoCreation } from '@/features/Dataset';
import { ChannelConfigurationTable } from '@/features/ChannelConfiguration';
import { SpectrogramAnalysisTable } from '@/features/SpectrogramAnalysis';
import { Cards } from '@/features/AnnotationCampaign';
import { queryClient } from '@/api/queryClient';
import { Dataset } from '@/features';
import { Download, WidgetAdd } from '@solar-icons/react';
import { Button, Link } from '@/components/base/Button';

const DatasetDetail: React.FC = () => {
    const { dataset, campaigns, analysis } = Route.useLoaderData()

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

                    <SpectrogramAnalysisTable analysis={ analysis }/>

                    <Button color="primary"
                            style={ { zIndex: 2, justifySelf: 'center' } }
                            onClick={ importAnalysisModal.toggle }>
                        <Download weight="Linear" size={ 20 }/>
                        Import analysis
                    </Button>
                </div>

                <div style={ { overflowX: 'hidden', display: 'grid', gap: '1rem' } }>
                    <h5>Annotation campaigns</h5>
                    <Cards campaigns={ campaigns }/>

                    <Link color="primary" to="/annotation-campaign/new"
                          style={ { zIndex: 2, justifySelf: 'center' } }
                          search={ { dataset_id: dataset.id } }>
                        <WidgetAdd weight="Linear" size={ 20 }/>
                        New annotation campaign
                    </Link>
                </div>
            </div>

            <DatasetInfoCreation/>

            { importAnalysisModal.element }
        </Fragment>
    }, [ dataset, importAnalysisModal, campaigns, analysis ])
}

export const Route = createFileRoute('/_authenticated/_admin/dataset/$datasetID')({
    loader: async ({ params: { datasetID } }) => {
        const { dataset, ...data } = await queryClient.ensureQueryData(Dataset.API.byIdQuery({ id: datasetID }))
        if (!dataset) throw notFound()
        return { dataset, ...data }
    },
    component: DatasetDetail,
})
