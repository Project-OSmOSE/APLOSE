import React, { Fragment, useCallback, useState } from 'react';
import { Button, ButtonGroup, Spinner } from '@/components/base';
import { useAudio } from '@/features/Audio';
import { useLoaderData } from '@tanstack/react-router';
import { Download } from '@solar-icons/react';
import { useDownloadCanvas } from '@/features/Annotator/Canvas';
import { useAppSelector } from '@/features/App';
import { selectZoom } from '@/features/Annotator/Zoom';

export const DownloadButtons: React.FC = () => {
    const { user } = useLoaderData({ from: '/_authenticated' })
    const audio = useAudio()
    const zoom = useAppSelector(selectZoom)
    const download = useDownloadCanvas();
    const { spectrogram } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/spectrogram/$spectrogramID' })

    const [ isDownloadingSpectrogram, setIsDownloadingSpectrogram ] = useState<boolean>(false);
    const downloadSpectrogram = useCallback(async () => {
        if (!spectrogram) return;
        setIsDownloadingSpectrogram(true);
        try {
            await download(`${ spectrogram.filename }-x${ zoom }.png`)
        } finally {
            setIsDownloadingSpectrogram(false);
        }
    }, [ download, spectrogram, zoom ])

    if (!user.isAdmin) return <Fragment/>
    return <ButtonGroup center>

        { audio.source && <Button color="medium"
                                  onClick={ audio.download }>
            <Download weight="Linear" size={ 20 }/>
            Download audio
        </Button> }

        { spectrogram && <Button color="medium"
                                 disabled={ isDownloadingSpectrogram }
                                 onClick={ downloadSpectrogram }>
            <Download weight="Linear" size={ 20 }/>
            Download spectrogram (zoom x{ zoom })
        </Button> }

        { isDownloadingSpectrogram && <Spinner/> }

    </ButtonGroup>
}