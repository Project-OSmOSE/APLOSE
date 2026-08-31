import React, { useCallback } from 'react';
import { Button, ButtonGroup, CreateDialog, Field, Form, Spinner, Toast } from '@/components/base'
import { useMutation } from '@tanstack/react-query';
import * as API from '../api'

export const NewInstitutionForm: React.FC<CreateDialog.FormProps<API.InstitutionFragment, API.CreateInstitutionMutationVariables['input']>> = ({
                                                                                                                                                   onCreate,
                                                                                                                                                   input,
                                                                                                                                               }) => {
    const { data, mutateAsync, isPending } = useMutation(API.createInstitution)
    const toastManager = Toast.useToastManager()

    const submit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        try {
            const data = await mutateAsync({
                name: formData.get('name') as string,
                city: formData.get('city') as string,
                country: formData.get('country') as string,
                mail: formData.get('mail') as string,
                website: formData.get('website') as string,
            })
            if (data?.institution) {
                onCreate?.(data.institution)
            }
        } catch (error) {
            toastManager.addError({ error, title: 'Fail creating institution' })
        }
    }, [ mutateAsync, toastManager, onCreate ])

    return <Form onSubmit={ submit } gqlErrors={ data?.errors }>

        <Field.Root name="name">
            <Field.Label required>Name</Field.Label>
            <Field.Control type="text" required defaultValue={ input?.name }/>
            <Field.Error/>
        </Field.Root>

        <Field.Root name="city">
            <Field.Label>City</Field.Label>
            <Field.Control type="text" defaultValue={ input?.city || undefined }/>
            <Field.Error/>
        </Field.Root>

        <Field.Root name="country">
            <Field.Label>Country</Field.Label>
            <Field.Control type="text" defaultValue={ input?.country || undefined }/>
            <Field.Error/>
        </Field.Root>

        <Field.Root name="mail">
            <Field.Label>Mail</Field.Label>
            <Field.Control type="email" defaultValue={ input?.mail || undefined }/>
            <Field.Error/>
        </Field.Root>

        <Field.Root name="website">
            <Field.Label>Website</Field.Label>
            <Field.Control type="url" defaultValue={ input?.website || undefined }/>
            <Field.Error/>
        </Field.Root>

        <ButtonGroup end>
            { isPending && <Spinner/> }
            <Button color="primary" type="submit">Submit</Button>
        </ButtonGroup>
    </Form>
}
