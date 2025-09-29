import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/service/app";
import { AnnotatorSlice, selectUI } from "../slice";
import { AnnotationLabelNode } from "@/features/_utils_/gql/types.generated.ts";

export const useAnnotatorUI = () => {
  const {
    hiddenLabels,
    hasChanged,
    pointerPosition,
    isAnnotationDisabled,
    didSeeAllFile,
  } = useAppSelector(selectUI)
  const dispatch = useAppDispatch();

  // Has changed
  const markFileAsSeen = useCallback(() => {
    dispatch(AnnotatorSlice.actions.setUI({ didSeeAllFile: true }))
  }, [])

  // Hidden labels
  const showLabels = useCallback((labels: Pick<AnnotationLabelNode, 'name'>[]) => {
    dispatch(AnnotatorSlice.actions.setUI({ hiddenLabels: hiddenLabels.filter(l => !labels.find(s => s.name === l)) }))
  }, [ hiddenLabels ])
  const hideLabels = useCallback((labels: Pick<AnnotationLabelNode, 'name'>[]) => {
    dispatch(AnnotatorSlice.actions.setUI({ hiddenLabels: [ ...hiddenLabels, ...labels.map(l => l.name) ] }))
  }, [ hiddenLabels ])

  // Pointer position
  const setPointerPosition = useCallback((pointerPosition: { time: number, frequency: number }) => {
    dispatch(AnnotatorSlice.actions.setUI({ pointerPosition }))
  }, [])
  const leavePointerPosition = useCallback(() => {
    dispatch(AnnotatorSlice.actions.setUI({ pointerPosition: undefined }))
  }, [])

  // Is annotation disabled
  const enableAnnotation = useCallback(() => {
    dispatch(AnnotatorSlice.actions.setUI({ isAnnotationDisabled: false }))
  }, [])
  const disableAnnotation = useCallback(() => {
    dispatch(AnnotatorSlice.actions.setUI({ isAnnotationDisabled: true }))
  }, [])

  return {
    // Has changed
    hasChanged, didSeeAllFile, markFileAsSeen,

    // Hidden labels
    hiddenLabels, showLabels, hideLabels,

    // Pointer position
    pointerPosition, setPointerPosition, leavePointerPosition,

    // Is annotation disabled
    isAnnotationDisabled, enableAnnotation, disableAnnotation,
  }
}