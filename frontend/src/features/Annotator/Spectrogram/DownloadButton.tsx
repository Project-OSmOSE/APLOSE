import React, { Fragment, useCallback, useState } from 'react';
import { IonButton, IonIcon, IonSpinner } from '@ionic/react';
import { downloadOutline } from 'ionicons/icons/index.js';
import { useAnnotationTask, useCurrentUser } from '@/api';
import { useDownloadCanvas } from '@/features/Annotator/Canvas';
import { selectDisplayZoom } from '@/features/Annotator/Zoom';
import { useAppSelector } from '@/features/App';

export const SpectrogramDownloadButton: React.FC = () => {
    const displayZoom = useAppSelector(selectDisplayZoom)
    const { spectrogram } = useAnnotationTask()
    const { user } = useCurrentUser();
    const download = useDownloadCanvas();
    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    const downloadSpectrogram = useCallback(async () => {
        if (!spectrogram) return;
        setIsLoading(true);
        try {
            await download(`${ spectrogram.filename }-x${ displayZoom }.png`)
        } finally {
            setIsLoading(false);
        }
    }, [ download, spectrogram, displayZoom ])

    if (!spectrogram || !user?.isAdmin) return <Fragment/>
    return <IonButton color="medium" size="small" fill="outline"
                      onClick={ downloadSpectrogram }>
        <IonIcon icon={ downloadOutline } slot="start"/>
        Download spectrogram (zoom x{ displayZoom })
        { isLoading && <IonSpinner/> }
    </IonButton>
}
