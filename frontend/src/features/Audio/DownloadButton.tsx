import React, { Fragment } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { downloadOutline } from 'ionicons/icons/index.js';
import { useAudio } from './context';
import { useLoaderData } from '@tanstack/react-router';

export const AudioDownloadButton: React.FC = () => {
  const audio = useAudio()
  const { user } = useLoaderData({ from: '/_authenticated' })

  if (!audio.source || !user.isAdmin) return <Fragment/>
  return <IonButton color="medium" size="small" fill="outline"
                    onClick={ audio.download }>
    <IonIcon icon={ downloadOutline } slot="start"/>
    Download audio
  </IonButton>
}