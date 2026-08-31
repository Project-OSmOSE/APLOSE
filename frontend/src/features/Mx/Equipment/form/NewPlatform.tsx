import React, { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button, ButtonGroup, CreateDialog, Field, Form, Spinner, Toast } from '@/components/base'
import { MxCommon } from '@/features/Mx';
import * as API from '../api'
import { PlatformTypeSelect } from '../input';
import styles from './styles.module.scss'
import { ContactTypeEnum } from '@/api';

const DEFAULT_OWNER_TYPE = ContactTypeEnum.Institution

export const NewPlatformForm: React.FC<CreateDialog.FormProps<API.PlatformFragment, API.CreatePlatformMutationVariables['input']>> = ({
                                                                                                                                          onCreate,
                                                                                                                                          input,
                                                                                                                                      }) => {
    const { data, mutateAsync, isPending } = useMutation(API.createPlatform)
    const toastManager = Toast.useToastManager()
    const [ ownerType, setOwnerType ] = useState<ContactTypeEnum | undefined>();

    const submit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        try {
            const ownerId = +(formData.get('ownerId') as string) as number | undefined
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
            }
        } catch (error) {
            toastManager.addError({ error, title: 'Fail creating platform' })
        }
    }, [ mutateAsync, toastManager, onCreate, ownerType ])

    return <Form onSubmit={ submit } gqlErrors={ data?.errors }>

        <Field.Root name="type">
            <Field.Label required>Type</Field.Label>
            <PlatformTypeSelect required creatable fixedValueString={ input?.type || undefined }/>
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
                <MxCommon.ContactTypeToggle value={ ownerType || DEFAULT_OWNER_TYPE }
                                            onValueChange={ setOwnerType }/>
                <Field.Error/>
            </Field.Root>
            <Field.Root name="ownerId">
                <Field.Label>
                    <span className={ styles.UpperLabel }>{ ownerType ?? DEFAULT_OWNER_TYPE }</span>
                </Field.Label>
                <MxCommon.ContactSelect type={ ownerType ?? DEFAULT_OWNER_TYPE }/>
                <Field.Error/>
            </Field.Root>
        </div>

        <Field.Root name="provider">
            <Field.Label>Provider institution</Field.Label>
            <MxCommon.InstitutionSelect creatable fixedValueString={ input?.provider || undefined }/>
            <Field.Error/>
        </Field.Root>

        <Field.Root name="description">
            <Field.Label>Description</Field.Label>
            <Field.Control type="textarea" defaultValue={ input?.description || undefined }/>
            <Field.Error/>
        </Field.Root>

        <ButtonGroup end>
            { isPending && <Spinner/> }
            <Button color="primary" type="submit">Submit</Button>
        </ButtonGroup>
    </Form>

}
