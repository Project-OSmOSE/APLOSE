import React, { Fragment, useCallback } from 'react';
import { AnnotationPhaseType, useCurrentCampaign } from '@/api';
import { ConfidenceSelect } from '@/features/Confidence';
import { LabelSelect } from '@/features/Labels';
import { BooleanSwitch } from '@/components/form';
import styles from './styles.module.scss';
import { Modal, type ModalProps } from '@/components/ui';
import { DetectorSelect } from '@/features/Detector';
import { UserSelect } from '@/features/User';
import { Route } from '@/routes/_authenticated/annotation-campaign/$campaignID/_detailLayout/phase.$phaseType';
import { useNavigate } from '@tanstack/react-router';


export const AnnotationsFilterModal: React.FC<ModalProps & {
    onUpdate: () => void
}> = ({ onUpdate, onClose }) => {
    const {
        withAnnotations,
        annotationLabel,
        annotationAnnotator,
        annotationDetector,
        annotationConfidence,
        withAcousticFeatures,
    } = Route.useSearch();
    const routeParams = Route.useParams()
    const navigate = useNavigate();
    const { campaign, isFetching } = useCurrentCampaign()

    const setWithAnnotations = useCallback((input?: boolean) => {
        if (input && withAnnotations) return;
        navigate({
            to: Route.to,
            params: routeParams,
            search: (prev) => ({
                ...prev,
                withAnnotations: input,
                annotationLabel: undefined,
                annotationConfidence: undefined,
                annotationDetector: undefined,
                annotationAnnotator: undefined,
                withAcousticFeatures: undefined,
                page: 1,
            }),
            replace: true,
        })
        onUpdate()
    }, [ withAnnotations, navigate, routeParams, onUpdate ])

    const setLabel = useCallback((label?: { name: string }) => {
        navigate({
            to: Route.to,
            params: routeParams,
            search: (prev) => ({
                ...prev,
                withAnnotations: true,
                annotationLabel: label?.name,
                page: 1,
            }),
            replace: true,
        })
        onUpdate()
    }, [ navigate, routeParams, onUpdate ])

    const setConfidence = useCallback((confidence?: { label: string }) => {
        navigate({
            to: Route.to,
            params: routeParams,
            search: (prev) => ({
                ...prev,
                withAnnotations: true,
                annotationConfidence: confidence?.label,
                page: 1,
            }),
            replace: true,
        })
        onUpdate()
    }, [ navigate, routeParams, onUpdate ])

    const setDetector = useCallback((detector?: { id: string }) => {
        navigate({
            to: Route.to,
            params: routeParams,
            search: (prev) => ({
                ...prev,
                withAnnotations: true,
                annotationDetector: detector?.id,
                page: 1,
            }),
            replace: true,
        })
        onUpdate()
    }, [ navigate, routeParams, onUpdate ])

    const setAnnotator = useCallback((user?: { id: string }) => {
        navigate({
            to: Route.to,
            params: routeParams,
            search: (prev) => ({
                ...prev,
                withAnnotations: true,
                annotationAnnotator: user?.id,
                page: 1,
            }),
            replace: true,
        })
        onUpdate()
    }, [ navigate, routeParams, onUpdate ])

    const setWithAcousticFeatures = useCallback((input?: boolean) => {
        navigate({
            to: Route.to,
            params: routeParams,
            search: (prev) => ({
                ...prev,
                withAnnotations: true,
                withAcousticFeatures: input,
                page: 1,
            }),
            replace: true,
        })
        onUpdate()
    }, [ navigate, routeParams, onUpdate ])

    return <Modal className={ styles.filterModal }
                  onClose={ onClose }>

        <BooleanSwitch label="Annotations"
                       value={ withAnnotations }
                       onValueSelected={ setWithAnnotations }/>

        <LabelSelect placeholder="Filter by label"
                     options={ campaign?.labelSet?.labels ?? [] }
                     valueName={ annotationLabel ?? undefined }
                     disabled={ withAnnotations !== true }
                     onSelected={ setLabel }
                     isLoading={ isFetching }/>

        { campaign?.confidenceSet && <ConfidenceSelect placeholder="Filter by confidence"
                                                       options={ campaign?.confidenceSet?.confidenceIndicators ?? [] }
                                                       valueLabel={ annotationConfidence ?? undefined }
                                                       onSelected={ setConfidence }/> }

        { routeParams.phaseType === AnnotationPhaseType.Verification && <Fragment>

            <DetectorSelect placeholder="Filter by detector"
                            options={ campaign?.detectors ?? [] }
                            valueID={ annotationDetector ?? undefined }
                            onSelected={ setDetector }
                            isLoading={ isFetching }/>

            <UserSelect label="Annotator"
                        placeholder="Filter by annotator"
                        options={ campaign?.annotators ?? [] }
                        valueID={ annotationAnnotator ?? undefined }
                        onSelected={ setAnnotator }
                        isLoading={ isFetching }/>

        </Fragment> }

        <BooleanSwitch label="Acoustic features"
                       value={ withAcousticFeatures }
                       onValueSelected={ setWithAcousticFeatures }/>

    </Modal>
}