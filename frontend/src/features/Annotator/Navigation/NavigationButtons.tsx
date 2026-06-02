import React, { useCallback } from 'react';
import styles from './styles.module.scss';
import { Kbd, TooltipOverlay } from '@/components/ui';
import { IonButton, IonIcon } from '@ionic/react';
import { caretBack, caretForward } from 'ionicons/icons/index.js';
import { useAnnotatorCanNavigate, useOpenAnnotator } from './hooks';
import { useKeyDownEvent } from '@/features/UX/Events';
import { useAnnotatorSubmit } from '@/features/Annotator';
import { useLoaderData } from '@tanstack/react-router';

export const NavigationButtons: React.FC = () => {
    const { info, isEditionAuthorized } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/spectrogram/$spectrogramID' })
    const canNavigate = useAnnotatorCanNavigate()
    const openAnnotator = useOpenAnnotator()
    const { submit, isLoading } = useAnnotatorSubmit()

    const navPrevious = useCallback(async () => {
        if (isLoading) return;
        if (!info?.previousSpectrogramId) return;
        if (await canNavigate()) openAnnotator(info.previousSpectrogramId)
    }, [ openAnnotator, isLoading, info, canNavigate ])
    const navNext = useCallback(async () => {
        if (isLoading) return;
        if (!info?.nextSpectrogramId) return;
        if (await canNavigate()) openAnnotator(info.nextSpectrogramId)
    }, [ canNavigate, openAnnotator, isLoading, info ])

    useKeyDownEvent([ 'ArrowLeft' ], navPrevious)
    useKeyDownEvent([ 'ArrowRight' ], navNext)

    return (
        <div className={ styles.navigation }>
            <TooltipOverlay title="Shortcut" tooltipContent={ <p><Kbd keys="left"/> : Load previous recording</p> }>
                <IonButton color="medium" fill="clear" size="small"
                           disabled={ isLoading || !info?.previousSpectrogramId }
                           onClick={ navPrevious }>
                    <IonIcon icon={ caretBack } slot="icon-only"/>
                </IonButton>
            </TooltipOverlay>

            { isEditionAuthorized &&
                <TooltipOverlay title="Shortcut"
                                tooltipContent={ <p><Kbd keys="enter"/> : Submit & load next recording</p> }>
                    <IonButton color="medium" fill="outline"
                               disabled={ isLoading }
                               onClick={ submit }>
                        Submit &amp; load next recording
                    </IonButton>
                </TooltipOverlay> }

            <TooltipOverlay title="Shortcut" tooltipContent={ <p><Kbd keys="right"/> : Load next recording</p> }>
                <IonButton color="medium" fill="clear" size="small"
                           disabled={ isLoading || !info?.nextSpectrogramId }
                           onClick={ navNext }>
                    <IonIcon icon={ caretForward } slot="icon-only"/>
                </IonButton>
            </TooltipOverlay>
        </div>
    )
}