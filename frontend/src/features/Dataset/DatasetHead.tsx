import React from 'react';
import { Calendar } from '@solar-icons/react';
import { IonNote } from '@ionic/react';
import { Head } from '@/components/ui';

import { datetimeToString } from '@/service/function';
import { useDataset } from '@/api';
import { useNavParams } from '@/features/UX';
import styles from './styles.module.scss';

export const DatasetHead: React.FC = () => {
  const { datasetID: id } = useNavParams()
  const { dataset } = useDataset({ id })
  return (
      <Head title={ dataset?.name }
            subtitle={ dataset?.path }
            canGoBack>
        { dataset?.description && <p>{ dataset.description }</p> }
        { dataset && dataset.spectrograms && <div className={ styles.info }>
            <Calendar/>
            <IonNote>Start:</IonNote>
            <p>{ datetimeToString(dataset.spectrograms.start) }</p>
            <IonNote>End:</IonNote>
            <p>{ datetimeToString(dataset.spectrograms.end) }</p>
        </div> }
      </Head>)
}