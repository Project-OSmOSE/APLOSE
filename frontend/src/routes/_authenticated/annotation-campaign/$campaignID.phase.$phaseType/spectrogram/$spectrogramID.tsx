import React, { Fragment, useEffect, useMemo, useRef } from 'react';
import { createFileRoute } from '@tanstack/react-router'
import { IonSpinner } from '@ionic/react';

import { GraphQLErrorText } from '@/components/ui';

import { useAnnotationTask } from '@/api';
import { useAppSelector } from '@/features/App';
import { selectTaskIsEditionAuthorized } from '@/features/Annotator/selectors';
import { AudioDownloadButton, CurrentTime, PlaybackRateSelect, PlayPauseButton, useAudio } from '@/features/Audio';
import { PointerInfo, usePointer } from '@/features/Annotator/Pointer';
import { AnnotatorSkeleton } from '@/features/Annotator/Skeleton';
import { AnalysisSelect } from '@/features/Annotator/Analysis';
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

const AnnotatorPage: React.FC = () => {
    const { campaignID } = Route.useParams();

    const isEditionAuthorized = useAppSelector(selectTaskIsEditionAuthorized)
    const {
        spectrogram,
        paths,
        isFetching,
        error,
    } = useAnnotationTask({ refetchOnMountOrArgChange: true });
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
        if (isFetching) return <AnnotatorSkeleton children={ <IonSpinner/> }/>
        if (error) return <AnnotatorSkeleton children={ <GraphQLErrorText error={ error }/> }/>
        if (!spectrogram) return <AnnotatorSkeleton>
            <div></div>
        </AnnotatorSkeleton>

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
    }, [isFetching, error, spectrogram, isEditionAuthorized])
}

export const Route = createFileRoute(
  '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/spectrogram/$spectrogramID',
)({
  component: AnnotatorPage,
})
