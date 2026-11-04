import React, { useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { type BaseUIEvent, Button, ButtonGroup, Field, Fieldset, Form, Spinner, Toast } from '@/components/base';
import * as API from '../api';
import * as INPUT from '../input';


export const LabelPreferenceForm: React.FC<{ id?: string }> = ({ id }) => {
    const { data: user } = useQuery(API.currentQuery)
    const toastManager = Toast.useToastManager()
    const {
        mutateAsync,
        isPending,
    } = useMutation(API.updateLabelPreferenceMutation)

    const submit = useCallback(async (event: BaseUIEvent<React.FormEvent<HTMLFormElement>>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const preference = formData.get('preference') as API.LabelDisplayPreferenceType;

        try {
            await mutateAsync({ preference })
        } catch (error) {
            toastManager.addError({ title: 'Label preference update failed', error })
        }
    }, [ mutateAsync, toastManager ])

    return <Form id={ id } onSubmit={ submit }>
        <Fieldset.Root>
            <Fieldset.Legend>Update label preferences</Fieldset.Legend>

            <Field.Root name="preference" horizontal>
                <Field.Label>Display</Field.Label>
                <INPUT.LabelPreferenceToggle required defaultValue={ user?.labelDisplayPreference }/>
                <Field.Error/>
            </Field.Root>

            <ButtonGroup end>
                { isPending && <Spinner/> }
                <Button color="primary" type="submit" disabled={ isPending }>
                    Update
                </Button>
            </ButtonGroup>
        </Fieldset.Root>
    </Form>
}
