import React, { Fragment } from 'react';
import { IonSpinner } from '@ionic/react';
import { WarningText } from '@/components/ui';

import { DatasetHead, DatasetInfoCreation } from '@/features/Dataset';
import { ImportAnalysisModalButton, SpectrogramAnalysisTable } from '@/features/SpectrogramAnalysis';
import { ChannelConfigurationTable } from '@/features/ChannelConfiguration';
import { useDataset } from '@/api';
import { type DataNavParams } from '@/features/UX';
import { useParams } from 'react-router-dom';


export const DatasetDetail: React.FC = () => {
  const { datasetID: id } = useParams<DataNavParams>();

  const { dataset, isLoading, error } = useDataset({ id })

  if (isLoading) return <Fragment><DatasetHead/><IonSpinner/></Fragment>

  if (error) return <Fragment><DatasetHead/><WarningText error={ error }/></Fragment>

  if (!dataset) return <Fragment><DatasetHead/><WarningText message="Dataset not found"/></Fragment>

  return <Fragment>
    <DatasetHead/>

    <div style={ { overflowX: 'hidden', display: 'grid', gap: '4rem' } }>

      <ChannelConfigurationTable datasetID={ dataset.id }/>

      <div style={ { overflowX: 'hidden', display: 'grid', gap: '1rem' } }>
        <SpectrogramAnalysisTable datasetID={ dataset.id }/>

        <ImportAnalysisModalButton/>
      </div>
    </div>

    <DatasetInfoCreation/>
  </Fragment>
}

export default DatasetDetail
