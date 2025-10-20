import React, { Fragment } from 'react';
import { IonButton } from '@ionic/react';
import { useImportAnnotationsContext } from './context';
import { WarningText } from '@/components/ui';

export const UploadError: React.FC = () => {
  const {
    canForceDatetime,
    canForceMaxFrequency,
    upload,
    reset,
    ...state
  } = useImportAnnotationsContext()

  if (state.uploadState !== 'error') return <Fragment/>
  if (canForceDatetime || canForceMaxFrequency) return <WarningText error={ state.error }>
    <IonButton color="warning" fill="clear" onClick={ () => upload({
      force_datetime: canForceDatetime,
      force_max_frequency: canForceMaxFrequency,
    }) }>
      Import anyway
    </IonButton>
  </WarningText>
  return <WarningText error={ state.error }>
    <IonButton color="primary" fill="clear" onClick={ reset }>Reset</IonButton>
  </WarningText>
}
