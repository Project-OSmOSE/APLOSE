import React, { Fragment } from 'react';
import { IonButton, IonIcon, IonSpinner } from '@ionic/react';
import { GraphQLErrorText, Link, useModal, WarningText } from '@/components/ui';

import { DatasetHead, DatasetInfoCreation } from '@/features/Dataset';
import { SpectrogramAnalysisTable } from '@/features/SpectrogramAnalysis';
import { ChannelConfigurationTable } from '@/features/ChannelConfiguration';
import { useDataset } from '@/api';
import { type DataNavParams } from '@/features/UX';
import { useParams } from 'react-router-dom';
import { downloadOutline } from 'ionicons/icons';
import { ImportDatasetAnalysisModal } from '@/features/Storage';
import { Cards } from '@/features/AnnotationCampaign';
import { addOutline } from 'ionicons/icons/index.js';


export const DatasetDetail: React.FC = () => {
    const { datasetID: id } = useParams<DataNavParams>();

    const { dataset, isLoading, error } = useDataset({ id })

    const importAnalysisModal = useModal(ImportDatasetAnalysisModal);

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
}

export default DatasetDetail
