import React, { Fragment, useCallback, useMemo, useState } from "react";
import styles from './styles.module.scss'
import { IonIcon } from "@ionic/react";
import { funnel, funnelOutline } from "ionicons/icons";
import { createPortal } from "react-dom";
import { Modal } from "@/components/ui";
import { Select, Switch } from "@/components/form";
import { AnnotationAPI, PhaseType } from "@/features/gql/api";
import { useParams } from "react-router-dom";
import { AnnotationPhaseType, ConfidenceNode } from "@/features/_utils_/gql/types.generated.ts";
import { useSpectrogramFilters } from "@/service/slices/filter.ts";
import { LabelSelect } from '@/features/annotation'
import { useCurrentUser } from "@/features/auth/api";

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
  const { campaignID, phaseType } = useParams<{ campaignID: string; phaseType?: AnnotationPhaseType; }>();
  const { user } = useCurrentUser();
  const { params, updateParams } = useSpectrogramFilters()

  const [ filterModalOpen, setFilterModalOpen ] = useState<boolean>(false);

  const booleanOptionToValue = useCallback((option: BooleanOption, reversed?: true): boolean | undefined => {
    switch (option) {
      case 'With':
        return !reversed;
      case 'Without':
        return !!reversed;
      case 'Unset':
        return undefined;
    }
  }, [])

  const valueToBooleanOption = useCallback((value?: boolean | null, reversed?: true): BooleanOption => {
    switch (value) {
      case true:
        return reversed ? 'Without' : 'With';
      case false:
        return reversed ? 'With' : 'Without';
      default:
        return 'Unset';
    }
  }, [])

  const setHasAnnotations = useCallback((option: BooleanOption) => {
    const with_user_annotations = booleanOptionToValue(option);
    if (with_user_annotations && params.with_user_annotations) return;
    updateParams({
      with_user_annotations,
      confidence_indicator__label: undefined,
      label__name: undefined,
      detector_configuration__detector_id: undefined,
      annotator_id: undefined,
      acoustic_features__isnull: undefined
    })
    onUpdate()
  }, [ params, updateParams ])

  const setAcousticFeatures = useCallback((option: BooleanOption) => {
    updateParams({
      with_user_annotations: true,
      acoustic_features__isnull: booleanOptionToValue(option, true),
    })
    onUpdate()
  }, [ updateParams ])

  const setLabel = useCallback((label: string | undefined) => {
    updateParams({ with_user_annotations: true, label__name: label })
    onUpdate()
  }, [ updateParams ])

  return <Fragment>
    { params.with_user_annotations ?
      <IonIcon onClick={ () => setFilterModalOpen(true) } color='primary' icon={ funnel }/> :
      <IonIcon onClick={ () => setFilterModalOpen(true) } color='dark' icon={ funnelOutline }/> }

    { filterModalOpen && createPortal(<Modal className={ styles.filterModal }
                                             onClose={ () => setFilterModalOpen(false) }>

      <Switch label='Annotations' options={ BOOLEAN_OPTIONS }
              value={ valueToBooleanOption(params.with_user_annotations) }
              onValueSelected={ setHasAnnotations }/>

      <LabelSelect placeholder='Filter by label'
                   selected={ params.label__name }
                   filter={ {
                     campaignPK: campaignID,
                     // Need labels of both phases for verification phase because this phase:
                     //  - includes annotation from the "Annotation" phase
                     //  - includes annotation from all annotators of the "Annotation" phase
                     phase: phaseType === 'Annotation' ? phaseType : undefined,
                     userPK: phaseType === 'Annotation' ? user?.pk : undefined,
                   } }
                   onSelected={ setLabel }/>

      <ConfidenceSelect onUpdate={ onUpdate }/>
      <DetectorSelect onUpdate={ onUpdate }/>
      <AnnotatorSelect onUpdate={ onUpdate }/>

      <Switch label='Acoustic features' options={ BOOLEAN_OPTIONS }
              value={ valueToBooleanOption(params.acoustic_features__isnull, true) }
              onValueSelected={ setAcousticFeatures }/>

    </Modal>, document.body) }
  </Fragment>
}

const ConfidenceSelect: React.FC<{
  onUpdate: () => void
}> = ({ onUpdate }) => {
  const { data } = useAnnotationSettings()
  const confidenceSet = useMemo(() => data?.annotationPhaseForCampaign?.annotationCampaign.confidenceSet, [ data ])
  const confidenceItems = useMemo(() => confidenceSet?.confidenceIndicators?.results.filter(i => i !== null).map((i: Partial<ConfidenceNode>) => ({
    label: i.label,
    value: i.label
  })) ?? [], [ confidenceSet ])
  const { params, updateParams } = useSpectrogramFilters()

  const setConfidence = useCallback((label: number | string | undefined) => {
    updateParams({
      with_user_annotations: true,
      confidence_indicator__label: typeof label === 'number' ? label.toString() : label,
    })
    onUpdate()
  }, [ updateParams ])


  if (!confidenceSet?.confidenceIndicators) return <Fragment/>
  return <Select label='Confidence' placeholder='Filter by confidence' optionsContainer='popover'
                 options={ confidenceItems }
                 value={ params.confidence_indicator__label ?? undefined }
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
      with_user_annotations: true,
      detector_configuration__detector_id: value,
    })
    onUpdate()
  }, [ updateParams ])


  if (phaseType !== PhaseType.verification || !detectors || detectors.length === 0) return <Fragment/>
  return <Select label='Detectors' placeholder='Filter by detector' optionsContainer='popover'
                 options={ detectorItems }
                 value={ params.detector_configuration__detector_id ?? undefined }
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
      with_user_annotations: true,
      annotator_id: value,
    })
    onUpdate()
  }, [ updateParams ])


  if (phaseType !== PhaseType.verification || !annotators || annotators.length === 0) return <Fragment/>
  return <Select label='Annotators' placeholder='Filter by annotator' optionsContainer='popover'
                 options={ annotatorItems }
                 value={ params.annotator_id ?? undefined }
                 onValueSelected={ setAnnotator }/>
}
