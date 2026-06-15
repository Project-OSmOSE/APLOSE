import { useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui';
import { useLoaderData, useNavigate } from '@tanstack/react-router';
import { useOpenAnnotator } from '@/features/Annotator/Navigation';
import { useKeyDownEvent } from '@/features/UX/Events';
import { AnnotationTask } from '@/features';
import { convertAnnotationsToPost, selectAllAnnotations } from '@/features/Annotator/Annotation';
import { convertCommentsToPost, selectTaskComments } from '@/features/Annotator/Comment';
import { useAppSelector } from '@/features/App';
import { selectAllFileIsSeen, selectStart } from '@/features/Annotator/UX';
import {
    Route,
} from '@/routes/_authenticated/annotation-campaign/$campaignID/phase.$phaseType/spectrogram/$spectrogramID'
import { useMutation } from '@tanstack/react-query';

export const useAnnotatorSubmit = () => {
    const {
        campaign,
    } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const {
        phase,
    } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType' })
    const {
        spectrogram,
        info,
        isEditionAuthorized,
    } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/spectrogram/$spectrogramID' })
    const openAnnotator = useOpenAnnotator()
    const toast = useToast()
    const navigate = useNavigate()
    const allAnnotations = useAppSelector(selectAllAnnotations)
    const taskComments = useAppSelector(selectTaskComments)
    const { mutate: submitTask, isSuccess, error, ...submitInfo } = useMutation(
        AnnotationTask.API.submitMutation,
    )

    const params = Route.useParams();
    const search = Route.useSearch();
    const allFileIsSeen = useAppSelector(selectAllFileIsSeen)
    const start = useAppSelector(selectStart)

    const submit = useCallback(async () => {
        if (!isEditionAuthorized) return;
        if (!allFileIsSeen) {
            const force = await toast.raiseError({
                message: 'Be careful, you haven\' see all of the file yet. Try scrolling to the end or changing the zoom level',
                canForce: true, forceText: 'Force',
            });
            if (!force) return;
        }
        submitTask({
            campaignID: campaign.id,
            spectrogramID: spectrogram.id,
            phase: phase.phase,
            annotations: convertAnnotationsToPost(allAnnotations),
            taskComments: convertCommentsToPost(taskComments),
            startedAt: start.toISOString(),
            endedAt: new Date().toISOString(),
        })
    }, [ openAnnotator, toast, allAnnotations, isEditionAuthorized, submitTask, allFileIsSeen, start, taskComments, campaign, phase, spectrogram ])
    useKeyDownEvent([ 'Enter', 'NumpadEnter' ], submit)

    useEffect(() => {
        if (!isSuccess) return;
        if (info?.nextSpectrogramId) {
            openAnnotator(info.nextSpectrogramId, { replace: true });
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

    return { submit, isSuccess, error, ...submitInfo }
}