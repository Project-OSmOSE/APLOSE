import React, { Fragment, ReactNode, useEffect } from 'react';
import { Footer, Header } from '@/components/layout';
import { Progress } from '@/components/ui';
import { IonNote } from '@ionic/react';
import styles from './styles.module.scss';
import { IoCheckmarkCircleOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { AnnotationTaskStatus } from '@/api';
import { useAppDispatch } from '@/features/App';
import { useAnnotatorCanNavigate } from '@/features/Annotator/Navigation';
import { AnnotatorCanvasContextProvider } from '@/features/Annotator/Canvas';
import { PointerProvider } from '@/features/Annotator/Pointer/context';
import { useLoaderData, useSearch } from '@tanstack/react-router';
import { AnnotatorVisualConfigurationSlice } from '@/features/Annotator/VisualConfiguration';
import type { Colormap } from '@/features/Colormap';
import { AnnotatorConfidenceSlice } from '@/features/Annotator/Confidence';
import { AnnotatorAnalysisSlice } from '@/features/Annotator/Analysis';
import { AnnotatorLabelSlice } from '@/features/Annotator/Label';
import { AnnotatorUXSlice } from '@/features/Annotator/UX';
import { AnnotatorCommentSlice } from '@/features/Annotator/Comment';
import { cleanGqlList } from '@/api/utils';
import { AnnotatorAnnotationSlice, convertGqlToAnnotations } from '@/features/Annotator/Annotation';
import { ExternalLink, Link } from '@/components/base/Button';
import { Help } from '@solar-icons/react';

export const AnnotatorSkeleton: React.FC<{ children?: ReactNode }> = ({ children }) => {
    const search = useSearch({ strict: false });
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
    const canNavigate = useAnnotatorCanNavigate()
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
                <Header size="small"
                        canNavigate={ canNavigate }
                        buttons={ <Fragment>

                            { campaign.instructionsUrl &&
                                <ExternalLink target="_blank" href={ campaign.instructionsUrl }>
                                    <Help weight="Linear" size={ 20 }/>
                                    Campaign instructions
                                </ExternalLink>
                            }

                            <Link to="/annotation-campaign/$campaignID/phase/$phaseType"
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
