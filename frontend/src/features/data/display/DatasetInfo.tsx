import React, { Fragment } from "react";
import { IonNote } from "@ionic/react";
import { useParams } from "react-router-dom";

import { dateToString } from "@/service/function.ts";
import { FadedText, Link } from "@/components/ui";

import { DisplayDataAPI } from "./api";
import styles from "./styles.module.scss";

export const DatasetInfoCreation: React.FC = () => {
  const { datasetID } = useParams<{ datasetID: string }>()
  const { data } = DisplayDataAPI.endpoints.getDatasetByPk.useQuery({
    pk: datasetID ?? -1,
  }, { skip: !datasetID })
  if (!data?.datasetByPk) return <Fragment/>
  return <IonNote className={ styles.importNote } color='medium'>
    Dataset imported on { dateToString(new Date(data.datasetByPk.createdAt)) } by { data.datasetByPk.owner.displayName }
  </IonNote>
}

export const DatasetName: React.FC<{
  name: string
  pk?: number
  labeled?: true
  link?: true
}> = ({ name, pk, labeled, link }) => {
  if (link && pk) return <Fragment>
    { labeled && <FadedText>Dataset</FadedText> }
    <Link appPath={ `/dataset/${ pk }/` } color='primary'>{ name }</Link>
  </Fragment>

  return <div>
    { labeled && <FadedText>Dataset</FadedText> }
    <p>{ name }</p>
  </div>
}
