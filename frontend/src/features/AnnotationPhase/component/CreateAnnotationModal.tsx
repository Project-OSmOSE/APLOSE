import React, { type FormEvent, Fragment, useCallback, useState } from 'react';
import { useLoaderData } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import type { BaseUIEvent } from '@base-ui/react';

import { AnnotationLabelNode } from '@/api';
import { Button, ButtonGroup, Checkbox, Dialog, Field, Form, Spinner, Toast } from '@/components/base';

import { LabelAPI, LabelComponent } from '@/features/Labels';
import { ConfidenceAPI, ConfidenceComponent } from '@/features/Confidence';

import * as API from '../api'
import styles from './styles.module.scss'

type Label = Pick<AnnotationLabelNode, 'id' | 'name'>
type N<T> = NonNullable<T>
type LabelSet = N<N<LabelAPI.ListLabelSetsQuery['allLabelSets']>['results'][number]>
type ConfidenceSet = N<N<ConfidenceAPI.ListConfidenceSetsQuery['allConfidenceSets']>['results'][number]>

export const CreateAnnotationModal: React.FC<{ closeOnCreate: () => void }> = ({ closeOnCreate }) => {
    const { campaign } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const { isPending, mutateAsync } = useMutation(API.createAnnotationMutation)
    const toastManager = Toast.useToastManager()

    const [ labelSet, setLabelSet ] = useState<LabelSet | null>(null);

    const [ labelsWithAcousticFeatures, setLabelsWithAcousticFeatures ] = useState<Label[]>([]);

    const [ confidenceSet, setConfidenceSet ] = useState<ConfidenceSet | null>(null);

    const onSubmit = useCallback(async (event: BaseUIEvent<FormEvent<HTMLFormElement>>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        try {
            await mutateAsync({
                campaignID: campaign.id,
                labelSetID: formData.get('labelSetID') as string,
                confidenceSetID: formData.get('confidenceSetID') as string || undefined,
                labelsWithAcousticFeatures: labelsWithAcousticFeatures.map(l => l.id),
                allowPointAnnotation: formData.get('allowPointAnnotation') === 'true',
            })
            closeOnCreate()
        } catch (error) {
            toastManager.addError({ title: 'Annotation phase creation failed', error })
        }
    }, [ mutateAsync, campaign, labelsWithAcousticFeatures, closeOnCreate, toastManager ])

    if (campaign.isArchived) return <Fragment/>
    return <Dialog.Content>
        <Dialog.Title>New annotation phase</Dialog.Title>
        <Dialog.CloseIcon/>

        <Form onSubmit={ onSubmit }>
            <p>In an "Annotation" phase, you create new annotations.</p>

            <Field.Root name="labelSetID">
                <div className={ styles.horizontalField }>
                    <Field.Label required>Label set</Field.Label>
                    <LabelComponent.SetSelect value={ labelSet }
                                              onValueChange={ setLabelSet }
                                              required/>
                </div>
                <Field.Error/>
            </Field.Root>
            { labelSet && <LabelComponent.Table description={ labelSet.description ?? undefined }
                                                labels={ (labelSet.labels ?? []).filter(l => l !== null) as Label[] }
                                                labelsWithAcousticFeatures={ labelsWithAcousticFeatures }
                                                setLabelsWithAcousticFeatures={ setLabelsWithAcousticFeatures }/> }

            <Field.Root name="confidenceSetID">
                <div className={ styles.horizontalField }>
                    <Field.Label>Confidence set</Field.Label>
                    <ConfidenceComponent.SetSelect value={ confidenceSet }
                                                   onValueChange={ setConfidenceSet }/>
                </div>
                <Field.Error/>
            </Field.Root>
            <ConfidenceComponent.SetDescription set={ confidenceSet }/>

            <Field.Root name="allowPointAnnotation">
                <div className={ styles.horizontalField }>
                    <Field.Label>
                        Allow annotations of type "Point"
                    </Field.Label>
                    <Checkbox/>
                </div>
                <Field.Error/>
            </Field.Root>


            <ButtonGroup spaceBetween>
                <Dialog.Close>Cancel</Dialog.Close>

                { isPending && <Spinner/> }

                <Button color="primary" type="submit">
                    Create
                </Button>
            </ButtonGroup>

        </Form>
    </Dialog.Content>
}
