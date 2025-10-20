import { AnnotationCommentRestAPI } from './api';
import { type PostAnnotationComment } from '@/api';
import { useCallback, useMemo } from 'react';
import { useNavParams } from '@/features/UX';

const {
  updateTaskComments,
} = AnnotationCommentRestAPI.endpoints

export const useUpdateTaskComments = () => {
  const { campaignID, phaseType, spectrogramID } = useNavParams();
  const [ method, info ] = updateTaskComments.useMutation()

  const update = useCallback(async (comments: PostAnnotationComment[]) => {
    if (!campaignID || !phaseType || !spectrogramID) return;
    await method({ campaignID, phaseType, spectrogramID, comments }).unwrap()
  }, [ method, campaignID, phaseType, spectrogramID ]);

  return useMemo(() => ({
    ...info,
    updateTaskComments: update,
  }), [ update, info ])
}
