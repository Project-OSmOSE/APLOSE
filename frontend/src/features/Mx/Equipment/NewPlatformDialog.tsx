import React, { useCallback, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button, ButtonGroup, CreateDialog, Dialog, Field, Form, Spinner, Toast } from '@/components/base'
import {
    ContactSelect,
    type ContactType,
    ContactTypeToggle,
    InstitutionSelect,
    type MxCommonAPI,
} from '@/features/Mx/Common';
import * as API from './api'
import { PlatformTypeSelect } from './select';
import styles from './styles.module.scss'

const DEFAULT_OWNER_TYPE: ContactType = 'institution'

export const NewPlatformDialog: React.FC<CreateDialog.Props<API.PlatformFragment, API.CreatePlatformMutationVariables['input']>> = ({
                                                                                                                                        onCreate,
                                                                                                                                        input,
                                                                                                                                        children,
                                                                                                                                    }) => {
    const { data, mutateAsync, isPending } = useMutation(API.createPlatform)
    const toastManager = Toast.useToastManager()
    const closeRef = useRef<HTMLButtonElement>(null);
    const [ ownerType, setOwnerType ] = useState<MxCommonAPI.ContactTypeFragment | undefined>();

    const submit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        try {
            const ownerId = +(formData.get('ownerId') as string) as number | undefined
            const ownerType = (JSON.parse(formData.get('ownerType') as string) as MxCommonAPI.ContactTypeFragment)?.id
            const data = await mutateAsync({
                ownerId: ownerId && ownerType ? ownerId : undefined,
                ownerType: ownerId && ownerType ? ownerType : undefined,
                type: formData.get('type') as string,
                name: formData.get('name') as string | undefined,
                description: formData.get('description') as string | undefined,
                provider: formData.get('description') as string | undefined,
            })
            if (data?.platform) {
                onCreate?.(data.platform)
                closeRef.current?.click()
            }
        } catch (error) {
            toastManager.addError({ error, title: 'Fail creating platform' })
        }
    }, [ mutateAsync, toastManager, onCreate ])

    return <Dialog.Content>
        <Dialog.Title>New platform</Dialog.Title>
        <Dialog.CloseIcon ref={ closeRef }/>

        <Form onSubmit={ submit } gqlErrors={ data?.errors }>

            <Field.Root name="type">
                <Field.Label required>Type</Field.Label>
                <PlatformTypeSelect required creatable fixedValueID={ input?.type || undefined }/>
                <Field.Error/>
            </Field.Root>

            <Field.Root name="name">
                <Field.Label required>Name</Field.Label>
                <Field.Control type="text" required defaultValue={ input?.name || undefined }/>
                <Field.Error/>
            </Field.Root>

            <div className={ styles.Contact }>
                <Field.Root name="ownerType">
                    <Field.Label>Owner</Field.Label>
                    <ContactTypeToggle defaultModel={ DEFAULT_OWNER_TYPE }
                                       value={ ownerType }
                                       onValueChange={ setOwnerType }/>
                    <Field.Error/>
                </Field.Root>
                <Field.Root name="ownerId">
                    <Field.Label>
                        <span className={ styles.UpperLabel }>{ ownerType?.model ?? DEFAULT_OWNER_TYPE }</span>
                    </Field.Label>
                    <ContactSelect type={ ownerType?.model as ContactType ?? DEFAULT_OWNER_TYPE }/>
                    <Field.Error/>
                </Field.Root>
            </div>

            <Field.Root name="provider">
                <Field.Label>Provider institution</Field.Label>
                <InstitutionSelect creatable fixedValueID={ input?.provider || undefined }/>
                <Field.Error/>
            </Field.Root>

            <Field.Root name="description">
                <Field.Label>Description</Field.Label>
                <Field.Control type="textarea" defaultValue={ input?.description || undefined }/>
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
