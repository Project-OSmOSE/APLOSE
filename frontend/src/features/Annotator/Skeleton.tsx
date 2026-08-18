import React, { Fragment, ReactNode, useEffect } from 'react';
import { Footer, Navigation } from '@/components/layout';
import styles from './styles.module.scss';
import { AnnotationTaskStatus } from '@/api';
import { useAppDispatch } from '@/features/App';
import { AnnotatorCanvasContextProvider } from '@/features/Annotator/Canvas';
import { PointerProvider } from '@/features/Annotator/Pointer/context';
import { useLoaderData, useParams, useSearch } from '@tanstack/react-router';
import { AnnotatorConfidenceSlice } from '@/features/Annotator/Confidence';
import { AnnotatorAnalysisProvider } from '@/features/Annotator/Analysis';
import { AnnotatorLabelSlice } from '@/features/Annotator/Label';
import { AnnotatorUXSlice } from '@/features/Annotator/UX';
import { AnnotatorCommentSlice } from '@/features/Annotator/Comment';
import { cleanGqlList } from '@/api/utils';
import { AnnotatorAnnotationSlice, convertGqlToAnnotations } from '@/features/Annotator/Annotation';
import { Note, Progress } from '@/components/base';
import { AltArrowRight, CheckCircle } from '@solar-icons/react';
import { useQuery } from '@tanstack/react-query';
import { AnnotationSpectrogramAPI } from '@/features/AnnotationSpectrogram';

export const AnnotatorSkeleton: React.FC<{ children?: ReactNode }> = ({ children }) => {
    const { user } = useLoaderData({ from: '/_authenticated' })
    const {
        campaign,
        confidences,
    } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const { phase } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType' })
    const {
        info,
        isEditionAuthorized,
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
    const {
        campaignID,
        phaseType,
        spectrogramID,
    } = useParams({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/spectrogram/$spectrogramID' })
    const search = useSearch({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/spectrogram/$spectrogramID' })
    const { data, isFetching } = useQuery(AnnotationSpectrogramAPI.getQuery({
        campaignID, phaseType, spectrogramID, ...search, annotatorID: user.id,
    }))
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(AnnotatorUXSlice.actions.initCampaign())
        dispatch(AnnotatorAnnotationSlice.actions.initCampaign())
        dispatch(AnnotatorConfidenceSlice.actions.initCampaign({
            default: confidences?.find(c => c?.isDefault) ?? confidences.length ? confidences[0].label : undefined,
        }))
        dispatch(AnnotatorLabelSlice.actions.initCampaign())
    }, [ campaign ]);

    useEffect(() => {
        if (!data) return
        dispatch(AnnotatorUXSlice.actions.initSpectrogram())

        const allAnnotations = convertGqlToAnnotations(data.annotations, phase.phase, user.id)
        const defaultAnnotation = [ ...allAnnotations ].pop()
        dispatch(AnnotatorConfidenceSlice.actions.initSpectrogram({
            focus: defaultAnnotation?.confidence ?? undefined,
        }))
        dispatch(AnnotatorLabelSlice.actions.initSpectrogram({
            focus: defaultAnnotation?.label ?? undefined,
        }))
        dispatch(AnnotatorCommentSlice.actions.initSpectrogram({
            taskComments: cleanGqlList(data.spectrogram?.task?.userComments?.results),
        }))
        dispatch(AnnotatorAnnotationSlice.actions.initSpectrogram({
            all: allAnnotations,
            default: defaultAnnotation,
        }))
    }, [ data ]);

    return <PointerProvider>
        <AnnotatorCanvasContextProvider>
            <AnnotatorAnalysisProvider>
                <div className={ styles.page }>
                    <Navigation.Annotator loading={ isFetching }>
                        { data?.spectrogram && <div className={ styles.info }>
                            <div className={styles.file}>
                                <Note color="medium">{ campaign.name }</Note>
                                <Note color="medium"><AltArrowRight weight="Linear" size={ 20 }/></Note>
                                <Note color="medium">{ data.spectrogram.filename }</Note>
                                { data.spectrogram.task?.status === AnnotationTaskStatus.Finished &&
                                    <Note color="medium"><CheckCircle weight="Linear" size={ 20 }/></Note> }
                            </div>
                            { isEditionAuthorized && info?.totalCount &&
                                <Progress color="medium"
                                          value={ (info.currentIndex ?? 0) + 1 }
                                          max={ info.totalCount }/> }

                            { campaign.archive ? <Note>You cannot annotate an archived campaign.</Note> :
                                phase?.endedAt ? <Note>You cannot annotate an ended phase.</Note> :
                                    !data.spectrogram.isAssigned ?
                                        <Note>You are not assigned to annotate this file.</Note> :
                                        <Fragment/>
                            }
                        </div> }
                    </Navigation.Annotator>

                    { children }

                    <Footer/>
                </div>
            </AnnotatorAnalysisProvider>
        </AnnotatorCanvasContextProvider>
    </PointerProvider>
}
