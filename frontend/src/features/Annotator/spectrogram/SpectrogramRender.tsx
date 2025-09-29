import React, {
  MouseEvent,
  MutableRefObject,
  PointerEvent,
  UIEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  WheelEvent
} from "react";
import styles from '../styles.module.scss'
import { useAppSelector } from '@/service/app';
import { useToast } from "@/service/ui";
import { MOUSE_DOWN_EVENT, MOUSE_MOVE_EVENT, MOUSE_UP_EVENT, useEvent } from "@/service/events";
import { useRetrieveCurrentCampaign } from "@/service/api/campaign.ts";
import { useRetrieveCurrentPhase } from "@/service/api/campaign-phase.ts";
import { AcousticFeatures } from "../bloc/AcousticFeatures.tsx";
import { AxisRef, XAxis } from "./XAxis";
import { YAxis } from "./YAxis";
import { TimeBar } from "./TimeBar";
import { Annotation } from "./annotation";
import {
  Annotation as _Annotation,
  useAnnotatorAnnotations,
  useAnnotatorConfidence,
  useAnnotatorInput,
  useAnnotatorLabel,
  useAnnotatorPointer,
  useAnnotatorQuery,
  useAnnotatorUI,
  useAxis,
  useSpectrogram,
  useSpectrogramDisplay,
  Y_WIDTH,
} from "@/features/Annotator";
import { AnnotationType } from "@/features/_utils_/gql/types.generated.ts";
import { useAnnotatorAudio } from "@/features/Annotator/hooks/audio.hook.ts";


interface Props {
  audioPlayer: MutableRefObject<HTMLAudioElement | null>;
}

export interface SpectrogramRender {
  getCanvasData: () => Promise<string>;
  onResultSelected: (result: _Annotation) => void;
}

