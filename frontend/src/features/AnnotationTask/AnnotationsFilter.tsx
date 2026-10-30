import React, { type FormEvent, Fragment, useCallback, useRef, useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useLoaderData, useNavigate, useParams } from '@tanstack/react-router';
import type { BaseUIEvent } from '@base-ui/react';
import { AnnotationPhaseType } from '@/api/types.gql-generated.ts';
import { cleanGqlList } from '@/api/utils';
import { ConfidenceComponent } from '@/features/Confidence';
import { DetectorComponent } from '@/features/Detector';
import { MxOntology } from '@/features/Mx';
import { User, Campaign } from '@/features';
import { Route } from '@/routes/_authenticated/annotation-campaign/$campaignID/_detailLayout/phase.$phaseType';
import { ButtonGroup, Dialog, Field, Form, Toggle } from '@/components/base';
import type { AllSpectrogramsFilters } from '@/features/AnnotationSpectrogram';


export const AnnotationsFilterModal: React.FC = () => {
    const {
        withAnnotations,
        annotationLabel,
        annotationAnnotator,
        annotationDetector,
        annotationConfidence,
        withAcousticFeatures,
    } = Route.useSearch({
        select: ({
                     withAnnotations,
                     annotationLabel,
                     annotationAnnotator,
                     annotationDetector,
                     annotationConfidence,
                     withAcousticFeatures,
                 }) => ({
            withAnnotations,
            annotationLabel,
            annotationAnnotator,
            annotationDetector,
            annotationConfidence,
            withAcousticFeatures,
        }),
    });
    const { data: user } = useQuery(User.currentQuery)
    const formRef = useRef<HTMLFormElement | null>(null)
    const routeParams = useParams({ from: '/_authenticated/annotation-campaign/$campaignID/_detailLayout/phase/$phaseType' })
    const navigate = useNavigate();
    const { data: labels } = useQuery(Campaign.labelsByIdQuery({ id: routeParams.campaignID }))
    const { campaign, confidences } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })

    const [ tmpWithAF, setTmpWithAF ] = useState<boolean | null>(withAcousticFeatures ?? null);
    const [ tmpWithAnnotations, setTmpWithAnnotations ] = useState<boolean | null>(withAnnotations ?? null);

    const update = useCallback((data: Pick<AllSpectrogramsFilters, 'withAnnotations' | 'withAcousticFeatures' | 'annotationLabel' | 'annotationConfidence' | 'annotationDetector' | 'annotationAnnotator'>) => {
        navigate({
            to: Route.to,
            params: routeParams,
            search: (prev) => ({
                ...prev,
                ...data,
                page: 1,
            }),
            replace: true,
        })
    }, [ navigate, routeParams ])

    const onSubmitRef = useCallback(() => {
        if (!formRef.current) return
        const formData = new FormData(formRef.current);
        if (tmpWithAnnotations == true) {
            const withAcousticFeatures = formData.get('withAcousticFeatures') as string || undefined
            update({
                withAnnotations: true,
                withAcousticFeatures: withAcousticFeatures === undefined ? undefined : withAcousticFeatures === 'true',
                annotationLabel: formData.get('annotationLabel') as string || undefined,
                annotationConfidence: formData.get('annotationConfidence') as string || undefined,
                annotationDetector: formData.get('annotationDetector') as string || undefined,
                annotationAnnotator: formData.get('annotationAnnotator') as string || undefined,
            })
        } else {
            update({
                withAnnotations: tmpWithAnnotations,
                withAcousticFeatures: undefined,
                annotationLabel: undefined,
                annotationConfidence: undefined,
                annotationDetector: undefined,
                annotationAnnotator: undefined,
            })
        }
    }, [ update, labels, tmpWithAnnotations, confidences, formRef ])

    const onReset = useCallback((event: BaseUIEvent<FormEvent<HTMLFormElement>>) => {
        event.preventDefault();
        update({
            withAnnotations: undefined,
            withAcousticFeatures: undefined,
            annotationLabel: undefined,
            annotationConfidence: undefined,
            annotationDetector: undefined,
            annotationAnnotator: undefined,
        })
    }, [ update ])

    return <Dialog.Content>
        <Form ref={ formRef } onReset={ onReset }>

            <Field.Root name="withAnnotations" horizontal>
                <Field.Label>With annotations</Field.Label>
                <Toggle.Group value={ tmpWithAnnotations }
                              onValueChange={ setTmpWithAnnotations }>
                    <Toggle.Item color="medium" value={ null }>Unset</Toggle.Item>
                    <Toggle.Item value={ true }>With</Toggle.Item>
                    <Toggle.Item value={ false }>Without</Toggle.Item>
                </Toggle.Group>
            </Field.Root>

            <Field.Root name="annotationLabel" horizontal>
                <Field.Label>Filter by label</Field.Label>
                <MxOntology.LabelCombobox items={ labels }
                                          disabled={ tmpWithAnnotations !== true }
                                          defaultValueString={ annotationLabel ?? undefined }/>
            </Field.Root>

            { campaign.confidenceSet && <Field.Root name="annotationConfidence" horizontal>
                <Field.Label>Filter by confidence</Field.Label>
                <ConfidenceComponent.Select items={ confidences }
                                            disabled={ tmpWithAnnotations !== true }
                                            defaultValueString={ annotationConfidence ?? undefined }/>
            </Field.Root> }


            { routeParams.phaseType === AnnotationPhaseType.Verification && <Fragment>

                <Field.Root name="annotationDetector" horizontal>
                    <Field.Label>Filter by detector</Field.Label>
                    <DetectorComponent.Select items={ cleanGqlList(campaign.detectors) }
                                              disabled={ tmpWithAnnotations !== true }
                                              defaultValueString={ annotationDetector ?? undefined }/>
                </Field.Root>

                <Field.Root name="annotationAnnotator" horizontal>
                    <Field.Label>Filter by annotator</Field.Label>
                    <User.Select items={ cleanGqlList(campaign.annotators).filter(a => a.id !== user?.id) }
                                 disabled={ tmpWithAnnotations !== true }
                                 defaultValueString={ annotationAnnotator ?? undefined }/>
                </Field.Root>

            </Fragment> }

            <Field.Root name="withAcousticFeatures" horizontal>
                <Field.Label>Acoustic features</Field.Label>
                <Toggle.Group value={ tmpWithAF ?? null }
                              onValueChange={ setTmpWithAF }
                              disabled={ tmpWithAnnotations !== true }>
                    <Toggle.Item color="medium" value={ null }>Unset</Toggle.Item>
                    <Toggle.Item value={ true }>With</Toggle.Item>
                    <Toggle.Item value={ false }>Without</Toggle.Item>
                </Toggle.Group>
            </Field.Root>

            <ButtonGroup spaceBetween>
                <Dialog.Close type="reset">Reset</Dialog.Close>
                <Dialog.Close onClick={ onSubmitRef } color="primary">Filter</Dialog.Close>
            </ButtonGroup>
        </Form>
    </Dialog.Content>
}