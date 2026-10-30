import React, { type FormEvent, Fragment, useCallback, useState } from 'react';
import { useLoaderData } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import type { BaseUIEvent } from '@base-ui/react';
import { TrashBinTrashLinearIcon } from '@solar-icons/react';
import { AnnotationCampaignLabelInput } from "@/api/types.gql-generated.ts";
import { ensureValidQueryData } from "@/api/utils.ts";
import { Button, ButtonGroup, Checkbox, Dialog, Field, Form, Note, Spinner, Toast } from '@/components/base';
import { ConfidenceAPI, ConfidenceComponent } from '@/features/Confidence';
import { Campaign } from "@/features";
import { MxOntology } from "@/features/Mx";

import * as API from '../api'
import styles from './styles.module.scss'

type N<T> = NonNullable<T>
type ConfidenceSet = N<N<ConfidenceAPI.ListConfidenceSetsQuery['allConfidenceSets']>['results'][number]>

export const CreateAnnotationModal: React.FC<{ closeOnCreate: () => void }> = ({ closeOnCreate }) => {
    const { campaign } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const { isPending, mutateAsync } = useMutation(API.createAnnotationMutation)
    const toastManager = Toast.useToastManager()

    const [ labelRelations, setLabelRelations ] = useState<Omit<Campaign.LabelRelationFragment, 'id'>[]>([]);
    const addLabels = useCallback((newLabels: MxOntology.LabelFragment[]) => {
        setLabelRelations(prev => [
            ...prev,
            ...newLabels
                .filter(label => !prev.some(l => l.label.id === label.id))
                .map(label => ({ label, enableAcousticFeatures: false }))
        ])
    }, [ setLabelRelations ])
    const removeLabel = useCallback((relation: Omit<Campaign.LabelRelationFragment, 'id'>) => {
        setLabelRelations(prev => prev.filter(rel => rel.label.id !== relation.label.id))
    }, [ setLabelRelations ])
    const [ isLoadingCampaignLabels, setIsLoadingCampaignLabels ] = useState<boolean>(false)
    const addLabelsFromCampaign = useCallback(async (newCampaigns: Campaign.AllFragment[]) => {
        setIsLoadingCampaignLabels(true)
        try {
            const campaignLabels = await Promise.all(newCampaigns.map(c => ensureValidQueryData(Campaign.labelsByIdQuery(c))))
            setLabelRelations(prev => [
                ...prev,
                ...campaignLabels.flatMap(labels => labels)
                    .filter(rel => !prev.some(l => l.label.id === rel.label.id))
                    .map(rel => ({ ...rel, id: undefined }))
            ])
        } finally {
            setIsLoadingCampaignLabels(false)
        }
    }, [ setLabelRelations ])

    const [ confidenceSet, setConfidenceSet ] = useState<ConfidenceSet | null>(null);

    const onSubmit = useCallback(async (event: BaseUIEvent<FormEvent<HTMLFormElement>>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        try {
            await mutateAsync({
                campaignID: campaign.id,
                confidenceSetID: formData.get('confidenceSetID') as string || undefined,
                labels: [ ...formData.entries() ]
                    .filter(([ name, ]) => name.split('-')[0] === 'label')
                    .map(([ name, enableAcousticFeaturesStr ]) => ({
                        annotationCampaign: campaign.id,
                        enableAcousticFeatures: enableAcousticFeaturesStr === 'true',
                        label: name.split('-')[1]
                    } satisfies AnnotationCampaignLabelInput)),
                allowPointAnnotation: formData.get('allowPointAnnotation') === 'true',
            })
            closeOnCreate()
        } catch (error) {
            toastManager.addError({ title: 'Annotation phase creation failed', error })
        }
    }, [ mutateAsync, campaign, labelRelations, closeOnCreate, toastManager ])

    if (campaign.archived) return <Fragment/>
    return <Dialog.Content>
        <Dialog.Title>New annotation phase</Dialog.Title>
        <Dialog.CloseIcon/>

        <Form onSubmit={ onSubmit }>
            <p>In an "Annotation" phase, you create new annotations.</p>

            <Field.Root>
                <Field.Label>Add label</Field.Label>
                <MxOntology.LabelCombobox multiple side='top'
                                          value={ [] }
                                          onValueChange={ addLabels }/>
            </Field.Root>
            <Field.Root>
                <Field.Label>Add labels from another campaign</Field.Label>
                <Campaign.Combobox multiple side='top'
                                   loading={ isLoadingCampaignLabels }
                                   value={ [] }
                                   onValueChange={ addLabelsFromCampaign }/>
            </Field.Root>

            { labelRelations.length > 0 && <Note>Labels</Note> }

            { labelRelations.map((rel, key) =>
                <Field.Root key={ key } name={ `label-${ rel.label.id }` }>
                    <div className={ styles.label }>
                        <Button onClick={ () => removeLabel(rel) }>
                            <TrashBinTrashLinearIcon size={ 16 }/>
                        </Button>
                        <Checkbox defaultChecked={ rel.enableAcousticFeatures }/>
                        <Field.Label>
                            { rel.label.displayName }
                        </Field.Label>
                    </div>
                    <Field.Error/>
                </Field.Root>) }

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
