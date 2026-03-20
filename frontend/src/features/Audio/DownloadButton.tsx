import React, { Fragment } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { downloadOutline } from 'ionicons/icons/index.js';
import { useAudio } from './context';

export const AudioDownloadButton: React.FC = () => {
  const audio = useAudio();

  if (!audio.source) return <Fragment/>
  return <IonButton color="medium" size="small" fill="outline"
                    onClick={ audio.download }>
    <IonIcon icon={ downloadOutline } slot="start"/>
    Download audio
  </IonButton>
}