import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button, ButtonGroup, CreateDialog, Dialog, Field, Fieldset, Form, Spinner, Toast } from '@/components/base'
import { ContactSelect, type ContactType, ContactTypeToggle, type MxCommonAPI } from '@/features/Mx/Common';
import * as API from './api'
import styles from './styles.module.scss'
import { EquipmentModelSelect } from '@/features/Mx/Equipment/select';

const DEFAULT_OWNER_TYPE: ContactType = 'institution'

export const NewEquipmentDialog: React.FC<CreateDialog.Props<API.EquipmentFragment, API.CreateEquipmentMutationVariables['input']>> = ({
                                                                                                                                           onCreate,
                                                                                                                                           input,
                                                                                                                                           children,
                                                                                                                                       }) => {
    const { data, mutateAsync, isPending } = useMutation(API.createEquipment)
    const toastManager = Toast.useToastManager()
    const closeRef = useRef<HTMLButtonElement>(null);
    const [ ownerType, setOwnerType ] = useState<MxCommonAPI.ContactTypeFragment | undefined>();
    const [ model, setModel ] = useState<API.EquipmentModelFragment | undefined | null>();
    const isHydrophone = useMemo(() => {
        return model?.specifications?.find(spec => spec?.__typename === 'HydrophoneSpecificationNode')
    }, [ model ])

    const submit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        try {
            const ownerId = +(formData.get('ownerId') as string) as number
            const ownerType = (JSON.parse(formData.get('ownerType') as string) as MxCommonAPI.ContactTypeFragment)?.id
            const sensitivity = formData.get('sensitivity') as string | undefined
            const data = await mutateAsync({
                serialNumber: formData.get('serialNumber') as string,
                name: formData.get('name') as string | undefined,
                purchaseDate: formData.get('purchaseDate') as string | undefined || undefined,
                ownerId,
                ownerType,
                model: formData.get('model') as string,
                sensitivity: isHydrophone && sensitivity !== undefined ? +sensitivity : undefined,
            })
            if (data?.equipment) {
                onCreate?.(data.equipment)
                closeRef.current?.click()
            }
        } catch (error) {
            toastManager.addError({ error, title: 'Fail creating equipment' })
        }
    }, [ mutateAsync, toastManager, onCreate, isHydrophone ])

    return <Dialog.Content>
        <Dialog.Title>New equipment</Dialog.Title>
        <Dialog.CloseIcon ref={ closeRef }/>

        <Form onSubmit={ submit } gqlErrors={ data?.errors }>

            <Field.Root name="model">
                <Field.Label required>Model</Field.Label>
                <EquipmentModelSelect required creatable onValueChange={ setModel }/>
                <Field.Error/>
            </Field.Root>

            <Field.Root name="serialNumber">
                <Field.Label required>Serial number</Field.Label>
                <Field.Control type="text" required defaultValue={ input?.serialNumber || undefined }/>
                <Field.Error/>
            </Field.Root>

            <Field.Root name="name">
                <Field.Label>Name</Field.Label>
                <Field.Control type="text" defaultValue={ input?.name || undefined }/>
                <Field.Error/>
            </Field.Root>

            <Field.Root name="purchaseDate">
                <Field.Label>Purchase date</Field.Label>
                <Field.Control type="date" defaultValue={ input?.purchaseDate || undefined }/>
                <Field.Error/>
            </Field.Root>

            <div className={ styles.Contact }>
                <Field.Root name="ownerType">
                    <Field.Label required>Owner</Field.Label>
                    <ContactTypeToggle required defaultModel={ DEFAULT_OWNER_TYPE }
                                       value={ ownerType }
                                       onValueChange={ setOwnerType }/>
                    <Field.Error/>
                </Field.Root>
                <Field.Root name="ownerId">
                    <Field.Label required>
                        <span className={ styles.UpperLabel }>{ ownerType?.model ?? DEFAULT_OWNER_TYPE }</span>
                    </Field.Label>
                    <ContactSelect required type={ ownerType?.model as ContactType ?? DEFAULT_OWNER_TYPE }/>
                    <Field.Error/>
                </Field.Root>
            </div>

            { isHydrophone && <Fieldset.Root>
                <Fieldset.Legend>Hydrophone</Fieldset.Legend>
                <Field.Root name="sensitivity">
                    <Field.Label>Sensitivity</Field.Label>
                    <Field.Control type="number" defaultValue={ input?.sensitivity || undefined }/>
                    <Field.Error/>
                </Field.Root>
            </Fieldset.Root> }

            <ButtonGroup spaceBetween>
                <Dialog.Close>Cancel</Dialog.Close>
                { isPending && <Spinner/> }
                <Button color="primary" type="submit">Submit</Button>
            </ButtonGroup>
        </Form>

        { children }
    </Dialog.Content>
}
