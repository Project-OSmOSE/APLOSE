import React, { Fragment, useCallback, useId, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { type BaseUIEvent } from '@base-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { InfoCircle } from '@solar-icons/react';

import { cleanGqlErrors } from '@/api/utils';
import { Button, ButtonGroup, Checkbox, Field, Fieldset, Form, Link, Note, Spinner, Toast } from '@/components/base';

import { useAppDispatch } from '@/features/App';
import { Slice as StorageSlice } from '@/features/Storage'
import { DatasetComponent } from '@/features/Dataset';
import { AnalysisComponent } from '@/features/SpectrogramAnalysis';
import { ColormapComponent } from '@/features/Colormap';

import * as API from '../api'
import styles from './CampaignForm.module.scss'

export const Create: React.FC = () => {
    const dispatch = useAppDispatch();
    const toastManager = Toast.useToastManager()
    const navigate = useNavigate();

    const datasetSelectID = useId()
    const [ dataset, _setDataset ] = useState<DatasetComponent.SelectValue | null>(null);
    const analysisSelectID = useId()
    const [ analysis, setAnalysis ] = useState<AnalysisComponent.ComboboxSelectValue[]>([]);
    const setDataset = useCallback((value: DatasetComponent.SelectValue | null) => {
        _setDataset(value)
        setAnalysis([])
    }, [ setAnalysis, _setDataset ])
    const hasGrey = useMemo(() => !!analysis.find(a => a.colormap.name == 'Greys'), [ analysis ])
    const [ allowColormapTuning, setAllowColormapTuning ] = useState<boolean>(false);
    const toggleAllowColormapTuning = useCallback(() => setAllowColormapTuning(prev => !prev), [ setAllowColormapTuning ])
    const colormapSelectID = useId()

    const {
        data,
        mutateAsync,
        isPending,
    } = useMutation(API.createMutation)

    const submit = useCallback(async (event: BaseUIEvent<React.FormEvent<HTMLFormElement>>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        [ ...formData.entries() ].forEach(data => console.log(...data))

        try {
            const data = await mutateAsync({
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                instructionsUrl: formData.get('instructionsUrl') as string,
                deadline: formData.get('deadline') as string || undefined,

                // Data
                datasetID: formData.get('datasetID') as string,
                analysisIDs: formData.getAll('analysisIDs') as string[],

                // Spectrogram Tuning
                allowImageTuning: formData.get('allowImageTuning') === 'true',
                allowColormapTuning: formData.get('allowColormapTuning') === 'true',
                colormapDefault: formData.get('colormapDefault') as string,
                colormapInvertedDefault: formData.get('colormapInvertedDefault') === 'true',
            })
            if (!data) return
            if (!data?.annotationCampaign) return
            dispatch(StorageSlice.actions.invalidatePath(data.annotationCampaign.dataset.path))
            navigate({
                to: '/annotation-campaign/$campaignID',
                params: { campaignID: data.annotationCampaign.id },
                replace: true,
            })
        } catch (error) {
            toastManager.addError({ title: 'Fail creating campaign', error })
        }
    }, [ mutateAsync, toastManager, navigate, dispatch ])

    const errors = useMemo(() => cleanGqlErrors(data?.errors), [ data ])

    return <Form onSubmit={ submit }
                 errors={ errors }
                 className={ styles.Create }>

        <Fieldset.Root>
            <Field.Root name="name">
                <Field.Label required>Name</Field.Label>
                <Field.Control type="text"
                               placeholder="Campaign name"
                               required/>
                <Field.Error/>
            </Field.Root>

            <Field.Root name="description">
                <Field.Label>Description</Field.Label>
                <Field.Control type="textarea"
                               placeholder="Enter your campaign description"/>
                <Field.Error/>
            </Field.Root>

            <Field.Root name="instructionsUrl">
                <Field.Label>Instruction URL</Field.Label>
                <Field.Control type="url"
                               placeholder="URL"/>
                <Field.Error/>
            </Field.Root>

            <Field.Root name="deadline">
                <Field.Label>Deadline</Field.Label>
                <Field.Control type="date" placeholder="Deadline"/>
                <Field.Error/>
            </Field.Root>
        </Fieldset.Root>

        <Fieldset.Root>
            <Fieldset.Legend>Data</Fieldset.Legend>

            <Field.Root name="datasetID">
                <Field.Label htmlFor={ datasetSelectID }>Dataset</Field.Label>
                <DatasetComponent.Select id={ datasetSelectID }
                                         required
                                         onValueChange={ setDataset }/>
                <Field.Error/>
                <Note color="medium">
                    <InfoCircle weight="Linear"/> You can import new datasets in the <Link inText
                                                                                           to="/storage">Storage</Link> section
                </Note>
            </Field.Root>

            <Field.Root name="analysisIDs">
                <Field.Label htmlFor={ analysisSelectID }>Analysis</Field.Label>
                <AnalysisComponent.ComboboxSelectMultiple datasetID={ dataset?.id }
                                                          required fillOnLoad
                                                          id={ analysisSelectID }
                                                          onValueChange={ setAnalysis }/>
                { !dataset && <Field.Description>Select a dataset first</Field.Description> }
                <Field.Error/>
            </Field.Root>
        </Fieldset.Root>

        <Fieldset.Root>
            <Fieldset.Legend>Spectrogram Tuning</Fieldset.Legend>

            <Field.Root name="allowImageTuning">
                <Field.Label>
                    <Checkbox/>
                    Allow brightness / contrast modification
                </Field.Label>
                <Field.Error/>
            </Field.Root>

            <Field.Root name="allowColormapTuning">
                <Field.Label>
                    <Checkbox disabled={ !hasGrey } onClick={ toggleAllowColormapTuning }/>
                    <div>
                        Allow colormap modification
                        { !hasGrey && <Note color="medium">Requires grey scale spectrograms</Note> }
                    </div>
                </Field.Label>
                <Field.Error/>
            </Field.Root>

            { allowColormapTuning && <Fragment>
                <Field.Root name="colormapDefault">
                    <Field.Label htmlFor={ colormapSelectID }>Default colormap</Field.Label>
                    <ColormapComponent.Select required/>
                    <Field.Error/>
                </Field.Root>

                <Field.Root name="colormapInvertedDefault">
                    <Field.Label>
                        <Checkbox/>
                        Invert default colormap
                    </Field.Label>
                    <Field.Error/>
                </Field.Root>
            </Fragment> }

        </Fieldset.Root>

        <ButtonGroup end>
            { isPending && <Spinner/> }
            <Button color="primary" type="submit" disabled={ isPending }>
                Create
            </Button>
        </ButtonGroup>
    </Form>
}