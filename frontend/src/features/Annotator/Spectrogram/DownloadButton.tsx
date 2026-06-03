import React, { Fragment, useCallback, useState } from 'react';
import { IonButton, IonIcon, IonSpinner } from '@ionic/react';
import { downloadOutline } from 'ionicons/icons/index.js';
import { useDownloadCanvas } from '@/features/Annotator/Canvas';
import { selectZoom } from '@/features/Annotator/Zoom';
import { useAppSelector } from '@/features/App';
import { useLoaderData } from '@tanstack/react-router';

export const SpectrogramDownloadButton: React.FC = () => {
    const { spectrogram } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/spectrogram/$spectrogramID' })
    const { user } = useLoaderData({ from: '/_authenticated' })
    const zoom = useAppSelector(selectZoom)
    const download = useDownloadCanvas();
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

    if (!spectrogram || !user.isAdmin) return <Fragment/>
    return <IonButton color="medium" size="small" fill="outline"
                      onClick={ downloadSpectrogram }>
        <IonIcon icon={ downloadOutline } slot="start"/>
        Download spectrogram (zoom x{ zoom })
        { isLoading && <IonSpinner/> }
    </IonButton>
}
