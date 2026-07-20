import React, { useCallback, useRef } from 'react';
import { Button, ButtonGroup, CreateDialog, Dialog, Field, Form, Spinner, Toast } from '@/components/base'
import { useMutation } from '@tanstack/react-query';
import { InstitutionSelect } from './InstitutionSelect'
import * as API from './api'

export const NewTeamDialog: React.FC<CreateDialog.Props<API.TeamFragment, API.CreateTeamMutationVariables['input']>> = ({
                                                                                                                            input,
                                                                                                                            onCreate,
                                                                                                                            children,
                                                                                                                        }) => {
    const { data, mutateAsync, isPending } = useMutation(API.createTeam)
    const toastManager = Toast.useToastManager()
    const closeRef = useRef<HTMLButtonElement>(null);

    const submit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        try {
            const data = await mutateAsync({
                name: formData.get('name') as string,
                institution: formData.get('institution') as string,
                mail: formData.get('mail') as string,
                website: formData.get('website') as string,
            })
            if (data?.team) {
                onCreate?.(data.team)
                closeRef.current?.click()
            }
        } catch (error) {
            toastManager.addError({ error, title: 'Fail creating team' })
        }
    }, [ mutateAsync, toastManager, onCreate ])

    return <Dialog.Content>
        <Dialog.Title>New team</Dialog.Title>
        <Dialog.CloseIcon ref={ closeRef }/>

        <Form onSubmit={ submit } gqlErrors={ data?.errors }>

            <Field.Root name="name">
                <Field.Label required>Name</Field.Label>
                <Field.Control type="text" required defaultValue={ input?.name }/>
                <Field.Error/>
            </Field.Root>

            <Field.Root name="institution">
                <Field.Label required>Institution</Field.Label>
                <InstitutionSelect required creatable fixedValueID={ input?.institution || undefined }/>
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

            <ButtonGroup spaceBetween>
                <Dialog.Close>Cancel</Dialog.Close>
                { isPending && <Spinner/> }
                <Button color="primary" type="submit">Submit</Button>
            </ButtonGroup>
        </Form>

        { children }
    </Dialog.Content>
}
