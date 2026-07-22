import React, { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button, ButtonGroup, CreateDialog, Field, Form, Spinner, Toast } from '@/components/base'
import * as API from '../api'
import { SourceSelect } from '../input';


export const NewSourceForm: React.FC<CreateDialog.FormProps<API.SourceFragment, API.CreateSourceMutationVariables['input']>> = ({
                                                                                                                                    onCreate,
                                                                                                                                    input,
                                                                                                                                }) => {
    const { data, mutateAsync, isPending } = useMutation(API.createSource)
    const toastManager = Toast.useToastManager()

    const submit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        try {
            const data = await mutateAsync({
                englishName: formData.get('englishName') as string,
                frenchName: formData.get('frenchName') as string | undefined,
                latinName: formData.get('latinName') as string | undefined,
                codeName: formData.get('codeName') as string | undefined,
                taxon: formData.get('taxon') as string | undefined,
                parent: formData.get('parent') as string | undefined,
            })
            if (data?.source) {
                onCreate?.(data.source)
            }
        } catch (error) {
            toastManager.addError({ error, title: 'Fail creating source' })
        }
    }, [ mutateAsync, toastManager, onCreate ])

    return <Form onSubmit={ submit } gqlErrors={ data?.errors }>

        <Field.Root name="englishName">
            <Field.Label required>English name</Field.Label>
            <Field.Control type="text" required defaultValue={ input?.englishName || undefined }/>
            <Field.Error/>
        </Field.Root>

        <Field.Root name="frenchName">
            <Field.Label>French name</Field.Label>
            <Field.Control type="text" defaultValue={ input?.frenchName || undefined }/>
            <Field.Error/>
        </Field.Root>

        <Field.Root name="latinName">
            <Field.Label>Latin name</Field.Label>
            <Field.Control type="text" defaultValue={ input?.latinName || undefined }/>
            <Field.Error/>
        </Field.Root>

        <Field.Root name="codeName">
            <Field.Label>Code name</Field.Label>
            <Field.Control type="text" defaultValue={ input?.codeName || undefined }/>
            <Field.Error/>
        </Field.Root>

        <Field.Root name="taxon">
            <Field.Label>Taxon</Field.Label>
            <Field.Control type="text" defaultValue={ input?.taxon || undefined }/>
            <Field.Error/>
        </Field.Root>

        <Field.Root name="parent">
            <Field.Label>Parent</Field.Label>
            <SourceSelect creatable fixedValueID={ input?.parent || undefined }/>
            <Field.Error/>
        </Field.Root>

        <ButtonGroup end>
            { isPending && <Spinner/> }
            <Button color="primary" type="submit">Submit</Button>
        </ButtonGroup>
    </Form>
}
