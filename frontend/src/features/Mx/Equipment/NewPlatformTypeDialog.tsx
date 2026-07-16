import React, { useCallback, useRef } from 'react';
import { Button, ButtonGroup, Checkbox, CreateDialog, Dialog, Field, Form, Spinner, Toast } from '@/components/base'
import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '@/service/function';
import * as API from './api'

export const NewPlatformTypeDialog: React.FC<CreateDialog.Props<API.PlatformTypeFragment, API.CreatePlatformTypeMutationVariables['input']>> = ({
                                                                                                                                                 onCreate,
                                                                                                                                                 input,
                                                                                                                                                 children,
                                                                                                                                             }) => {
    const { data, mutateAsync, isPending } = useMutation(API.createPlatformType)
    const toastManager = Toast.useToastManager()
    const closeRef = useRef<HTMLButtonElement>(null);

    const submit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        try {
            const data = await mutateAsync({
                name: formData.get('name') as string,
                isMobile: formData.get('isMobile') === 'true',
            })
            if (data?.platformType) {
                onCreate?.(data.platformType)
                closeRef.current?.click()
            }
        } catch (e) {
            toastManager.add({
                title: 'Fail creating platform type',
                description: getErrorMessage(e),
                type: 'error',
            })
        }
    }, [ mutateAsync, toastManager, onCreate ])

    return <Dialog.Content>
        <Dialog.Title>New platform type</Dialog.Title>
        <Dialog.CloseIcon ref={ closeRef }/>

        <Form onSubmit={ submit } gqlErrors={ data?.errors }>

            <Field.Root name="name">
                <Field.Label required>Name</Field.Label>
                <Field.Control type="text" required defaultValue={ input?.name }/>
                <Field.Error/>
            </Field.Root>

            <Field.Root name="isMobile" horizontal>
                <Field.Label>Mobile platform</Field.Label>
                <Checkbox/>
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
