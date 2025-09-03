import { useCallback, useMemo } from "react";
import { ConfidenceNode } from "@/features/gql/types.generated.ts";
import { useAppDispatch, useAppSelector } from "@/service/app.ts";
import { AnnotatorSlice, selectConfidenceChoice } from "../slice.ts";
import { useAnnotatorQuery } from "./query.hook";
import { useAnnotatorAnnotations } from "./annotations.hook";

export const useAnnotatorConfidence = () => {
  const { data } = useAnnotatorQuery()
  const { annotation, update } = useAnnotatorAnnotations();
  const _selected = useAppSelector(selectConfidenceChoice)
  const selected = useMemo(() => {
    return _selected ?? data?.annotationCampaignConfidenceSet?.confidenceIndicators?.results.find(c => c?.isDefault)?.label
  }, [ _selected ])
  const dispatch = useAppDispatch();

  const select = useCallback((confidence: Pick<ConfidenceNode, 'label'>) => {
    dispatch(AnnotatorSlice.actions.setInput({ confidenceLabel: confidence.label }))
    if (annotation) update(annotation, { confidence })
  }, [ annotation, update ])

  return { selected, select }
}