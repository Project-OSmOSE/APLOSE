import React, { useEffect } from 'react';
import { IonSpinner } from '@ionic/react';
import { WarningText } from '@/components/ui';
import styles from './styles.module.scss';
import { AnnotatorCanvasWindow } from '@/features/Annotator/Canvas';
import {
  BrightnessSelect,
  ColormapReverseButton,
  ColormapSelect,
  ContrastSelect,
} from '@/features/Annotator/VisualConfiguration';
import { ZoomButtons } from '@/features/Annotator/Zoom';
import { PointerInfo } from '@/features/Annotator/Pointer';
import { SpectrogramInfo } from '@/features/Annotator/Spectrogram';
import { AnnotatorSkeleton } from '@/features/Annotator/Skeleton';
import { useAppSelector } from '@/features/App';
import { selectPosition } from '@/features/Annotator/Pointer';
import { useExampleSpectrogram } from './useExampleSpectrogram';

/**
 * Spectrogram Example Page
 *
 * Displays a static NetCDF spectrogram file for demonstration and testing purposes.
 * Allows interaction with annotation visualization tools without requiring an
 * annotation campaign context.
 */
export const SpectrogramExamplePage: React.FC = () => {
  const {
    spectrogram,
    isFetching,
    error,
  } = useExampleSpectrogram();

  const position = useAppSelector(selectPosition)
  useEffect(() => {
    if (position) { // Disable scroll
      document.getElementsByTagName('html')[0].style.overflowY = 'hidden';
    } else { // Enable scroll
      document.getElementsByTagName('html')[0].style.overflowY = 'unset';
    }
  }, [ position ]);

  if (isFetching) return <AnnotatorSkeleton children={ <IonSpinner/> }/>
  if (error) return <AnnotatorSkeleton children={ <WarningText error={ error }/> }/>
  if (!spectrogram) return <AnnotatorSkeleton><div>No example spectrogram available</div></AnnotatorSkeleton>

  return <AnnotatorSkeleton>
    <div className={ styles.exampleContainer }>

      <div className={ styles.header }>
        <h1>NetCDF Spectrogram Example</h1>
        <p>Interactive visualization of a NetCDF spectrogram file with annotation tools</p>
      </div>

      <div className={ styles.spectrogramContainer }>

        <div className={ styles.spectrogramData }>

          <div className={ styles.spectrogramConfiguration }>
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

      </div>

    </div>
  </AnnotatorSkeleton>
}

export default SpectrogramExamplePage;
