import React, { createElement, Fragment, useCallback } from 'react';
import styles from './styles.module.scss'
import { AnalysisComponent } from '../SpectrogramAnalysis';
import { useLoaderData } from '@tanstack/react-router';
import { useAnnotatorAnalysis } from '@/features/Annotator/Analysis/hooks';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { Analysis, setAnalysis as _setAnalysis } from '@/features/Annotator/Analysis';
import {
    resetBrightness as _resetBrightness,
    resetContrast as _resetContrast,
    revertColormap as _revertColormap,
    selectBrightness,
    selectColormap,
    selectContrast,
    selectIsColormapReversed,
    setBrightness as _setBrightness,
    setColormap as _setColormap,
    setContrast as _setContrast,
    useCanChangeColormap,
} from '@/features/Annotator/VisualConfiguration';
import { Colormap, ColormapComponent } from '@/features/Colormap';
import { Button, Note, Popover, Slider } from '@/components/base';
import { MagniferZoomIn, MagniferZoomOut, MirrorLeft, MirrorRight, Restart, Stop, Sun } from '@solar-icons/react';
import { selectZoom, useZoomIn, useZoomInLevel, useZoomOut, useZoomOutLevel } from '@/features/Annotator/Zoom';
import { usePointer } from '@/features/Annotator/Pointer';
import { formatTime } from '@/service/function';

export const ConfigBar: React.FC = () => {
    const {
        analysis: allAnalysis,
        campaign,
    } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const dispatch = useAppDispatch()
    const { spectrogram } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/spectrogram/$spectrogramID' })

    // Spectrogram analysis
    const analysis = useAnnotatorAnalysis()
    const setAnalysis = useCallback((value: Analysis | null) => {
        dispatch(_setAnalysis(value))
    }, [ dispatch ])

    // Colormap
    const canChangeColormap = useCanChangeColormap();
    //// Change
    const colormap = useAppSelector(selectColormap);
    const setColormap = useCallback((value: Colormap | null) => {
        dispatch(_setColormap(value))
    }, [ dispatch ])
    //// Invert
    const isColormapInverted = useAppSelector(selectIsColormapReversed);
    const revertColormap = useCallback(() => {
        dispatch(_revertColormap())
    }, [ dispatch ])

    // Image tuning
    //// Brightness
    const brightness = useAppSelector(selectBrightness);
    const setBrightness = useCallback((value: number) => {
        dispatch(_setBrightness(value))
    }, [ dispatch ])
    const resetBrightness = useCallback(() => {
        dispatch(_resetBrightness())
    }, [ dispatch ])
    //// Contrast
    const contrast = useAppSelector(selectContrast);
    const setContrast = useCallback((value: number) => {
        dispatch(_setContrast(value))
    }, [ dispatch ])
    const resetContrast = useCallback(() => {
        dispatch(_resetContrast())
    }, [ dispatch ])

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
                                      value={ analysis }
                                      onValueChange={ setAnalysis }/>

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

        { pointer.position && <div className={ styles.HorizontalTextItem }>
            <Note color="medium">Pointer</Note>
            <p>{ pointer.position.frequency.toFixed(2) }Hz
                / { formatTime(pointer.position.time, (spectrogram?.duration ?? 0) < 60) }</p>
        </div> }

        <div className={ styles.HorizontalTextItem }>
            <Note color="medium">Date</Note>
            { new Date(spectrogram.start).toUTCString() }
        </div>

    </div>
}