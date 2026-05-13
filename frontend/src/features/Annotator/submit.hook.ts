import { useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui';
import { useNavigate } from '@tanstack/react-router';
import { useAnnotationTask, useSubmitTask } from '@/api';
import { useOpenAnnotator } from '@/features/Annotator/Navigation';
import { useKeyDownEvent } from '@/features/UX/Events';
import { convertAnnotationsToPost, selectAllAnnotations } from '@/features/Annotator/Annotation';
import { convertCommentsToPost, selectTaskComments } from '@/features/Annotator/Comment';
import { useAppSelector } from '@/features/App';
import { selectAllFileIsSeen, selectStart } from '@/features/Annotator/UX';
import { selectTaskIsEditionAuthorized } from '@/features/Annotator/selectors';
import {
    Route,
} from '@/routes/_authenticated/annotation-campaign/$campaignID.phase.$phaseType/spectrogram/$spectrogramID'

export const useAnnotatorSubmit = () => {
    const openAnnotator = useOpenAnnotator()
    const toast = useToast()
    const navigate = useNavigate()
    const allAnnotations = useAppSelector(selectAllAnnotations)
    const taskComments = useAppSelector(selectTaskComments)
    const { submitTask, isSuccess, error, ...info } = useSubmitTask()
    const isEditionAuthorized = useAppSelector(selectTaskIsEditionAuthorized)

    const params = Route.useParams();
    const search = Route.useSearch();
    const allFileIsSeen = useAppSelector(selectAllFileIsSeen)
    const start = useAppSelector(selectStart)
    const { navigationInfo } = useAnnotationTask()

    const submit = useCallback(async () => {
        if (!isEditionAuthorized) return;
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
    }, [ openAnnotator, toast, allAnnotations, isEditionAuthorized, submitTask, allFileIsSeen, start, taskComments ])
    useKeyDownEvent([ 'Enter', 'NumpadEnter' ], submit)

    useEffect(() => {
        if (!isSuccess) return;
        if (navigationInfo?.nextSpectrogramId) {
            openAnnotator(navigationInfo.nextSpectrogramId);
        } else {
            navigate({
                to: '/annotation-campaign/$campaignID/phase/$phaseType',
                params, search,
            })
        }
    }, [ isSuccess, navigate ]);

    useEffect(() => {
        if (error) toast.raiseError({ error })
    }, [ error ]);

    return { submit, isSuccess, error, ...info }
}