import React, { Fragment, useCallback, useState } from 'react';
import { IonButton, IonIcon, IonSpinner } from '@ionic/react';
import { downloadOutline } from 'ionicons/icons/index.js';
import { useAnnotationTask, useCurrentUser } from '@/api';
import { useAnnotatorCanvas } from '@/features/Annotator/Canvas';
import { useAnnotatorZoom } from '@/features/Annotator/Zoom';

export const SpectrogramDownloadButton: React.FC = () => {
  const { spectrogram } = useAnnotationTask()
  const { user } = useCurrentUser();
  const { download } = useAnnotatorCanvas();
  const { zoom } = useAnnotatorZoom()
  const [ isLoading, setIsLoading ] = useState<boolean>(false);

  const downloadSpectrogram = useCallback(async () => {
    if (!spectrogram) return;
    setIsLoading(true);
    try {
      await download(`${ spectrogram.filename }-x${ zoom }.png`)
    } finally {
      setIsLoading(false);
    }
  }, [ download, spectrogram, zoom ])

  if (!spectrogram || !user?.isAdmin) return <Fragment/>
  return <IonButton color="medium" size="small" fill="outline"
                    onClick={ downloadSpectrogram }>
    <IonIcon icon={ downloadOutline } slot="start"/>
    Download spectrogram (zoom x{ zoom })
    { isLoading && <IonSpinner/> }
  </IonButton>
}
