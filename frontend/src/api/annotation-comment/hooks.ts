import { AnnotationCommentGqlAPI } from './api';
import { AnnotationCommentInput } from '@/api/types.gql-generated.ts';
import { useCallback, useMemo } from 'react';
import { useNavParams } from '@/features/UX';

const {
  updateTaskComments,
} = AnnotationCommentGqlAPI.endpoints

export const useUpdateTaskComments = () => {
  const { campaignID, phaseType, spectrogramID } = useNavParams();
  const [method, info] = updateTaskComments.useMutation()

  const update = useCallback(async (comments: AnnotationCommentInput[]) => {
    if (!campaignID || !phaseType || !spectrogramID) return;
    await method({ campaignID, phase: phaseType, spectrogramID, comments }).unwrap()
  }, [method, campaignID, phaseType, spectrogramID]);

  return useMemo(() => ({
    ...info,
    updateTaskComments: update,
  }), [update, info])
}
