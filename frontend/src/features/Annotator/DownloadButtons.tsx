import React, { Fragment, useCallback, useState } from 'react';
import { Button, ButtonGroup, Spinner } from '@/components/base';
import { useAudio } from '@/features/Audio';
import { useLoaderData } from '@tanstack/react-router';
import { Download } from '@solar-icons/react';
import { useAnnotatorCanvasContext, useDownloadCanvas } from '@/features/Annotator/Canvas';
import { Zoom } from '@/features/Annotator/Zoom';
import { useTileManager } from '@/features/Annotator/Spectrogram/tile-manager.hook';
import { useAnnotatorAnalysis } from '@/features/Annotator/Analysis';

export const DownloadButtons: React.FC = () => {
    const { user } = useLoaderData({ from: '/_authenticated' })
    const audio = useAudio()
    const { zoomLevel } = Zoom.useContext()
    const download = useDownloadCanvas();
    const { spectrogram } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/spectrogram/$spectrogramID' })

    const { displayCanvasRef, left } = useAnnotatorCanvasContext()
    const { selectedAnalysis } = useAnnotatorAnalysis()
    const { update } = useTileManager({
        canvasRef: displayCanvasRef!,
        spectrogram,
        analysis: selectedAnalysis,
        left,
        passive: true,
    })

    const [ isDownloadingSpectrogram, setIsDownloadingSpectrogram ] = useState<boolean>(false);
    const downloadSpectrogram = useCallback(async () => {
        if (!spectrogram) return;
        setIsDownloadingSpectrogram(true);
        try {
            await update({ displayAllTiles: true })
            await download(`${ spectrogram.filename }-x${ zoomLevel }.png`)
        } finally {
            setIsDownloadingSpectrogram(false);
        }
    }, [ download, spectrogram, zoomLevel ])

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
            Download spectrogram (zoom x{ zoomLevel })
        </Button> }

        { isDownloadingSpectrogram && <Spinner/> }

    </ButtonGroup>
}