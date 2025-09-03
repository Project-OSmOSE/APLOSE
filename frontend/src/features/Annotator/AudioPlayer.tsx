import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { useAppDispatch } from '@/service/app';
import { AnnotatorSlice, useAnnotatorAudio, useAnnotatorInput, useAnnotatorQuery } from "@/features/Annotator";

// Heavily inspired from ReactAudioPlayer
// https://github.com/justinmc/react-audio-player

export const AudioPlayer = React.forwardRef<HTMLAudioElement | null, any>((_, ref) => {
  const { data } = useAnnotatorQuery()
  const elementRef = useRef<HTMLAudioElement | null>(null);
  const { audioPath, pause, stopTime } = useAnnotatorAudio(elementRef)
  const { audioSpeed } = useAnnotatorInput()
  const dispatch = useAppDispatch();

  const stopTimeRef = useRef<number | undefined>(stopTime);
  useEffect(() => {
    stopTimeRef.current = stopTime
  }, [ stopTime ]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!elementRef.current || elementRef.current?.paused) return;

      const time = elementRef.current?.currentTime;
      if (stopTimeRef.current && time && time > stopTimeRef.current) pause();
      else dispatch(AnnotatorSlice.actions.setTime(time))
    }, 1 / 30) // 1/30 is the more common video FPS os it should be enough to update currentTime in view

    return () => clearInterval(interval)
  }, [ data?.spectrogramById ]);

  useEffect(() => {
    dispatch(AnnotatorSlice.actions.onPause())
    if (elementRef.current) {
      elementRef.current.volume = 1.0;
      elementRef.current.preservesPitch = false;
      elementRef.current.playbackRate = audioSpeed;
    }
  }, [ elementRef.current ])

  useImperativeHandle<HTMLAudioElement | null, HTMLAudioElement | null>(ref,
    () => elementRef.current,
    [ elementRef.current ]
  );

  // title property used to set lockscreen / process audio title on devices
  return (
    <audio autoPlay={ false }
           controls={ false }
           loop={ false }
           muted={ false }
           ref={ elementRef }
           onLoadedMetadata={ () => dispatch(AnnotatorSlice.actions.setTime(0)) }
           onAbort={ () => dispatch(AnnotatorSlice.actions.onPause()) }
           onEnded={ () => dispatch(AnnotatorSlice.actions.onPause()) }
           onPause={ () => dispatch(AnnotatorSlice.actions.onPause()) }
           onPlay={ () => dispatch(AnnotatorSlice.actions.onPlay()) }
           preload="auto"
           src={ audioPath ?? undefined }
           title={ audioPath ?? undefined }>
      <p>Your browser does not support the <code>audio</code> element.</p>
    </audio>
  );
});
