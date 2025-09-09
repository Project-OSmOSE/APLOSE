import React, { Fragment } from 'react';
import { useParams } from "react-router-dom";
import { IonSpinner } from "@ionic/react";

import { getErrorMessage } from "@/service/function.ts";
import { WarningText } from "@/components/ui";

import { DatasetHead, DatasetInfoCreation, SpectrogramAnalysisTable } from "@/features/data/display";
import { DisplayDataAPI } from "@/features/data/display/api";
import { ImportAnalysisModalButton } from "@/features/data/import";
import { ChannelConfigurationTable } from "@/features/metadatax/acquisition/display";


export const DatasetDetail: React.FC = () => {
  const { datasetID } = useParams<{ datasetID: string }>()

  const { data, isLoading, error } = DisplayDataAPI.endpoints.getDatasetByPk.useQuery({
    pk: datasetID ?? -1,
  }, { skip: !datasetID })

  if (isLoading) return <Fragment>
    <DatasetHead/>
    <IonSpinner/>
  </Fragment>

  if (error) return <Fragment>
    <DatasetHead/>
    <WarningText>{ getErrorMessage(error) }</WarningText>
  </Fragment>

  if (!data?.datasetByPk) return <Fragment>
    <DatasetHead/>
    <WarningText>Dataset not found</WarningText>
  </Fragment>

  return <Fragment>
    <DatasetHead/>

    <div style={ { overflowX: 'hidden', display: 'grid', gap: '4rem' } }>

      <ChannelConfigurationTable datasetPK={ +datasetID! }/>

      <div style={ { overflowX: 'hidden', display: 'grid', gap: '1rem' } }>
        <SpectrogramAnalysisTable datasetPK={ +datasetID! }/>

        <ImportAnalysisModalButton/>
      </div>
    </div>

    <DatasetInfoCreation/>
  </Fragment>
}