import React, { Fragment, ReactNode, useEffect } from 'react';
import { Footer, Navigation } from '@/components/layout';
import styles from './styles.module.scss';
import { IoCheckmarkCircleOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { AnnotationTaskStatus } from '@/api';
import { useAppDispatch } from '@/features/App';
import { AnnotatorCanvasContextProvider } from '@/features/Annotator/Canvas';
import { PointerProvider } from '@/features/Annotator/Pointer/context';
import { useLoaderData } from '@tanstack/react-router';
import { AnnotatorVisualConfigurationSlice } from '@/features/Annotator/VisualConfiguration';
import type { Colormap } from '@/features/Colormap';
import { AnnotatorConfidenceSlice } from '@/features/Annotator/Confidence';
import { AnnotatorAnalysisSlice } from '@/features/Annotator/Analysis';
import { AnnotatorLabelSlice } from '@/features/Annotator/Label';
import { AnnotatorUXSlice } from '@/features/Annotator/UX';
import { AnnotatorCommentSlice } from '@/features/Annotator/Comment';
import { cleanGqlList } from '@/api/utils';
import { AnnotatorAnnotationSlice, convertGqlToAnnotations } from '@/features/Annotator/Annotation';
import { Note, Progress } from '@/components/base';

export const AnnotatorSkeleton: React.FC<{ children?: ReactNode }> = ({ children }) => {
    const { user } = useLoaderData({ from: '/_authenticated' })
    const {
        campaign,
        confidences,
    } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const { phase } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType' })
    const {
        spectrogram,
        annotations,
        info,
        isEditionAuthorized,
        defaultAnalysis,
    } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/spectrogram/$spectrogramID' })
    //TODO!!
    // const canNavigate = useAnnotatorCanNavigate()
    // const isUpdated = useAppSelector(selectUpdated);
    // const { } = useBlocker({
    //     withResolver: true,
    //     shouldBlockFn: ({current, next}) => {
    //
    //     }
    // })
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(AnnotatorVisualConfigurationSlice.actions.initCampaign({
            campaignDefaultColormap: campaign.colormapDefault as Colormap | undefined,
            campaignDefaultReversedColormap: campaign.colormapInvertedDefault ?? undefined,
            allowConfiguration: campaign.allowColormapTuning,
        }))
        dispatch(AnnotatorUXSlice.actions.initCampaign())
        dispatch(AnnotatorAnnotationSlice.actions.initCampaign())
        dispatch(AnnotatorConfidenceSlice.actions.initCampaign({
            default: confidences?.find(c => c?.isDefault) ?? confidences.length ? confidences[0].label : undefined,
        }))
        dispatch(AnnotatorLabelSlice.actions.initCampaign())
    }, [ campaign ]);

    useEffect(() => {
        dispatch(AnnotatorVisualConfigurationSlice.actions.initSpectrogram())
        dispatch(AnnotatorUXSlice.actions.initSpectrogram())

        const allAnnotations = convertGqlToAnnotations(annotations, phase.phase, user.id)
        const defaultAnnotation = [ ...allAnnotations ].pop()
        dispatch(AnnotatorConfidenceSlice.actions.initSpectrogram({
            focus: defaultAnnotation?.confidence ?? undefined,
        }))
        dispatch(AnnotatorLabelSlice.actions.initSpectrogram({
            focus: defaultAnnotation?.label ?? undefined,
        }))
        dispatch(AnnotatorCommentSlice.actions.initSpectrogram({
            taskComments: cleanGqlList(spectrogram.task?.userComments?.results),
        }))
        dispatch(AnnotatorAnnotationSlice.actions.initSpectrogram({
            all: allAnnotations,
            default: defaultAnnotation,
        }))
    }, [ spectrogram ]);

    useEffect(() => {
        dispatch(AnnotatorAnalysisSlice.actions.setAnalysis(defaultAnalysis));
    }, [ defaultAnalysis ]);

    return <PointerProvider>
        <AnnotatorCanvasContextProvider>
            <div className={ styles.page }>
                <Navigation.Annotator>
                    <div className={ styles.info }>
                        <Note color="medium">
                            { campaign.name }
                            <IoChevronForwardOutline/> { spectrogram.filename } { spectrogram.task?.status === AnnotationTaskStatus.Finished &&
                            <IoCheckmarkCircleOutline/> }
                        </Note>
                        { isEditionAuthorized && info?.totalCount &&
                            <Progress color="medium"
                                      value={ (info.currentIndex ?? 0) + 1 }
                                      max={ info.totalCount }/> }

                        { campaign.archive ? <Note>You cannot annotate an archived campaign.</Note> :
                            phase?.endedAt ? <Note>You cannot annotate an ended phase.</Note> :
                                !spectrogram.isAssigned ?
                                    <Note>You are not assigned to annotate this file.</Note> :
                                    <Fragment/>
                        }
                    </div>
                </Navigation.Annotator>

                { children }

                <Footer/>
            </div>
        </AnnotatorCanvasContextProvider>
    </PointerProvider>
}
