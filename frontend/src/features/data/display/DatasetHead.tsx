import React from "react";
import { useParams } from "react-router-dom";

import { Head } from "@/components/ui/Page.tsx";

import { DisplayDataAPI } from "./api";
import styles from "@/features/data/display/styles.module.scss";
import { Calendar } from "@solar-icons/react";
import { IonNote } from "@ionic/react";
import { datetimeToString } from "@/service/function.ts";

export const DatasetHead: React.FC = () => {
  const { datasetID } = useParams<{ datasetID: string }>()
  const { data } = DisplayDataAPI.endpoints.getDatasetByPk.useQuery({
    pk: datasetID ?? -1,
  }, { skip: !datasetID })
  return (
    <Head title={ data?.datasetByPk?.name }
          subtitle={ data?.datasetByPk?.path }
          canGoBack>
      { data?.datasetByPk?.description && <p>{ data.datasetByPk.description }</p> }
      { data?.datasetByPk && <div className={ styles.info }>
          <Calendar/>
          <IonNote>Start:</IonNote>
          <p>{ datetimeToString(data.datasetByPk.start) }</p>
          <IonNote>End:</IonNote>
          <p>{ datetimeToString(data.datasetByPk.end) }</p>
      </div> }
    </Head>)
}