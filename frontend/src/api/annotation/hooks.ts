import { AnnotationRestAPI } from './api';
import { useCallback, useMemo } from 'react';
import { ImportAnnotation } from './types';
import { gqlAPI } from '@/api/baseGqlApi.ts';
import { useAppDispatch } from '@/features/App';
import { useParams } from '@tanstack/react-router';

const {
  importAnnotations,
} = AnnotationRestAPI.endpoints


export const useImportAnnotations = () => {
  const { campaignID } = useParams({ strict: false });
  const [ method, info ] = importAnnotations.useMutation()
  const dispatch = useAppDispatch()

  const importData = useCallback(async (annotations: ImportAnnotation[]) => {
    if (!campaignID) return;
    dispatch(gqlAPI.util.invalidateTags([ {
      type: 'AnnotationTask',
    } ]))
    await method({ campaignID, annotations }).unwrap()
  }, [ method, campaignID, dispatch ]);

  return useMemo(() => ({
    ...info,
    importAnnotations: importData,
  }), [ importData, info ])
}
