import React, { createElement, Fragment } from 'react';
import styles from './styles.module.scss'
import { AnalysisComponent } from '../SpectrogramAnalysis';
import { useLoaderData } from '@tanstack/react-router';
import { useAppSelector } from '@/features/App';
import { useAnnotatorAnalysis } from '@/features/Annotator/Analysis';
import { ColormapComponent } from '@/features/Colormap';
import { Button, Note, Popover, Slider } from '@/components/base';
import {
    CalendarMinimalistic,
    MagniferZoomIn,
    MagniferZoomOut,
    MirrorLeft,
    MirrorRight,
    Restart,
    Stop,
    Sun,
    Target,
} from '@solar-icons/react';
import { selectZoom, useZoomIn, useZoomInLevel, useZoomOut, useZoomOutLevel } from '@/features/Annotator/Zoom';
import { usePointer } from '@/features/Annotator/Pointer';
import { formatTime } from '@/service/function';

export const ConfigBar: React.FC = () => {
    const {
        analysis: allAnalysis,
        campaign,
    } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const { spectrogram } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/spectrogram/$spectrogramID' })

    // Spectrogram analysis
    const {
        selectedAnalysis, setSelectedAnalysis,
        canChangeColormap,
        colormap, setColormap,
        isColormapInverted, revertColormap,
        brightness, setBrightness, resetBrightness,
        contrast, setContrast, resetContrast,
    } = useAnnotatorAnalysis()

    // Zoom
    const zoom = useAppSelector(selectZoom)
    const zoomOutLevel = useZoomOutLevel()
    const zoomOut = useZoomOut()
    const zoomInLevel = useZoomInLevel()
    const zoomIn = useZoomIn()

    // Pointer
    const pointer = usePointer()

    return <div className={ styles.ConfigBar }>

        <div className={ styles.Inner }>
            <AnalysisComponent.Select items={ allAnalysis }
                                      value={ selectedAnalysis }
                                      onValueChange={ setSelectedAnalysis }/>

            { canChangeColormap && <div className={ styles.HorizontalItem }>
                <Button color="dark" onClick={ revertColormap }>
                    { createElement(isColormapInverted ? MirrorRight : MirrorLeft, { weight: 'Bold', size: 20 }) }
                </Button>
                <ColormapComponent.Select value={ colormap }
                                          onValueChange={ setColormap }
                                          inverted={ isColormapInverted }/>
            </div> }

            { campaign.allowImageTuning && <Fragment>
                <Popover.Root>
                    <Popover.Trigger color="dark">
                        <Sun weight="Linear" size={ 20 }/>
                    </Popover.Trigger>
                    <Popover.Content className={ styles.VerticalItem }>
                        <Slider orientation="vertical"
                                label="Brightness"
                                value={ brightness }
                                onValueChange={ setBrightness }
                                onDoubleClick={ resetBrightness }/>
                        <Button onClick={ resetBrightness }>
                            <Restart weight="Linear" size={ 20 }/>
                        </Button>
                    </Popover.Content>
                </Popover.Root>

                <Popover.Root>
                    <Popover.Trigger color="dark">
                        <Stop weight="BoldDuotone" size={ 20 }/>
                    </Popover.Trigger>
                    <Popover.Content className={ styles.VerticalItem }>
                        <Slider orientation="vertical"
                                label="Contrast"
                                value={ contrast }
                                onValueChange={ setContrast }
                                onDoubleClick={ resetContrast }/>
                        <Button onClick={ resetContrast }>
                            <Restart weight="Linear" size={ 20 }/>
                        </Button>
                    </Popover.Content>
                </Popover.Root>
            </Fragment> }

            { (zoomInLevel || zoomOutLevel) && <div className={ styles.HorizontalItem }>
                <Button onClick={ () => zoomOut() } disabled={ !zoomOutLevel }>
                    <MagniferZoomOut weight="Linear" size={ 20 }/>
                </Button>
                <Button onClick={ () => zoomIn() } disabled={ !zoomInLevel }>
                    <MagniferZoomIn weight="Linear" size={ 20 }/>
                </Button>
                <Note color="medium">{ zoom }x</Note>
            </div> }
        </div>

        { pointer.position && <div className={ styles.HorizontalItem }>
            <Note color="medium" flex><Target weight="BoldDuotone" size={ 16 }/></Note>
            <Note color="dark">{ pointer.position.frequency.toFixed(2) }Hz
                / { formatTime(pointer.position.time, (spectrogram?.duration ?? 0) < 60) }</Note>
        </div> }

        <div className={ styles.HorizontalItem }>
            <Note color="medium" flex><CalendarMinimalistic weight="BoldDuotone" size={ 16 }/></Note>
            <Note color="dark">{ new Date(spectrogram.start).toUTCString() }</Note>
        </div>

    </div>
}