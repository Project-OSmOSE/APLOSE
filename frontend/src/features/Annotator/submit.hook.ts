import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useToast } from '@/components/ui';
import { useNavigate } from 'react-router-dom';
import { AnnotationPhaseType, useAnnotationTask, useSubmitTask } from '@/api';
import { useAnnotatorUX } from '@/features/Annotator/UX';
import { useOpenAnnotator } from '@/features/Annotator/Navigation';
import { KEY_DOWN_EVENT, useEvent } from '@/features/UX/Events';
import { convertAnnotationsToPost, useAnnotatorAnnotationPost } from '@/features/Annotator/Annotation';
import { convertCommentsToPost, useAnnotatorTaskCommentsPost } from '@/features/Annotator/Comment';
import { useNavParams } from '@/features/UX';

export const useAnnotatorSubmit = () => {
  const { openAnnotator } = useOpenAnnotator()
  const toast = useToast()
  const navigate = useNavigate();
  const {
    postAnnotations,
    allAnnotationsRef,
    ...postAnnotationsInfo
  } = useAnnotatorAnnotationPost()
  const { postTaskComments, taskCommentsRef, ...postTaskCommentsInfo } = useAnnotatorTaskCommentsPost()
  const { submitTask, ...submitTaskInfo } = useSubmitTask()

  const { campaignID, phaseType } = useNavParams();
  const campaignIDRef = useRef<string | undefined>(campaignID);
  const phaseTypeRef = useRef<AnnotationPhaseType | undefined>(phaseType);
  useEffect(() => {
    campaignIDRef.current = campaignID;
    phaseTypeRef.current = phaseType;
  }, [ campaignID, phaseType ]);

  const { allFileIsSeen, start } = useAnnotatorUX()
  const allFileIsSeenRef = useRef<boolean>(allFileIsSeen);
  const startRef = useRef<Date>(start);
  useEffect(() => {
    allFileIsSeenRef.current = allFileIsSeen
    startRef.current = start
  }, [ allFileIsSeen, start ]);

  const { navigationInfo } = useAnnotationTask()
  const previousSpectrogramIdRef = useRef<string | undefined | null>(navigationInfo?.previousSpectrogramId);
  const nextSpectrogramIdRef = useRef<string | undefined | null>(navigationInfo?.nextSpectrogramId);
  useEffect(() => {
    previousSpectrogramIdRef.current = navigationInfo?.previousSpectrogramId;
    nextSpectrogramIdRef.current = navigationInfo?.nextSpectrogramId;
  }, [ navigationInfo ]);

  const submit = useCallback(async () => {
    if (!allFileIsSeenRef.current) {
      const force = await toast.raiseError({
        message: 'Be careful, you haven\' see all of the file yet. Try scrolling to the end or changing the zoom level',
        canForce: true, forceText: 'Force',
      });
      if (!force) return;
    }
    try {
      await Promise.all([
        postAnnotations(),
        postTaskComments(),
      ])
      await submitTask(
        convertAnnotationsToPost(allAnnotationsRef.current),
        convertCommentsToPost(taskCommentsRef.current),
        startRef.current,
      )
      if (nextSpectrogramIdRef.current) {
        openAnnotator(nextSpectrogramIdRef.current);
      } else {
        navigate(`/annotation-campaign/${ campaignIDRef.current }/phase/${ phaseTypeRef.current }`)
      }
    } catch (error: any) {
      toast.raiseError({ error })
    }
  }, [ openAnnotator, toast, navigate, postAnnotations, submitTask ])

  const onKbdEvent = useCallback((event: KeyboardEvent) => {
    switch (event.code) {
      case 'Enter':
      case 'Tab':
      case 'NumpadEnter':
        event.preventDefault();
        submit();
        break;
    }
  }, [ submit ])
  useEvent(KEY_DOWN_EVENT, onKbdEvent);

  return {
    submit,
    isSubmitting: useMemo(() => {
      return postAnnotationsInfo.isLoading || postTaskCommentsInfo.isLoading || submitTaskInfo.isLoading
    }, [ postAnnotationsInfo, postTaskCommentsInfo, submitTaskInfo ]),
  }
}