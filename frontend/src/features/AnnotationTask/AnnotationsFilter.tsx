import React, { Fragment, useCallback } from 'react';
import { AnnotationPhaseType, useAllTasksFilters, useCurrentCampaign } from '@/api';
import { ConfidenceSelect } from '@/features/Confidence';
import { LabelSelect } from '@/features/Labels';
import { BooleanSwitch } from '@/components/form';
import styles from './styles.module.scss';
import { Modal, type ModalProps } from '@/components/ui';
import { DetectorSelect } from '@/features/Detector';
import { UserSelect } from '@/features/User';
import { type AploseNavParams } from '@/features/UX';
import { useParams } from 'react-router-dom';


export const AnnotationsFilterModal: React.FC<ModalProps & {
    onUpdate: () => void
}> = ({ onUpdate, onClose }) => {
    const { phaseType } = useParams<AploseNavParams>();
    const { campaign, isFetching } = useCurrentCampaign()
    const { params, updateParams } = useAllTasksFilters()

    const setWithAnnotations = useCallback((withAnnotations?: boolean) => {
        if (withAnnotations && params.withAnnotations) return;
        updateParams({
            withAnnotations,
            annotationLabel: undefined,
            annotationConfidence: undefined,
            annotationDetector: undefined,
            annotationAnnotator: undefined,
            withAcousticFeatures: undefined,
        })
        onUpdate()
    }, [ params, updateParams, onUpdate ])

    const setLabel = useCallback((label?: { name: string }) => {
        updateParams({
            withAnnotations: true,
            annotationLabel: label?.name,
        })
        onUpdate()
    }, [ updateParams , onUpdate])

    const setConfidence = useCallback((confidence?: { label: string }) => {
        updateParams({
            withAnnotations: true,
            annotationConfidence: confidence?.label,
        })
        onUpdate()
    }, [ updateParams, onUpdate ])

    const setDetector = useCallback((detector?: { id: string }) => {
        updateParams({
            withAnnotations: true,
            annotationDetector: detector?.id,
        })
        onUpdate()
    }, [ updateParams, onUpdate ])

    const setAnnotator = useCallback((user?: { id: string }) => {
        updateParams({
            withAnnotations: true,
            annotationAnnotator: user?.id,
        })
        onUpdate()
    }, [ updateParams, onUpdate ])

    const setWithAcousticFeatures = useCallback((withAcousticFeatures?: boolean) => {
        updateParams({
            withAnnotations: true,
            withAcousticFeatures,
        })
        onUpdate()
    }, [ updateParams, onUpdate ])

    return <Modal className={ styles.filterModal }
                  onClose={ onClose }>

        <BooleanSwitch label="Annotations"
                       value={ params.withAnnotations }
                       onValueSelected={ setWithAnnotations }/>

        <LabelSelect placeholder="Filter by label"
                     options={ campaign?.labelSet?.labels ?? [] }
                     valueName={ params.annotationLabel ?? undefined }
                     disabled={ params.withAnnotations !== true }
                     onSelected={ setLabel }
                     isLoading={ isFetching }/>

        { campaign?.confidenceSet && <ConfidenceSelect placeholder="Filter by confidence"
                                                       options={ campaign?.confidenceSet?.confidenceIndicators ?? [] }
                                                       valueLabel={ params.annotationConfidence ?? undefined }
                                                       onSelected={ setConfidence }/> }

        { phaseType === AnnotationPhaseType.Verification && <Fragment>

            <DetectorSelect placeholder="Filter by detector"
                            options={ campaign?.detectors ?? [] }
                            valueID={ params.annotationDetector ?? undefined }
                            onSelected={ setDetector }
                            isLoading={ isFetching }/>

            <UserSelect label="Annotator"
                        placeholder="Filter by annotator"
                        options={ campaign?.annotators ?? [] }
                        valueID={ params.annotationAnnotator ?? undefined }
                        onSelected={ setAnnotator }
                        isLoading={ isFetching }/>

        </Fragment> }

        <BooleanSwitch label="Acoustic features"
                       value={ params.withAcousticFeatures }
                       onValueSelected={ setWithAcousticFeatures }/>

    </Modal>
}