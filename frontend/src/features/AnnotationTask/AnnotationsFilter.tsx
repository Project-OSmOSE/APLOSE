import React, { Fragment, useCallback } from 'react';
import { AnnotationPhaseType, useAllTasksFilters, useCurrentCampaign } from '@/api';
import { ConfidenceSelect } from '@/features/Confidence';
import { LabelSelect } from '@/features/Labels';
import { BooleanSwitch } from '@/components/form';
import { IonIcon } from '@ionic/react';
import { funnel, funnelOutline } from 'ionicons/icons/index.js';
import { createPortal } from 'react-dom';
import styles from './styles.module.scss';
import { Modal, useModal } from '@/components/ui';
import { DetectorSelect } from '@/features/Detector';
import { UserSelect } from '@/features/User';
import { useNavParams } from '@/features/UX';

export const AnnotationsFilter: React.FC<{
  onUpdate: () => void
}> = ({ onUpdate }) => {
  const { phaseType } = useNavParams();
  const { campaign, isFetching } = useCurrentCampaign()
  const { params, updateParams } = useAllTasksFilters()
  const modal = useModal()

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
  }, [ params, updateParams ])

  const setLabel = useCallback((label?: { name: string }) => {
    updateParams({
      withAnnotations: true,
      annotationLabel: label?.name,
    })
    onUpdate()
  }, [ updateParams ])

  const setConfidence = useCallback((confidence?: { label: string }) => {
    updateParams({
      withAnnotations: true,
      annotationConfidence: confidence?.label,
    })
    onUpdate()
  }, [ updateParams ])

  const setDetector = useCallback((detector?: { id: string }) => {
    updateParams({
      withAnnotations: true,
      annotationDetector: detector?.id,
    })
    onUpdate()
  }, [ updateParams ])

  const setAnnotator = useCallback((user?: { id: string }) => {
    updateParams({
      withAnnotations: true,
      annotationAnnotator: user?.id,
    })
    onUpdate()
  }, [ updateParams ])

  const setWithAcousticFeatures = useCallback((withAcousticFeatures?: boolean) => {
    updateParams({
      withAnnotations: true,
      withAcousticFeatures,
    })
    onUpdate()
  }, [ updateParams ])

  return <Fragment>
    { params.withAnnotations ?
      <IonIcon onClick={ modal.open } color="primary" icon={ funnel }/> :
      <IonIcon onClick={ modal.open } color="dark" icon={ funnelOutline }/> }

    { modal.isOpen && createPortal(<Modal className={ styles.filterModal }
                                          onClose={ modal.close }>

      <BooleanSwitch label="Annotations"
                     value={ params.withAnnotations }
                     onValueSelected={ setWithAnnotations }/>

      <LabelSelect placeholder="Filter by label"
                   options={ campaign?.labelSet?.labels ?? [] }
                   valueName={ params.annotationLabel ?? undefined }
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

    </Modal>, document.body) }

  </Fragment>
}