import React, { Fragment, useEffect, useState } from 'react';
import { useAnnotationTask } from '@/api';
import { IonSpinner } from '@ionic/react';
import { WarningText } from '@/components/ui';
import { AudioDownloadButton, CurrentTime, PlaybackRateSelect, PlayPauseButton, useAudio } from '@/features/Audio';
import styles from './styles.module.scss';
import { AnnotatorCanvasWindow } from '@/features/Annotator/Canvas';
import { AnalysisSelect } from '@/features/Annotator/Analysis';
import {
  BrightnessSelect,
  ColormapReverseButton,
  ColormapSelect,
  ContrastSelect,
} from '@/features/Annotator/VisualConfiguration';
import { ZoomButtons } from '@/features/Annotator/Zoom';
import { PointerInfo, useAnnotatorPointer } from '@/features/Annotator/Pointer';
import { SpectrogramDownloadButton, SpectrogramInfo } from '@/features/Annotator/Spectrogram';
import { NavigationButtons } from '@/features/Annotator/Navigation';
import { FocusedAnnotationBloc } from '@/features/Annotator/Annotation';
import { LabelsBloc } from '@/features/Annotator/Label';
import { ConfidenceBloc } from '@/features/Annotator/Confidence';
import { CommentBloc } from '@/features/Annotator/Comment';
import { AnnotationsBloc } from '@/features/Annotator/Annotation/AnnotationsBloc';
import { AnnotatorSkeleton } from '@/features/Annotator/Skeleton';
import { useNavParams } from '@/features/UX';

export const AnnotatorPage: React.FC = () => {
  // const { usedColormap: colormapClass } = useAnnotatorInput(); // TODO: check use: colormapClass was in div classes
  const { campaignID } = useNavParams();

  const {
    spectrogram,
    isEditionAuthorized,
    isFetching,
    error,
  } = useAnnotationTask({ refetchOnMountOrArgChange: true });
  const audio = useAudio()

  useEffect(() => {
    if (spectrogram?.audioPath) audio.setSource(spectrogram.audioPath)

    return () => {
      audio.clearSource() // TODO: check behavior when navigating between files
    }
  }, [ spectrogram ]);

  const [ _previousCampaignID, _setPreviousCampaignID ] = useState<string>();
  useEffect(() => {
    if (_previousCampaignID !== campaignID) {
      _setPreviousCampaignID(campaignID)
      audio.setPlaybackRate(1)
    }
  }, [ campaignID ]);

  const { position } = useAnnotatorPointer()
  useEffect(() => {
    if (position) { // Disable scroll
      document.getElementsByTagName('html')[0].style.overflowY = 'hidden';
    } else { // Enable scroll
      document.getElementsByTagName('html')[0].style.overflowY = 'unset';
    }
  }, [ position ]);

  if (isFetching) return <AnnotatorSkeleton children={ <IonSpinner/> }/>
  if (error) return <AnnotatorSkeleton children={ <WarningText error={ error }/> }/>
  if (!spectrogram) return <AnnotatorSkeleton/>

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
}
