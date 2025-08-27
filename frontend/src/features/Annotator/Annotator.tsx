import React, { Fragment, useCallback, useEffect, useMemo, useRef } from "react";
import styles from './styles.module.scss';
import { IonSpinner } from "@ionic/react";
import { FadedText, WarningText } from "@/components/ui";
import { getErrorMessage } from "@/service/function.ts";
import { useAppDispatch, useAppSelector } from "@/service/app.ts";
import { formatTime } from "@/service/dataset/spectrogram-configuration/scale";
import { useCurrentConfiguration } from '@/service/annotator/spectrogram';
import { Colormap } from '@/service/ui/color.ts';
import { useRetrieveAnnotator } from "@/service/api/annotator.ts";
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
import { Comment, ConfidenceIndicator, CurrentAnnotation, Labels, Results } from './bloc';
import { SpectrogramRender } from "./spectrogram";


export const Annotator: React.FC = () => {
  const { colormap } = useAppSelector(state => state.annotator.userPreferences);
  const currentConfiguration = useCurrentConfiguration();
  const { isFetching, error, data, isEditable } = useRetrieveAnnotator({
    refetchOnMountOrArgChange: true
  })
  const colormapClass: Colormap = useMemo(() => {
    if (!currentConfiguration) return "Greys";
    if (currentConfiguration.colormap !== "Greys") return currentConfiguration.colormap;
    return colormap ?? "Greys";
  }, [ colormap, currentConfiguration ]);
  const { disableSpectrogramResize } = useAppSelector(state => state.settings);
  const dispatch = useAppDispatch()

  // State
  const pointerPosition = useAppSelector(state => state.annotator.ui.pointerPosition);
  const audio = useAppSelector(state => state.annotator.audio)

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

    { !isFetching && data && <Fragment>
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
                          / { formatTime(pointerPosition.time, data.file.duration < 60) }</p>

                  </Fragment> }
                </div>

                <div className={ styles.campaignInfo }>
                    <div>
                        <FadedText>Sampling:</FadedText>
                        <p>{ data.file.dataset_sr }Hz</p>
                    </div>
                    <div>
                        <FadedText>Date:</FadedText>
                        <p>{ new Date(data.file.start).toUTCString() }</p>
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

                <p>{ formatTime(audio.time, data.file.duration < 60) }&nbsp;/&nbsp;{ formatTime(data.file.duration) }</p>
            </div>
        </div>

        <div
            className={ styles.blocContainer }>
          { isEditable && <Fragment>
              <CurrentAnnotation/>
              <Labels/>
              <ConfidenceIndicator/>
              <Comment/>
              <Results onSelect={ r => spectrogramRenderRef.current?.onResultSelected(r) }/>
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