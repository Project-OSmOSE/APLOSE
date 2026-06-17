import React, { useCallback, useEffect } from 'react';
import styles from './styles.module.scss';
import { Kbd } from '@/components/ui';
import { IonButton, IonIcon } from '@ionic/react';
import { caretBack, caretForward } from 'ionicons/icons/index.js';
import { useAnnotatorCanNavigate, useOpenAnnotator } from './hooks';
import { useKeyDownEvent } from '@/features/UX/Events';
import { useAnnotatorSubmit } from '@/features/Annotator';
import { useLoaderData, useParams, useSearch } from '@tanstack/react-router';
import { queryClient } from '@/api/queryClient';
import { AnnotationSpectrogram } from '@/features';
import { Popover } from '@/components/base/Popover';

export const NavigationButtons: React.FC = () => {
    const { user } = useLoaderData({ from: '/_authenticated' })
    const params = useParams({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/spectrogram/$spectrogramID' })
    const search = useSearch({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/spectrogram/$spectrogramID' })
    const {
        info,
        isEditionAuthorized,
    } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/spectrogram/$spectrogramID' })
    const canNavigate = useAnnotatorCanNavigate()
    const openAnnotator = useOpenAnnotator()
    const { submit, isPending } = useAnnotatorSubmit()

    const navPrevious = useCallback(async () => {
        if (isPending) return;
        if (!info?.previousSpectrogramId) return;
        if (await canNavigate()) openAnnotator(info.previousSpectrogramId)
    }, [ openAnnotator, isPending, info, canNavigate ])
    const navNext = useCallback(async () => {
        if (isPending) return;
        if (!info?.nextSpectrogramId) return;
        if (await canNavigate()) openAnnotator(info.nextSpectrogramId)
    }, [ canNavigate, openAnnotator, isPending, info ])

    useKeyDownEvent([ 'ArrowLeft' ], navPrevious)
    useKeyDownEvent([ 'ArrowRight' ], navNext)

    useEffect(() => {
        if (!info?.nextSpectrogramId) return
        queryClient.prefetchQuery(AnnotationSpectrogram.API.getQuery({
            ...params,
            ...search,
            annotatorID: user.id,
            spectrogramID: info.nextSpectrogramId,
        }))
    }, [ info ]);

    return (
        <div className={ styles.navigation }>
            <Popover.Root>
                <Popover.Trigger openOnHover>
                    <IonButton color="medium" fill="clear" size="small"
                               disabled={ isPending || !info?.previousSpectrogramId }
                               onClick={ navPrevious }>
                        <IonIcon icon={ caretBack } slot="icon-only"/>
                    </IonButton>
                </Popover.Trigger>
                <Popover.Content>
                    <Popover.Title>Shortcut</Popover.Title>
                    <Kbd keys="left"/> : Load previous recording
                </Popover.Content>
            </Popover.Root>

            { isEditionAuthorized &&
                <Popover.Root>
                    <Popover.Trigger openOnHover>
                        <IonButton color="medium" fill="outline"
                                   disabled={ isPending }
                                   onClick={ submit }>
                            Submit &amp; load next recording
                        </IonButton>
                    </Popover.Trigger>
                    <Popover.Content>
                        <Popover.Title>Shortcut</Popover.Title>
                        <Kbd keys="enter"/> : Submit & load next recording
                    </Popover.Content>
                </Popover.Root> }

            <Popover.Root>
                <Popover.Trigger openOnHover>
                    <IonButton color="medium" fill="clear" size="small"
                               disabled={ isPending || !info?.nextSpectrogramId }
                               onClick={ navNext }>
                        <IonIcon icon={ caretForward } slot="icon-only"/>
                    </IonButton>
                </Popover.Trigger>
                <Popover.Content>
                    <Popover.Title>Shortcut</Popover.Title>
                    <Kbd keys="right"/> : Load next recording
                </Popover.Content>
            </Popover.Root>
        </div>
    )
}