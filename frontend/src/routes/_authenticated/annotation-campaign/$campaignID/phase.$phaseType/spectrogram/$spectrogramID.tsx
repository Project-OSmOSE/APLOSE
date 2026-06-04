import React, { Fragment, useEffect, useMemo, useRef } from 'react';
import { createFileRoute, notFound } from '@tanstack/react-router'

import { AnnotationPhaseType } from '@/api';
import { useAppSelector } from '@/features/App';
import { AudioDownloadButton, CurrentTime, PlaybackRateSelect, PlayPauseButton, useAudio } from '@/features/Audio';
import { PointerInfo, usePointer } from '@/features/Annotator/Pointer';
import { AnnotatorSkeleton } from '@/features/Annotator/Skeleton';
import { AnalysisSelect, selectAnalysisID } from '@/features/Annotator/Analysis';
import {
    BrightnessSelect,
    ColormapReverseButton,
    ColormapSelect,
    ContrastSelect,
} from '@/features/Annotator/VisualConfiguration';
import { ZoomButtons } from '@/features/Annotator/Zoom';
import { SpectrogramDownloadButton, SpectrogramInfo } from '@/features/Annotator/Spectrogram';
import { AnnotatorCanvasWindow } from '@/features/Annotator/Canvas';
import { NavigationButtons } from '@/features/Annotator/Navigation';
import { FocusedAnnotationBloc } from '@/features/Annotator/Annotation';
import { LabelsBloc } from '@/features/Annotator/Label';
import { ConfidenceBloc } from '@/features/Annotator/Confidence';
import { CommentBloc } from '@/features/Annotator/Comment';
import { AnnotationsBloc } from '@/features/Annotator/Annotation/AnnotationsBloc';

import styles from './$spectrogramID.module.scss';
import { type AllSpectrogramsFilters } from '@/features/AnnotationSpectrogram';
import { queryClient } from '@/api/queryClient';
import { AnnotationCampaign, AnnotationSpectrogram, User } from '@/features';
import { useQuery } from '@tanstack/react-query';

const AnnotatorPage: React.FC = () => {
    const campaignID = Route.useParams({ select: ({ campaignID }) => campaignID });
    const { spectrogram, isEditionAuthorized } = Route.useLoaderData()

    const analysisID = useAppSelector(selectAnalysisID)
    const {
        data: paths,
    } = useQuery({
        ...AnnotationSpectrogram.API.getPathQuery({
            spectrogramID: spectrogram.id,
            analysisID: analysisID ?? '',
        }), enabled: !!analysisID, refetchOnMount: true,
    });
    const audio = useAudio()

    useEffect(() => {
        if (paths?.audioPath) audio.setSource(paths.audioPath)
        else audio.clearSource()

        return () => {
            audio.clearSource() // TODO: check behavior when navigating between files
        }
    }, [ paths ]);

    const previousCampaignID = useRef<string | undefined>()
    useEffect(() => {
        if (previousCampaignID.current !== campaignID) {
            previousCampaignID.current = campaignID
            audio.setPlaybackRate(1)
        }
    }, [ campaignID ]);

    const pointer = usePointer()
    useEffect(() => {
        if (pointer.position) { // Disable scroll
            document.getElementsByTagName('html')[0].style.overflowY = 'hidden';
        } else { // Enable scroll
            document.getElementsByTagName('html')[0].style.overflowY = 'unset';
        }
    }, [ pointer.position ]);

    return useMemo(() => {
        return <AnnotatorSkeleton>
            <div className={ styles.annotator }>

                <div className={ styles.spectrogramContainer }>

                    <div className={ styles.spectrogramData }>

                        <div className={ styles.spectrogramConfiguration }>
                            <AnalysisSelect/>
                            <div>
                                <ColormapSelect/>
                                <ColormapReverseButton/>
                            </div>
                            <BrightnessSelect/>
                            <ContrastSelect/>
                            <ZoomButtons/>
                        </div>

                        <PointerInfo/>
                        <SpectrogramInfo/>
                    </div>

                    <AnnotatorCanvasWindow/>

                    <div className={ styles.spectrogramNavigation }>
                        <div className={ styles.audioNavigation }>
                            <PlayPauseButton/>
                            <PlaybackRateSelect/>
                        </div>
                        <NavigationButtons/>
                        <CurrentTime/>
                    </div>
                </div>

                <div className={ styles.blocContainer }>
                    { isEditionAuthorized && <Fragment>
                        <FocusedAnnotationBloc/>
                        <LabelsBloc/>
                        <ConfidenceBloc/>
                        <CommentBloc/>
                        <AnnotationsBloc/>
                    </Fragment> }
                </div>

                <div className={ styles.downloadButtons }>
                    <AudioDownloadButton/>
                    <SpectrogramDownloadButton/>
                </div>
            </div>
        </AnnotatorSkeleton>
    }, [ spectrogram, isEditionAuthorized ])
}

export const Route = createFileRoute(
    '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/spectrogram/$spectrogramID',
)({
    validateSearch: (search: Record<string, unknown>) => search as AllSpectrogramsFilters,
    params: {
        parse: rawParams => rawParams as { campaignID: string, spectrogramID: string, phaseType: AnnotationPhaseType },
    },
    loaderDeps: ({ search }) => search as AllSpectrogramsFilters,
    loader: async ({ params: { campaignID, phaseType, spectrogramID }, deps }) => {
        const user = await queryClient.ensureQueryData(User.API.currentQuery)
        const [
            { spectrogram, ...data },
            { analysis }
        ] = await Promise.all([
            queryClient.ensureQueryData(AnnotationSpectrogram.API.getQuery({
            campaignID, phaseType, spectrogramID, ...deps, annotatorID: user!.id,
        })),
            queryClient.ensureQueryData(AnnotationCampaign.API.byIdQuery({ id: campaignID }))
        ])
        if (!spectrogram) throw notFound()
        const baseScaleAnalysis = analysis.find(a =>
            !a.frequencyScaleParts || a.frequencyScaleParts.length == 0 ||
            (a.frequencyScaleParts.length == 1 && a.frequencyScaleParts[0]!.minValue == 0 && a.frequencyScaleParts[0]!.maxValue == a.fft.samplingFrequency / 2),
        );
        const minID = Math.min(...analysis.map(a => +a!.id))?.toString();
        const defaultAnalysis = minID ? analysis.find(a => a.id === (baseScaleAnalysis?.id ?? minID)) : undefined

        if (defaultAnalysis) {
            await queryClient.ensureQueryData(AnnotationSpectrogram.API.getPathQuery({
                spectrogramID: spectrogram.id,
                analysisID: defaultAnalysis.id,
            }))
        }
        return { spectrogram, defaultAnalysis, ...data }
    },
    component: AnnotatorPage,
})
