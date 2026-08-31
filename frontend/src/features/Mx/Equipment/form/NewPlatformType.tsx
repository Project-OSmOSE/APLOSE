import React, { useCallback } from 'react';
import { Button, ButtonGroup, Checkbox, CreateDialog, Field, Form, Spinner, Toast } from '@/components/base'
import { useMutation } from '@tanstack/react-query';
import * as API from '../api'

export const NewPlatformTypeForm: React.FC<CreateDialog.FormProps<API.PlatformTypeFragment, API.CreatePlatformTypeMutationVariables['input']>> = ({
                                                                                                                                                      onCreate,
                                                                                                                                                      input,
                                                                                                                                                  }) => {
    const { data, mutateAsync, isPending } = useMutation(API.createPlatformType)
    const toastManager = Toast.useToastManager()

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
            }
        } catch (error) {
            toastManager.addError({ error, title: 'Fail creating platform type' })
        }
    }, [ mutateAsync, toastManager, onCreate ])

    return <Form onSubmit={ submit } gqlErrors={ data?.errors }>

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

        <ButtonGroup end>
            { isPending && <Spinner/> }
            <Button color="primary" type="submit">Submit</Button>
        </ButtonGroup>
    </Form>
}
