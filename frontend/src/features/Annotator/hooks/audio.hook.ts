import { MutableRefObject, useCallback, useEffect, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/service/app";
import { AnnotatorSlice, selectAnnotationID, selectAnnotations, selectAudio } from "../slice";
import { useParams } from "react-router-dom";
import { useAnnotatorInput } from "@/features/Annotator";
import { useToast } from "@/service/ui";
import { AnnotatorAPI } from "../api";
import { KEY_DOWN_EVENT, useEvent } from "@/service/events";

export const useAnnotatorAudio = (player?: MutableRefObject<HTMLAudioElement | null>) => {
  const { spectrogramID } = useParams<{ spectrogramID: string }>();
  const annotations = useAppSelector(selectAnnotations);
  const annotationID = useAppSelector(selectAnnotationID);
  const audio = useAppSelector(selectAudio);
  const { audioSpeed, analysisID } = useAnnotatorInput();
  const toast = useToast();
  const dispatch = useAppDispatch();

  // Ref
  const _isPaused = useRef<boolean>(audio.isPaused)
  useEffect(() => {
    _isPaused.current = audio.isPaused
  }, [ audio.isPaused ]);

  const { data, error } = AnnotatorAPI.endpoints.getSpectrogramPath.useQuery({
    spectrogramID: spectrogramID ?? '',
    analysisID: analysisID ?? '',
  }, {
    skip: !analysisID || !spectrogramID,
  });
  useEffect(() => {
    if (error) toast.presentError(error)
  }, [ error ]);
  useEffect(() => {
    if (player?.current) player.current.playbackRate = audioSpeed;
  }, [ audioSpeed ]);

  function onKbdEvent(event: KeyboardEvent) {
    if (event.code === 'Space') {
      event.preventDefault();
      playPause(annotations?.find(r => r.pk === annotationID));
    }
  }

  useEvent(KEY_DOWN_EVENT, onKbdEvent);

  const seek = useCallback((time: number | null) => {
    if (!player?.current || time === null) return;
    player.current.currentTime = time;
    dispatch(AnnotatorSlice.actions.setTime(time))
  }, [ player ])

  const play = useCallback((annotation?: {
    startTime?: number | null,
    endTime?: number | null,
  }) => {
    if (annotation?.startTime) seek(annotation.startTime)
    dispatch(AnnotatorSlice.actions.setStopTime(annotation?.endTime ?? undefined))
    player?.current?.play().catch(e => {
      toast.presentError(`Audio failed playing: ${ e }`)
    });
  }, [ player ])

  const pause = useCallback(() => {
    player?.current?.pause();
  }, [ player ])

  const playPause = useCallback((annotation?: {
    startTime?: number | null,
    endTime?: number | null,
  }) => {
    if (_isPaused.current) play(annotation);
    else pause();
  }, [ _isPaused.current ])

  const audioPath = useMemo(() => data?.spectrogramById?.audioPath, [ data ])

  return { ...audio, audioPath, seek, play, pause, playPause, }
}