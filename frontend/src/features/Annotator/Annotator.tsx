import React, { Fragment } from 'react';
import styles from './styles.module.scss'
import { AnnotatorCanvasContextProvider, AnnotatorCanvasWindow } from '@/features/Annotator/Canvas';
import { AnalysisSelect } from '@/features/Annotator/Analysis';
import {
  BrightnessSelect,
  ColormapReverseButton,
  ColormapSelect,
  ContrastSelect,
} from '@/features/Annotator/VisualConfiguration';
import { ZoomButtons } from '@/features/Annotator/Zoom';
import { PointerInfo } from '@/features/Annotator/Pointer';
import { useAnnotationTask } from '@/api';
import { SpectrogramDownloadButton, SpectrogramInfo } from '@/features/Annotator/Spectrogram';
import { AudioDownloadButton, CurrentTime, PlaybackRateSelect, PlayPauseButton } from '@/features/Audio';
import { LabelsBloc } from '@/features/Annotator/Label';
import { ConfidenceBloc } from '@/features/Annotator/Confidence';
import { FocusedAnnotationBloc } from '@/features/Annotator/Annotation';
import { AnnotationsBloc } from '@/features/Annotator/Annotation/AnnotationsBloc';
import { CommentBloc } from '@/features/Annotator/Comment';
import { NavigationButtons } from '@/features/Annotator/Navigation';


export const Annotator: React.FC = () => {
  const { spectrogram, isEditionAuthorized } = useAnnotationTask()

  if (!spectrogram) return <Fragment/>;
  return <AnnotatorCanvasContextProvider>
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
  </AnnotatorCanvasContextProvider>
}
