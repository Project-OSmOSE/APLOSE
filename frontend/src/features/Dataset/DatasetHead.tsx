import React from 'react';
import { Calendar } from '@solar-icons/react';
import { IonNote } from '@ionic/react';
import { Head } from '@/components/ui';

import { datetimeToString } from '@/service/function';
import { useDataset } from '@/api';
import { type DataNavParams } from '@/features/UX';
import styles from './styles.module.scss';
import { useParams } from 'react-router-dom';

export const DatasetHead: React.FC = () => {
  const { datasetID: id } = useParams<DataNavParams>();
  const { dataset } = useDataset({ id })
  return <Head title={ dataset?.name }
               subtitle={ dataset?.path }
               canGoBack>
    { dataset?.description && <p>{ dataset.description }</p> }
    { dataset && <div className={ styles.info }>
        <Calendar/>
        <IonNote>Start:</IonNote>
        <p>{ datetimeToString(dataset.start) }</p>
        <IonNote>End:</IonNote>
        <p>{ datetimeToString(dataset.end) }</p>
    </div> }
  </Head>
}