import React, { Fragment, useCallback, useEffect, useRef } from "react";
import styles from './styles.module.scss';
import { IonSpinner } from "@ionic/react";
import { FadedText, WarningText } from "@/components/ui";
import { formatTime, getErrorMessage } from "@/service/function";
import { useAppDispatch, useAppSelector } from "@/service/app.ts";
import { SettingsSlice } from "@/service/slices/settings.ts";
import { Input } from "@/components/form";
import { AudioPlayer } from "./AudioPlayer";
import {
  AudioDownloadButton,
  NavigationButtons,
  PlayPauseButton,
  SpectrogramDownloadButton,
  ZoomButton
} from "./buttons";
import { ColormapConfiguration, NFFTSelect, PlaybackRateSelect } from "./select";
import { SpectrogramImage } from './input';
import { Annotations, Comment, ConfidenceIndicator, CurrentAnnotation, Labels } from './bloc';
import { SpectrogramRender } from "./spectrogram";
import { selectAudio, useAnnotatorInput, useAnnotatorQuery, useAnnotatorUI } from "@/features/Annotator";


export const Annotator: React.FC = () => {
  const { isFetching, error, data, canEdit } = useAnnotatorQuery({
    refetchOnMountOrArgChange: true
  })
  const { usedColormap: colormapClass } = useAnnotatorInput(); // TODO: check use

  const { disableSpectrogramResize } = useAppSelector(state => state.settings);
  const dispatch = useAppDispatch()

  // State
  const { pointerPosition } = useAnnotatorUI()
  const audio = useAppSelector(selectAudio)

  // Refs
  const localIsPaused = useRef<boolean>(true);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const spectrogramRenderRef = useRef<SpectrogramRender | null>(null);

  useEffect(() => {
    localIsPaused.current = audio.isPaused;
  }, [ audio.isPaused ])

  const toggleSpectrogramResize = useCallback(() => {
    if (disableSpectrogramResize) {
      dispatch(SettingsSlice.actions.allowSpectrogramResize())
    } else {
      dispatch(SettingsSlice.actions.disableSpectrogramResize())
    }
  }, [ disableSpectrogramResize ])

  return <div className={ [ styles.annotator, colormapClass ].join(' ') }>

    { isFetching && <IonSpinner/> }
    { error && <WarningText>{ getErrorMessage(error) }</WarningText> }

    <AudioPlayer ref={ audioPlayerRef }/>

    { !isFetching && data?.spectrogramById && <Fragment>
        <div className={ styles.spectrogramContainer }>
            <div className={ styles.spectrogramData }>
                <div className={ styles.spectrogramInfo }>
                    <NFFTSelect/>
                    <ColormapConfiguration/>
                    <SpectrogramImage/>
                    <ZoomButton/>
                </div>

                <div className={ styles.pointerInfo }>
                  { pointerPosition && <Fragment>
                      <FadedText>Pointer</FadedText>
                      <p>{ pointerPosition.frequency.toFixed(2) }Hz
                          / { formatTime(pointerPosition.time, (data.spectrogramById.duration ?? 0) < 60) }</p>

                  </Fragment> }
                </div>

                <div className={ styles.campaignInfo }>
                    <div>
                        <FadedText>Date:</FadedText>
                        <p>{ new Date(data.spectrogramById.start).toUTCString() }</p>
                    </div>
                </div>
            </div>

            <SpectrogramRender ref={ spectrogramRenderRef } audioPlayer={ audioPlayerRef }/>

            <div className={ styles.spectrogramNavigation }>
                <div className={ styles.audioNavigation }>
                    <PlayPauseButton player={ audioPlayerRef }/>
                    <PlaybackRateSelect player={ audioPlayerRef }/>
                </div>

                <NavigationButtons/>

                <p>{ data.spectrogramById.duration && <Fragment>
                  { formatTime(audio.time, data.spectrogramById.duration < 60) }&nbsp;/&nbsp;{ formatTime(data.spectrogramById.duration) }
                </Fragment> }</p>
            </div>
        </div>

        <div
            className={ styles.blocContainer }>
          { canEdit && <Fragment>
              <CurrentAnnotation/>
              <Labels/>
              <ConfidenceIndicator/>
              <Comment/>
              <Annotations onSelect={ r => spectrogramRenderRef.current?.onResultSelected(r) }/>
          </Fragment> }
        </div>

        <div className={ styles.downloadButtons }>
            <Input type="checkbox" label="Disable automatic spectrogram resize"
                   checked={ disableSpectrogramResize } onChange={ toggleSpectrogramResize }/>

            <AudioDownloadButton/>
            <SpectrogramDownloadButton render={ spectrogramRenderRef }/>
        </div>
    </Fragment> }

  </div>
}