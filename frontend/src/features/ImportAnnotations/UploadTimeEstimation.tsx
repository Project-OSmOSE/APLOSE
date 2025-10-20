import React, { Fragment } from 'react';
import { IonNote } from '@ionic/react';
import { useImportAnnotationsContext } from './context';
import { formatTime } from '@/service/function';

export const UploadTimeEstimation: React.FC = () => {
  const {
    remainingUploadDuration,
    uploadState,
    uploadDuration,
    uploadedCount,
    annotations,
  } = useImportAnnotationsContext()

  if (uploadState !== 'uploading') return <Fragment/>
  if (!remainingUploadDuration) return <Fragment/>
  if (uploadDuration === 0) return <Fragment/>
  if (uploadedCount >= annotations.length) return <Fragment/>
  return <IonNote>
    Estimated remaining time: { formatTime(remainingUploadDuration / 1000) } minutes
  </IonNote>
}
