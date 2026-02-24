import React, { Fragment } from 'react';
import { IonButton, IonIcon, IonSpinner } from '@ionic/react';
import { useModal, WarningText } from '@/components/ui';

import { DatasetHead, DatasetInfoCreation } from '@/features/Dataset';
import { SpectrogramAnalysisTable } from '@/features/SpectrogramAnalysis';
import { ChannelConfigurationTable } from '@/features/ChannelConfiguration';
import { useDataset } from '@/api';
import { type DataNavParams } from '@/features/UX';
import { useParams } from 'react-router-dom';
import { downloadOutline } from 'ionicons/icons';
import { ImportDatasetAnalysisModal } from '@/features/storage';


export const DatasetDetail: React.FC = () => {
  const { datasetID: id } = useParams<DataNavParams>();

  const { dataset, isLoading, error } = useDataset({ id })

  const importAnalysisModal = useModal(ImportDatasetAnalysisModal);

  if (isLoading) return <Fragment><DatasetHead/><IonSpinner/></Fragment>
  if (error) return <Fragment><DatasetHead/><WarningText error={ error }/></Fragment>
  if (!dataset) return <Fragment><DatasetHead/><WarningText message="Dataset not found"/></Fragment>
  return <Fragment>
    <DatasetHead/>

    <div style={ { overflowX: 'hidden', display: 'grid', gap: '4rem' } }>

      <ChannelConfigurationTable datasetID={ dataset.id }/>

      <div style={ { overflowX: 'hidden', display: 'grid', gap: '1rem' } }>
        <SpectrogramAnalysisTable datasetID={ dataset.id }/>

        <IonButton color="primary" fill="clear"
                   style={ { zIndex: 2, justifySelf: 'center' } }
                   onClick={ importAnalysisModal.toggle }>
          <IonIcon icon={ downloadOutline } slot="start"/>
          Import analysis
        </IonButton>
      </div>
    </div>

    <DatasetInfoCreation/>

    { importAnalysisModal.element }
  </Fragment>
}

export default DatasetDetail
