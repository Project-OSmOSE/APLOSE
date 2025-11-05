import { AnnotationRestAPI } from './api';
import { useCallback, useMemo } from 'react';
import { type AploseNavParams } from '@/features/UX';
import { ImportAnnotation } from './types';
import { gqlAPI } from '@/api/baseGqlApi.ts';
import { useAppDispatch } from '@/features/App';
import { useParams } from 'react-router-dom';

const {
  importAnnotations,
} = AnnotationRestAPI.endpoints


export const useImportAnnotations = () => {
  const { campaignID } = useParams<AploseNavParams>();
  const [ method, info ] = importAnnotations.useMutation()
  const dispatch = useAppDispatch()

  const importData = useCallback(async (annotations: ImportAnnotation[]) => {
    if (!campaignID) return;
    dispatch(gqlAPI.util.invalidateTags([ {
      type: 'AnnotationTask',
    } ]))
    await method({ campaignID, annotations }).unwrap()
  }, [ method, campaignID ]);

  return useMemo(() => ({
    ...info,
    importAnnotations: importData,
  }), [ importData, info ])
}
