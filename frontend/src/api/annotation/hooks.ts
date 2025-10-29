import { AnnotationGqlAPI, AnnotationRestAPI } from './api';
import { AnnotationInput } from '@/api/types.gql-generated.ts';
import { useCallback, useMemo } from 'react';
import { useNavParams } from '@/features/UX';
import { ImportAnnotation } from "./types";

const {
  updateAnnotations,
} = AnnotationGqlAPI.endpoints

const {
  importAnnotations,
} = AnnotationRestAPI.endpoints

export const useUpdateAnnotations = () => {
  const { campaignID, phaseType, spectrogramID } = useNavParams();
  const [ method, info ] = updateAnnotations.useMutation()

  const update = useCallback(async (annotations: AnnotationInput[]) => {
    if (!campaignID || !phaseType || !spectrogramID) return;
    await method({ campaignID, phase: phaseType, spectrogramID, annotations }).unwrap()
  }, [ method, campaignID, phaseType, spectrogramID ]);

  return useMemo(() => ({
    ...info,
    updateAnnotations: update,
  }), [ update, info ])
}

export const useImportAnnotations = () => {
  const { campaignID } = useNavParams();
  const [ method, info ] = importAnnotations.useMutation()

  const update = useCallback(async (annotations: ImportAnnotation[]) => {
    if (!campaignID) return;
    await method({ campaignID, annotations }).unwrap()
  }, [ method, campaignID ]);

  return useMemo(() => ({
    ...info,
    importAnnotations: update,
  }), [ update, info ])
}
