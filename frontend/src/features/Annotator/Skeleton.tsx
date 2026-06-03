import React, { Fragment, ReactNode, useCallback, useEffect } from 'react';
import { Footer, Header } from '@/components/layout';
import { Link, Progress } from '@/components/ui';
import { IonIcon, IonNote } from '@ionic/react';
import { helpBuoyOutline } from 'ionicons/icons/index.js';
import styles from './styles.module.scss';
import { IoCheckmarkCircleOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { AnnotationTaskStatus } from '@/api';
import { gqlAPI } from '@/api/baseGqlApi';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { useAnnotatorCanNavigate } from '@/features/Annotator/Navigation';
import { AnnotatorCanvasContextProvider } from '@/features/Annotator/Canvas';
import { PointerProvider } from '@/features/Annotator/Pointer/context';
import { useLoaderData, useSearch } from '@tanstack/react-router';
import { AnnotatorVisualConfigurationSlice } from '@/features/Annotator/VisualConfiguration';
import type { Colormap } from '@/features/Colormap';
import { AnnotatorConfidenceSlice } from '@/features/Annotator/Confidence';
import { AnnotatorAnalysisSlice, selectAnalysisID } from '@/features/Annotator/Analysis';
import { AnnotatorLabelSlice } from '@/features/Annotator/Label';
import { AnnotatorUXSlice } from '@/features/Annotator/UX';
import { AnnotatorCommentSlice } from '@/features/Annotator/Comment';
import { cleanGqlList } from '@/api/utils';
import { AnnotatorAnnotationSlice, convertGqlToAnnotations } from '@/features/Annotator/Annotation';

export const AnnotatorSkeleton: React.FC<{ children?: ReactNode }> = ({ children }) => {
    const search = useSearch({ strict: false });
    const { user } = useLoaderData({ from: '/_authenticated' })
    const {
        campaign,
        confidences,
        analysis,
    } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const { phase } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType' })
    const { spectrogram, annotations, info, isEditionAuthorized } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/spectrogram/$spectrogramID' })
    const analysisID = useAppSelector(selectAnalysisID)
    const canNavigate = useAnnotatorCanNavigate()
    const dispatch = useAppDispatch()

    const onBack = useCallback(() => {
        dispatch(gqlAPI.util.invalidateTags([ {
            type: 'AnnotationPhase',
            id: phase.id,
        } ]))
    }, [ phase, dispatch ])

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

        // Select default analysis when none existing is selected
        if (analysis.length && !analysis.find(a => a.id === analysisID)) {
            const baseScaleAnalysis = analysis.find(a =>
                !a.frequencyScaleParts || a.frequencyScaleParts.length == 0 ||
                (a.frequencyScaleParts.length == 1 && a.frequencyScaleParts[0]!.minValue == 0 && a.frequencyScaleParts[0]!.maxValue == a.fft.samplingFrequency / 2),
            );
            const minID = Math.min(...analysis.map(a => +a!.id))?.toString();
            if (minID) {
                dispatch(AnnotatorAnalysisSlice.actions.setAnalysis(analysis.find(a => a.id === (baseScaleAnalysis?.id ?? minID))));
            }
        }
    }, [ campaign ]);

    useEffect(() => {
        dispatch(AnnotatorVisualConfigurationSlice.actions.initSpectrogram())
        dispatch(AnnotatorUXSlice.actions.initSpectrogram())

        const allAnnotations = convertGqlToAnnotations(annotations, phase.phase, user.id)
        const defaultAnnotation = [...allAnnotations].pop()
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
            default: defaultAnnotation
        }))
    }, [ spectrogram ]);

    return <PointerProvider>
        <AnnotatorCanvasContextProvider>
            <div className={ styles.page }>
                <Header size="small"
                        canNavigate={ canNavigate }
                        buttons={ <Fragment>

                            { campaign.instructionsUrl &&
                                <Link color="medium" target="_blank"
                                      href={ campaign.instructionsUrl }>
                                    <IonIcon icon={ helpBuoyOutline }
                                             slot="start"/>
                                    Campaign instructions
                                </Link>
                            }

                            <Link color="medium" fill="outline"
                                  size="small"
                                  onClick={ onBack }
                                  to="/annotation-campaign/$campaignID/phase/$phaseType"
                                  params={ { campaignID: campaign.id, phaseType: phase.phase } }
                                  search={ search }>
                                Back to campaign
                            </Link>
                        </Fragment> }>

                    { spectrogram && <div className={ styles.info }>
                        <p>
                            { campaign.name }
                            <IoChevronForwardOutline/> { spectrogram.filename } { spectrogram.task?.status === AnnotationTaskStatus.Finished &&
                            <IoCheckmarkCircleOutline/> }
                        </p>
                        { isEditionAuthorized && info?.totalCount &&
                            <Progress label="Position"
                                      className={ styles.progress }
                                      value={ (info.currentIndex ?? 0) + 1 }
                                      total={ info.totalCount }/> }
                        { campaign.archive ? <IonNote>You cannot annotate an archived campaign.</IonNote> :
                            phase?.endedAt ? <IonNote>You cannot annotate an ended phase.</IonNote> :
                                !spectrogram.isAssigned ?
                                    <IonNote>You are not assigned to annotate this file.</IonNote> :
                                    <Fragment/>
                        }
                    </div> }

                </Header>

                { children }

                <Footer/>
            </div>
        </AnnotatorCanvasContextProvider>
    </PointerProvider>
}
