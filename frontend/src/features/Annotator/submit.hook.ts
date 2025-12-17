import { useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui';
import { useNavigate, useParams } from 'react-router-dom';
import { useAnnotationTask, useSubmitTask } from '@/api';
import { useOpenAnnotator } from '@/features/Annotator/Navigation';
import { useKeyDownEvent } from '@/features/UX/Events';
import { convertAnnotationsToPost, selectAllAnnotations } from '@/features/Annotator/Annotation';
import { convertCommentsToPost, selectTaskComments } from '@/features/Annotator/Comment';
import { type AploseNavParams } from '@/features/UX';
import { useAppSelector } from '@/features/App';
import { selectAllFileIsSeen, selectStart } from '@/features/Annotator/UX';

export const useAnnotatorSubmit = () => {
  const openAnnotator = useOpenAnnotator()
  const toast = useToast()
  const navigate = useNavigate();
  const allAnnotations = useAppSelector(selectAllAnnotations)
  const taskComments = useAppSelector(selectTaskComments)
  const { submitTask, isSuccess, error, ...info } = useSubmitTask()

  const { campaignID, phaseType } = useParams<AploseNavParams>();
  const allFileIsSeen = useAppSelector(selectAllFileIsSeen)
  const start = useAppSelector(selectStart)
  const { navigationInfo } = useAnnotationTask()

  const submit = useCallback(async () => {
    if (!allFileIsSeen) {
      const force = await toast.raiseError({
        message: 'Be careful, you haven\' see all of the file yet. Try scrolling to the end or changing the zoom level',
        canForce: true, forceText: 'Force',
      });
      if (!force) return;
    }
    submitTask(
      convertAnnotationsToPost(allAnnotations),
      convertCommentsToPost(taskComments),
      start,
    )
  }, [ openAnnotator, toast, navigate, allAnnotations, submitTask, allFileIsSeen, start, navigationInfo, campaignID, phaseType, taskComments ])
  useKeyDownEvent([ 'Enter', 'Tab', 'NumpadEnter' ], submit)

  useEffect(() => {
    if (!isSuccess) return;
    if (navigationInfo?.nextSpectrogramId) {
      openAnnotator(navigationInfo.nextSpectrogramId);
    } else {
      navigate(`/annotation-campaign/${ campaignID }/phase/${ phaseType }`)
    }
  }, [ isSuccess ]);

  useEffect(() => {
    if (error) toast.raiseError({ error })
  }, [ error ]);

  return { submit, isSuccess, error, ...info }
}