import React, { Fragment, useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router'
import { IonButton, IonIcon, IonSpinner } from '@ionic/react';
import { addOutline, downloadOutline } from 'ionicons/icons';

import { GraphQLErrorText, Link, useModal, WarningText } from '@/components/ui';

import { useDataset } from '@/api';

import { ImportDatasetAnalysisModal } from '@/features/Storage';
import { DatasetHead, DatasetInfoCreation } from '@/features/Dataset';
import { ChannelConfigurationTable } from '@/features/ChannelConfiguration';
import { SpectrogramAnalysisTable } from '@/features/SpectrogramAnalysis';
import { Cards } from '@/features/AnnotationCampaign';

const DatasetDetail: React.FC = () => {
    const { datasetID: id } = Route.useParams();

    const { dataset, isLoading, error } = useDataset({ id })

    const importAnalysisModal = useModal(ImportDatasetAnalysisModal);

    return useMemo(() => {
        if (isLoading) return <Fragment><DatasetHead/><IonSpinner/></Fragment>
        if (error) return <Fragment><DatasetHead/><GraphQLErrorText error={ error }/></Fragment>
        if (!dataset) return <Fragment><DatasetHead/><WarningText message="Dataset not found"/></Fragment>
        return <Fragment>
            <DatasetHead/>

            <div style={ { overflowX: 'hidden', display: 'grid', gap: '4rem', alignItems: 'start', height: '100%' } }>

                <div>
                    <h5>Channel configurations</h5>
                    <ChannelConfigurationTable datasetID={ dataset.id }/>
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
                    <Cards filters={ { filter_datasetID: id } }/>

                    <Link color="primary" fill="clear"
                          style={ { zIndex: 2, justifySelf: 'center' } }
                          appPath={ `/annotation-campaign/new?dataset_id=${ dataset.id }` }>
                        <IonIcon icon={ addOutline } slot="start"/>
                        Create campaign
                    </Link>
                </div>
            </div>

            <DatasetInfoCreation/>

            { importAnalysisModal.element }
        </Fragment>
    }, [id, isLoading, error, dataset, importAnalysisModal])
}

export const Route = createFileRoute('/_admin/dataset/$datasetID')({
    component: DatasetDetail,
})
