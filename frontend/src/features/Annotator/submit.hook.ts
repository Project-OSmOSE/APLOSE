import { useCallback } from 'react';
import { useToast } from '@/components/ui';
import { useNavigate, useParams } from 'react-router-dom';
import { useAnnotationTask, useSubmitTask } from '@/api';
import { useAnnotatorUX } from '@/features/Annotator/UX';
import { useOpenAnnotator } from '@/features/Annotator/Navigation';
import { useKeyDownEvent } from '@/features/UX/Events';
import { convertAnnotationsToPost, useAnnotatorAnnotation } from '@/features/Annotator/Annotation';
import { convertCommentsToPost, useAnnotatorComment } from '@/features/Annotator/Comment';
import { type AploseNavParams } from '@/features/UX';

export const useAnnotatorSubmit = () => {
  const { openAnnotator } = useOpenAnnotator()
  const toast = useToast()
  const navigate = useNavigate();
  const { allAnnotations } = useAnnotatorAnnotation()
  const { taskComments } = useAnnotatorComment()
  const { submitTask, ...info } = useSubmitTask()

  const { campaignID, phaseType } = useParams<AploseNavParams>();
  const { allFileIsSeen, start } = useAnnotatorUX()
  const { navigationInfo } = useAnnotationTask()

  const submit = useCallback(async () => {
    if (!allFileIsSeen) {
      const force = await toast.raiseError({
        message: 'Be careful, you haven\' see all of the file yet. Try scrolling to the end or changing the zoom level',
        canForce: true, forceText: 'Force',
      });
      if (!force) return;
    }
    try {
      await submitTask(
        convertAnnotationsToPost(allAnnotations),
        convertCommentsToPost(taskComments),
        start,
      )
      if (navigationInfo?.nextSpectrogramId) {
        openAnnotator(navigationInfo.nextSpectrogramId);
      } else {
        navigate(`/annotation-campaign/${ campaignID }/phase/${ phaseType }`)
      }
    } catch (error: any) {
      toast.raiseError({ error })
    }
  }, [ openAnnotator, toast, navigate, allAnnotations, submitTask, allFileIsSeen, start, navigationInfo, campaignID, phaseType, taskComments ])
  useKeyDownEvent([ 'Enter', 'Tab', 'NumpadEnter' ], submit)

  return { submit, ...info }
}