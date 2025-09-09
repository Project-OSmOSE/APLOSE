import React, { Fragment, useCallback, useMemo, useState } from "react";
import styles from './styles.module.scss'
import { IonIcon } from "@ionic/react";
import { funnel, funnelOutline } from "ionicons/icons";
import { createPortal } from "react-dom";
import { Modal } from "@/components/ui";
import { Select, Switch } from "@/components/form";
import { AnnotationAPI, PhaseType } from "@/features/gql/api";
import { useParams } from "react-router-dom";
import { useSpectrogramFilters } from "./filter.ts";
import { AnnotationPhaseType } from "@/features/gql/types.generated.ts";

const BOOLEAN_OPTIONS = [ 'Unset', 'With', 'Without' ]
type BooleanOption = typeof BOOLEAN_OPTIONS[number];

const useAnnotationSettings = () => {
  const {
    campaignID,
    phaseType
  } = useParams<{ campaignID: string; phaseType: AnnotationPhaseType }>();
  return AnnotationAPI.endpoints.getAnnotationSettings.useQuery({
    campaignID: campaignID ?? '',
    phaseType: phaseType ?? AnnotationPhaseType.Annotation,
  }, {
    skip: !phaseType || !campaignID
  })
}

export const AnnotationsFilter: React.FC<{
  onUpdate: () => void
}> = ({ onUpdate }) => {
  const { params, updateParams } = useSpectrogramFilters()

  const [ filterModalOpen, setFilterModalOpen ] = useState<boolean>(false);

  const booleanOptionToValue = useCallback((option: BooleanOption): boolean | undefined => {
    switch (option) {
      case 'With':
        return true;
      case 'Without':
        return false;
      case 'Unset':
        return undefined;
    }
  }, [])

  const valueToBooleanOption = useCallback((value?: boolean | null): BooleanOption => {
    switch (value) {
      case true:
        return 'With';
      case false:
        return 'Without';
      default:
        return 'Unset';
    }
  }, [])

  const setHasAnnotations = useCallback((option: BooleanOption) => {
    const hasAnnotations = booleanOptionToValue(option);
    if (hasAnnotations && params.hasAnnotations) return;
    updateParams({
      hasAnnotations,
      annotatedWithConfidence: undefined,
      annotatedWithLabel: undefined,
      annotatedByDetectorID: undefined,
      annotatedByAnnotatorID: undefined,
      annotatedWithFeatures: undefined,
    })
    onUpdate()
  }, [ params, updateParams ])

  const setAcousticFeatures = useCallback((option: BooleanOption) => {
    updateParams({
      hasAnnotations: true,
      annotatedWithFeatures: booleanOptionToValue(option),
    })
    onUpdate()
  }, [ updateParams ])

  return <Fragment>
    { params.hasAnnotations ?
      <IonIcon onClick={ () => setFilterModalOpen(true) } color='primary' icon={ funnel }/> :
      <IonIcon onClick={ () => setFilterModalOpen(true) } color='dark' icon={ funnelOutline }/> }

    { filterModalOpen && createPortal(<Modal className={ styles.filterModal }
                                             onClose={ () => setFilterModalOpen(false) }>

      <Switch label='Annotations' options={ BOOLEAN_OPTIONS }
              value={ valueToBooleanOption(params.hasAnnotations) }
              onValueSelected={ setHasAnnotations }/>

      <LabelSelect onUpdate={ onUpdate }/>
      <ConfidenceSelect onUpdate={ onUpdate }/>
      <DetectorSelect onUpdate={ onUpdate }/>
      <AnnotatorSelect onUpdate={ onUpdate }/>

      <Switch label='Acoustic features' options={ BOOLEAN_OPTIONS }
              value={ valueToBooleanOption(params.annotatedWithFeatures) }
              onValueSelected={ setAcousticFeatures }/>

    </Modal>, document.body) }
  </Fragment>
}

