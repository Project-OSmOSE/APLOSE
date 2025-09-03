import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/service/app";
import { Colormap, COLORMAP_GREYS } from "@/service/ui/color.ts";
import { useRetrieveCurrentCampaign } from "@/service/api/campaign.ts";
import { AnnotatorSlice, selectInput } from "../slice";
import { useAnnotatorQuery } from "./query.hook";

export const useAnnotatorInput = () => {
  const { campaign } = useRetrieveCurrentCampaign()
  const { data } = useAnnotatorQuery()
  const {
    audioSpeed,
    analysisID,
    zoom,
    zoomOrigin,
    colormap,
    invertColormap,
    contrast,
    brightness,
  } = useAppSelector(selectInput)
  const dispatch = useAppDispatch();

  // Analysis,
  const allAnalysis = useMemo(() => {
    return data?.allSpectrogramAnalysis?.results.filter(a => a !== null) ?? []
  }, [ data ])
  const analysis = useMemo(() => {
    return allAnalysis.find(a => a.id === analysisID)
  }, [ allAnalysis ])

  // Zoom
  const maxZoom = useMemo(() => {
    return analysis?.legacyConfiguration?.zoomLevel ?? 1
  }, [ analysis ])
  const zoomInLevel = useMemo(() => {
    return zoom * 2 <= 2 ** maxZoom ? zoom * 2 : undefined;
  }, [ zoom, maxZoom ])
  const zoomOutLevel = useMemo(() => {
    return zoom / 2 >= 1 ? zoom / 2 : undefined;
  }, [ zoom ])
  const zoomIn = useCallback((zoomOrigin?: { x: number; y: number }) => {
    if (zoomInLevel) {
      dispatch(AnnotatorSlice.actions.setInput({ zoom: zoomInLevel, zoomOrigin }))
    }
  }, [ zoomInLevel ])
  const zoomOut = useCallback((zoomOrigin?: { x: number; y: number }) => {
    if (zoomOutLevel) {
      dispatch(AnnotatorSlice.actions.setInput({ zoom: zoomOutLevel, zoomOrigin }))
    }
  }, [ zoomOutLevel ])

  return {
    // Audio speed
    audioSpeed,
    setAudioSpeed: useCallback((audioSpeed?: number) => {
      audioSpeed = audioSpeed ?? 1.0;
      dispatch(AnnotatorSlice.actions.setInput({ audioSpeed: audioSpeed ?? 1.0 }))
    }, []),

    // Analysis,
    analysisID, analysis, allAnalysis,
    setAnalysisID: useCallback((analysisID: string) => {
      dispatch(AnnotatorSlice.actions.setInput({
        analysisID,
        zoom: 1,
        colormap: campaign?.colormap_default ?? undefined,
        invertColormap: campaign?.colormap_inverted_default ?? false,
        brightness: 50,
        contrast: 50,
      }))
    }, [ campaign ]),

    // Zoom
    zoom, maxZoom, zoomInLevel, zoomOutLevel, zoomIn, zoomOut, zoomOrigin,

    // Colormap
    colormap, invertedColormap: invertColormap, brightness, contrast,
    usedColormap: useMemo(() => {
      if (!analysis?.colormap.name) return COLORMAP_GREYS;
      if (analysis?.colormap.name !== COLORMAP_GREYS) return analysis?.colormap.name as Colormap;
      return colormap ?? COLORMAP_GREYS;
    }, [ colormap, analysis ]),
    setColormap: useCallback((colormap: Colormap) => {
      dispatch(AnnotatorSlice.actions.setInput({
        colormap,
        invertColormap: campaign?.colormap_inverted_default ?? false,
        contrast: 50, brightness: 50
      }))
    }, [ campaign ]),
    invertColormap: useCallback(() => {
      dispatch(AnnotatorSlice.actions.setInput({ invertColormap: !invertColormap, contrast: 50, brightness: 50 }))
    }, [ invertColormap ]),
    setBrightness: useCallback((brightness: number) => {
      dispatch(AnnotatorSlice.actions.setInput({ brightness }))
    }, []),
    setContrast: useCallback((contrast: number) => {
      dispatch(AnnotatorSlice.actions.setInput({ contrast }))
    }, []),
  }
}