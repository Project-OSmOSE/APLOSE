import { useCallback, useMemo } from "react";
import { AnnotationLabelNode, AnnotationType } from "@/features/_utils_/gql/types.generated.ts";
import { useAppSelector } from "@/service/app.ts";
import { selectLabelChoice } from "../slice.ts";
import { useAnnotatorQuery } from "./query.hook";
import { useAnnotatorAnnotations } from "./annotations.hook";

export const useAnnotatorLabel = () => {
  const { data } = useAnnotatorQuery()
  const { annotations, annotation, update, focus, add } = useAnnotatorAnnotations();
  const selected = useAppSelector(selectLabelChoice)
  const labels = useMemo(() => {
    return data?.annotationCampaignLabelSet?.labels?.results.filter(l => l !== null) ?? []
  }, [ data ])
  const presenceLabelNames = useMemo(() => {
    return annotations.map(a => a.label.name)
  }, [ annotations ])

  const getWeakAnnotation = useCallback((label: Pick<AnnotationLabelNode, 'name'>) => {
    return annotations.find(a => a.type === AnnotationType.Weak && a.label.name === label.name);
  }, [ annotations, ])

  const select = useCallback((label: Pick<AnnotationLabelNode, 'name'>) => {
    if (annotation) return update(annotation, { label })
    const weak = getWeakAnnotation(label)
    if (weak) return focus(weak)
    add({ type: AnnotationType.Weak, label })
  }, [ annotation, update, getWeakAnnotation, focus ])

  return {
    labels, presenceLabelNames,
    selected, select,
    getWeakAnnotation,
  }
}