const LabelSelect: React.FC<{
  onUpdate: () => void
}> = ({ onUpdate }) => {
  const { data } = useAnnotationSettings()
  const labelSet = useMemo(() => data?.annotationPhaseForCampaign?.annotationCampaign.labelSet, [ data ])
  const labelItems = useMemo(() => labelSet?.labels?.results.filter(l => l !== null).map(l => ({
    label: l.name,
    value: l.name
  })) ?? [], [ labelSet ])
  const { params, updateParams } = useSpectrogramFilters()

  const setLabel = useCallback((label: number | string | undefined) => {
    updateParams({
      hasAnnotations: true,
      annotatedWithLabel: typeof label === 'number' ? label.toString() : label,
    })
    onUpdate()
  }, [ updateParams ])

  if (!labelSet) return <Fragment/>
  return <Select label='Label' placeholder='Filter by label' optionsContainer='popover'
                 options={ labelItems }
                 value={ params.annotatedWithLabel ?? undefined }
                 onValueSelected={ setLabel }/>
}

const ConfidenceSelect: React.FC<{
  onUpdate: () => void
}> = ({ onUpdate }) => {
  const { data } = useAnnotationSettings()
  const confidenceSet = useMemo(() => data?.annotationPhaseForCampaign?.annotationCampaign.confidenceSet, [ data ])
  const confidenceItems = useMemo(() => confidenceSet?.confidenceIndicators?.results.filter(i => i !== null).map(i => ({
    label: i.label,
    value: i.label
  })) ?? [], [ confidenceSet ])
  const { params, updateParams } = useSpectrogramFilters()

  const setConfidence = useCallback((label: number | string | undefined) => {
    updateParams({
      hasAnnotations: true,
      annotatedWithConfidence: typeof label === 'number' ? label.toString() : label,
    })
    onUpdate()
  }, [ updateParams ])


  if (!confidenceSet?.confidenceIndicators) return <Fragment/>
  return <Select label='Confidence' placeholder='Filter by confidence' optionsContainer='popover'
                 options={ confidenceItems }
                 value={ params.annotatedWithConfidence ?? undefined }
                 onValueSelected={ setConfidence }/>
}

const DetectorSelect: React.FC<{
  onUpdate: () => void
}> = ({ onUpdate }) => {
  const {
    phaseType
  } = useParams<{ campaignID: string; phaseType: PhaseType }>();
  const { data } = useAnnotationSettings()
  const detectors = useMemo(() => data?.annotationPhaseForCampaign?.annotationCampaign.detectors?.results, [ data ])
  const detectorItems = useMemo(() => detectors?.filter(d => d !== null).map(d => ({
    label: d.name,
    value: d.pk
  })) ?? [], [ detectors ])
  const { params, updateParams } = useSpectrogramFilters()

  const setDetector = useCallback((value: number | string | undefined) => {
    updateParams({
      hasAnnotations: true,
      annotatedByDetectorID: typeof value === 'number' ? value.toString() : value,
    })
    onUpdate()
  }, [ updateParams ])


  if (phaseType !== PhaseType.verification || !detectors || detectors.length === 0) return <Fragment/>
  return <Select label='Detectors' placeholder='Filter by detector' optionsContainer='popover'
                 options={ detectorItems }
                 value={ params.annotatedByDetectorID ?? undefined }
                 onValueSelected={ setDetector }/>
}

const AnnotatorSelect: React.FC<{
  onUpdate: () => void
}> = ({ onUpdate }) => {
  const {
    phaseType
  } = useParams<{ campaignID: string; phaseType: PhaseType }>();
  const { data } = useAnnotationSettings()
  const annotators = useMemo(() => data?.annotationPhaseForCampaign?.annotationCampaign.annotators?.results, [ data ])
  const annotatorItems = useMemo(() => annotators?.filter(a => a !== null).map(a => ({
    label: a.displayName ?? a.username,
    value: a.pk
  })) ?? [], [ annotators ])
  const { params, updateParams } = useSpectrogramFilters()

  const setAnnotator = useCallback((value: number | string | undefined) => {
    updateParams({
      hasAnnotations: true,
      annotatedByAnnotatorID: typeof value === 'number' ? value.toString() : value,
    })
    onUpdate()
  }, [ updateParams ])


  if (phaseType !== PhaseType.verification || !annotators || annotators.length === 0) return <Fragment/>
  return <Select label='Annotators' placeholder='Filter by annotator' optionsContainer='popover'
                 options={ annotatorItems }
                 value={ params.annotatedByAnnotatorID ?? undefined }
                 onValueSelected={ setAnnotator }/>
}