export const SpectrogramRender = React.forwardRef<SpectrogramRender, Props>(({ audioPlayer, }, ref) => {
  const { data } = useAnnotatorQuery()
  const { campaign } = useRetrieveCurrentCampaign()
  const { phase } = useRetrieveCurrentPhase()
  const { annotations, add } = useAnnotatorAnnotations()
  const {
    zoomIn, zoomOut, zoomOrigin, zoom,
    analysisID,
    colormap, invertedColormap, brightness, contrast,
  } = useAnnotatorInput()
  const { selected: label } = useAnnotatorLabel()
  const { selected: confidence } = useAnnotatorConfidence()
  const {
    setPointerPosition,
    leavePointerPosition,
    markFileAsSeen,
    isAnnotationDisabled
  } = useAnnotatorUI()
  const { time } = useAnnotatorAudio()
  const {
    disableSpectrogramResize
  } = useAppSelector(state => state.settings)
  const { containerWidth, height, width } = useSpectrogram()
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { updateDisplay } = useSpectrogramDisplay(canvasRef)
  const [ newResult, setNewResult ] = useState<Pick<_Annotation, 'type' | 'startTime' | 'endTime' | 'startFrequency' | 'endFrequency'> | undefined>(undefined);
  const _newResult = useRef<Pick<_Annotation, 'type' | 'startTime' | 'endTime' | 'startFrequency' | 'endFrequency'> | undefined>(undefined);
  useEffect(() => {
    setNewResult(_newResult.current)
  }, [ _newResult.current ]);

  // Ref
  const renderRef = useRef<HTMLDivElement>(null)
  const yAxisCanvasRef = useRef<AxisRef | null>(null);
  const xAxisCanvasRef = useRef<AxisRef | null>(null);
  const labelRef = useRef<string | undefined>(label)
  useEffect(() => {
    labelRef.current = label
  }, [ label ]);
  const confidenceRef = useRef<string | undefined | null>(confidence)
  useEffect(() => {
    confidenceRef.current = confidence
  }, [ confidence ]);


  // Services
  const { xAxis, yAxis } = useAxis()

  const { seek } = useAnnotatorAudio(audioPlayer);
  const pointerService = useAnnotatorPointer();
  const toast = useToast();

  const [ _zoom, _setZoom ] = useState<number>(1);
  const currentTime = useRef<number>(0)


  // Is drawing enabled? (always in box mode, when a label is selected in presence mode)
  const isEditable: boolean = useMemo(() => !campaign?.archive && !phase?.ended_by && !!data?.annotationTaskIndexes?.current, [ campaign, phase, data ])
  const isDrawingEnabled = useMemo(() => !isAnnotationDisabled && !!label && isEditable, [ isAnnotationDisabled, label, isEditable ]);
  const _isDrawingEnabled = useRef<boolean>(isDrawingEnabled)
  useEffect(() => {
    _isDrawingEnabled.current = isDrawingEnabled
  }, [ isDrawingEnabled ]);

  useEffect(() => {
    updateDisplay(newResult)
  }, [
    data?.spectrogramById,
    data?.allSpectrogramAnalysis,
    analysisID,
    colormap,
    invertedColormap,
    brightness,
    contrast,
    disableSpectrogramResize
  ])


  // On zoom updated
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = renderRef.current;
    if (!canvas || !wrapper || !data?.spectrogramById) return;

    // If zoom factor has changed
    if (zoom === _zoom) return;
    // New timePxRatio
    const newTimePxRatio: number = containerWidth * zoom / data.spectrogramById.duration;

    // Resize canvases and scroll
    canvas.width = containerWidth * zoom;

    // Compute new center (before resizing)
    let newCenter: number;
    if (zoomOrigin) {
      // x-coordinate has been given, center on it
      const bounds = canvas.getBoundingClientRect();
      newCenter = (zoomOrigin.x - bounds.left) * zoom / _zoom;
      const coords = {
        clientX: zoomOrigin.x,
        clientY: zoomOrigin.y
      }
      if (pointerService.isHoverCanvas(coords)) {
        const data = pointerService.getFreqTime(coords);
        if (data) setPointerPosition(data)
      }
    } else {
      // If no x-coordinate: center on currentTime
      newCenter = currentTime.current * newTimePxRatio;
    }
    wrapper.scrollTo({ left: Math.floor(newCenter - containerWidth / 2) })
    _setZoom(zoom);
    updateDisplay(newResult)
  }, [ zoom ]);

  // On current params loaded/changed

  // On current audio time changed
  useEffect(() => {
    // Scroll if progress bar reach the right edge of the screen
    const wrapper = renderRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas || !data?.spectrogramById) return;
    const oldX: number = Math.floor(canvas.width * currentTime.current / data.spectrogramById.duration);
    const newX: number = Math.floor(canvas.width * time / data.spectrogramById.duration);

    if ((oldX - wrapper.scrollLeft) < containerWidth && (newX - wrapper.scrollLeft) >= containerWidth) {
      wrapper.scrollLeft += containerWidth;
    }
    currentTime.current = time;
  }, [ time ])

  // On current newAnnotation changed
  useEffect(() => {
    updateDisplay(newResult)
  }, [ newResult?.endTime, newResult?.endFrequency, newResult ])

  useImperativeHandle(ref, () => ({
    getCanvasData: async () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Cannot get fake canvas 2D context');

      // Get spectro images
      await updateDisplay(newResult)
      const spectroDataURL = canvasRef.current?.toDataURL('image/png');
      if (!spectroDataURL) throw new Error('Cannot recover spectro dataURL');
      updateDisplay(newResult)
      const spectroImg = new Image();

      // Get frequency scale
      if (!yAxisCanvasRef.current?.toDataURL) throw new Error('Cannot recover frequency dataURL');
      const freqDataURL = yAxisCanvasRef.current.toDataURL('image/png');
      if (!freqDataURL) throw new Error('Cannot recover frequency dataURL');
      const freqImg = new Image();

      // Get time scale
      if (!xAxisCanvasRef.current?.toDataURL) throw new Error('Cannot recover time dataURL');
      const timeDataURL = xAxisCanvasRef.current.toDataURL('image/png');
      if (!timeDataURL) throw new Error('Cannot recover time dataURL');
      const timeImg = new Image();

      // Compute global canvas
      /// Load images
      await new Promise((resolve, reject) => {
        let isSpectroLoaded = false;
        let isFreqLoaded = false;
        let isTimeLoaded = false;
        spectroImg.onerror = e => reject(e)
        freqImg.onerror = e => reject(e)
        timeImg.onerror = e => reject(e)

        spectroImg.onload = () => {
          isSpectroLoaded = true;
          if (isFreqLoaded && isTimeLoaded) resolve(true);
        }
        freqImg.onload = () => {
          isFreqLoaded = true;
          if (isSpectroLoaded && isTimeLoaded) resolve(true);
        }
        timeImg.onload = () => {
          isTimeLoaded = true;
          if (isSpectroLoaded && isFreqLoaded) resolve(true);
        }

        spectroImg.src = spectroDataURL;
        freqImg.src = freqDataURL;
        timeImg.src = timeDataURL;
      });
      canvas.height = timeImg.height + spectroImg.height;
      canvas.width = freqImg.width + spectroImg.width;

      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height)

      context.drawImage(spectroImg, Y_WIDTH, 0, spectroImg.width, spectroImg.height);
      context.drawImage(freqImg, 0, 0, freqImg.width, freqImg.height);
      context.drawImage(timeImg, Y_WIDTH, height, timeImg.width, timeImg.height);

      return canvas.toDataURL('image/png')
    },
    onResultSelected: (result: _Annotation) => {
      if (typeof result.startTime !== 'number') return;
      let time: number;
      if (typeof result.endTime !== 'number') time = result.startTime;
      else time = result.startTime + Math.abs(result.endTime - result.startTime) / 2;
      const left = xAxis.valueToPosition(time) - containerWidth / 2;
      renderRef.current?.scrollTo({ left })
    }
  }), [ width, xAxis, newResult, updateDisplay ])

  const onUpdateNewAnnotation = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const isHover = pointerService.isHoverCanvas(e)
    const data = pointerService.getFreqTime(e);
    if (data) {
      if (isHover) setPointerPosition(data)
      if (_newResult.current) {
        _newResult.current.endTime = data.time;
        _newResult.current.endFrequency = data.frequency;
      }
    }
    if (!isHover || !data) leavePointerPosition()
  }, [ pointerService, setPointerPosition, leavePointerPosition ])
  useEvent(MOUSE_MOVE_EVENT, onUpdateNewAnnotation);

  const onStartNewAnnotation = useCallback((e: MouseEvent<HTMLCanvasElement>) => {
    if (!_isDrawingEnabled.current) return;
    if (!pointerService.isHoverCanvas(e)) return;
    const data = pointerService.getFreqTime(e);
    if (!data) return;

    _newResult.current = {
      type: AnnotationType.Box,
      startTime: data.time,
      endTime: data.time,
      startFrequency: data.frequency,
      endFrequency: data.frequency,
    };
  }, [])
  useEvent(MOUSE_DOWN_EVENT, onStartNewAnnotation);

  const onEndNewAnnotation = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (phase && _newResult.current && labelRef.current) {
      const data = pointerService.getFreqTime(e);
      if (data) {
        _newResult.current.endTime = data.time;
        _newResult.current.endFrequency = data.frequency;
      }
      if (_newResult.current.type !== AnnotationType.Box) return;
      const start_time = Math.min(_newResult.current.startTime!, _newResult.current.endTime!);
      const end_time = Math.max(_newResult.current.startTime!, _newResult.current.endTime!);
      const start_frequency = Math.min(_newResult.current.startFrequency!, _newResult.current.endFrequency!);
      const end_frequency = Math.max(_newResult.current.startFrequency!, _newResult.current.endFrequency!);
      _newResult.current.startTime = start_time;
      _newResult.current.endTime = end_time;
      _newResult.current.startFrequency = start_frequency;
      _newResult.current.endFrequency = end_frequency;

      const minFreq = Math.min(_newResult.current.startFrequency, _newResult.current.endFrequency);
      const maxFreq = Math.max(_newResult.current.startFrequency, _newResult.current.endFrequency);
      if (!yAxis.isRangeContinuouslyOnScale(minFreq, maxFreq)) {
        toast.presentError(`Be careful, your annotation overlaps a void in the frequency scale.
         Are you sure your annotation goes from ${ minFreq.toFixed(0) }Hz to ${ maxFreq.toFixed(0) }Hz?`)
      }
      const width = xAxis.valuesToPositionRange(_newResult.current.startTime, _newResult.current.endTime);
      const height = yAxis.valuesToPositionRange(_newResult.current.startFrequency, _newResult.current.endFrequency);
      if (width > 2 && height > 2) {
        add({
          type: AnnotationType.Box,
          startTime: _newResult.current.startTime,
          startFrequency: _newResult.current.startFrequency,
          endTime: _newResult.current.endTime,
          endFrequency: _newResult.current.endFrequency,
          label: { name: labelRef.current },
          confidence: confidenceRef.current ? { label: confidenceRef.current } : undefined
        })
      } else if (campaign?.allow_point_annotation) {
        add({
          type: AnnotationType.Point,
          startTime: _newResult.current.startTime,
          startFrequency: _newResult.current.startFrequency,
          label: { name: labelRef.current },
          confidence: confidenceRef.current ? { label: confidenceRef.current } : undefined
        })
      }
    }
    _newResult.current = undefined;
    if (!pointerService.isHoverCanvas(e)) leavePointerPosition()
  }, [ leavePointerPosition ])
  useEvent(MOUSE_UP_EVENT, onEndNewAnnotation);

  function onClick(e: MouseEvent<HTMLCanvasElement>) {
    seek(pointerService.getFreqTime(e)?.time ?? 0)
  }

  const onWheel = useCallback((event: WheelEvent) => {
    // Disable zoom if the user wants horizontal scroll
    if (event.shiftKey) return;

    // Prevent page scrolling
    event.stopPropagation();

    const origin = pointerService.getCoords(event);

    if (!origin) return;
    if (event.deltaY < 0) zoomIn(origin)
    else if (event.deltaY > 0) zoomOut(origin)
  }, [ zoomIn, zoomOut ])

  const onContainerScrolled = useCallback((event: UIEvent<HTMLDivElement>) => {
    if (event.type !== 'scroll') return;
    const div = event.currentTarget;
    const left = div.scrollWidth - div.scrollLeft - div.clientWidth;
    if (left <= 0) markFileAsSeen()
  }, [ markFileAsSeen ])

  return (
    <div className={ styles.spectrogramRender }
         ref={ renderRef }
         onScroll={ onContainerScrolled }
         style={ { width: `${ Y_WIDTH + containerWidth }px` } }>

      <YAxis className={ styles.yAxis } ref={ yAxisCanvasRef }/>

      <div onMouseDown={ e => e.stopPropagation() }
           className={ styles.spectrogram }
           onWheel={ onWheel }
           onPointerLeave={ leavePointerPosition }>

        {/* 'drawable' class is for playwright tests */ }
        <canvas className={ (isDrawingEnabled || isAnnotationDisabled) ? `drawable ${ styles.drawable }` : '' }
                ref={ canvasRef }
                height={ height }
                width={ width }
                onMouseDown={ onStartNewAnnotation }
                onClick={ onClick }/>

        <TimeBar/>

        { annotations?.map((annotation: _Annotation, key: number) => (
          <Annotation key={ key } annotation={ annotation } audioPlayer={ audioPlayer }/>
        )) }
      </div>

      <XAxis className={ styles.xAxis } ref={ xAxisCanvasRef }/>

      <AcousticFeatures/>
    </div>)
})
