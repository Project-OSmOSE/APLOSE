import React, { Fragment } from 'react';
import { IonNote } from '@ionic/react';
import { useDataset } from '@/api';
import { type DataNavParams } from '@/features/UX';

import { dateToString } from '@/service/function';
import { FadedText, Link } from '@/components/ui';
import styles from './styles.module.scss';
import { useParams } from 'react-router-dom';

export const DatasetInfoCreation: React.FC = () => {
  const { datasetID: id } = useParams<DataNavParams>();
  const { dataset } = useDataset({ id })
  if (!dataset) return <Fragment/>
  return <IonNote className={ styles.importNote } color="medium">
    Dataset imported on { dateToString(new Date(dataset.createdAt)) } by { dataset.owner.displayName }
  </IonNote>
}

export const DatasetName: React.FC<{
  name: string
  id?: string
  labeled?: true
  link?: true
}> = ({ name, id, labeled, link }) => {
  if (link && id) return <Fragment>
    { labeled && <FadedText>Dataset</FadedText> }
    <Link appPath={ `/dataset/${ id }/` } color="primary">{ name }</Link>
  </Fragment>

  return <div>
    { labeled && <FadedText>Dataset</FadedText> }
    <p>{ name }</p>
  </div>
}
