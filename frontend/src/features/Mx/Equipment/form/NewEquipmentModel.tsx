import React, { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button, ButtonGroup, CreateDialog, Field, Form, Spinner, Toast } from '@/components/base'
import { InstitutionSelect } from '@/features/Mx/Common';
import * as API from '../api'
import {
    AcousticDetectorSpecificationFieldset,
    HydrophoneSpecificationFieldset,
    RecorderSpecificationFieldset,
    StorageSpecificationFieldset,
} from '../fieldset';
import { ByteUnitEnum, HydrophoneDirectivityEnum } from '@/api/types.gql-generated';


export const NewEquipmentModelForm: React.FC<CreateDialog.FormProps<API.EquipmentModelFragment, API.CreateEquipmentModelMutationVariables['input']>> = ({
                                                                                                                                                            onCreate,
                                                                                                                                                            input,
                                                                                                                                                        }) => {
    const { data, mutateAsync, isPending } = useMutation(API.createEquipmentModel)
    const toastManager = Toast.useToastManager()

    const submit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        try {
            let recorderSpecification: API.CreateEquipmentModelMutationVariables['input']['recorderSpecification'] | null = null
            if (formData.get('recorderSpecification') === 'true') {
                const channelsCount = formData.get('recorderSpecification-channelsCount') as string | undefined
                const storageSlotsCount = formData.get('recorderSpecification-storageSlotsCount') as string | undefined
                const storageMaximumCapacityAmount = formData.get('recorderSpecification-storageMaximumCapacityAmount') as string | undefined
                recorderSpecification = {
                    channelsCount: channelsCount ? +channelsCount : undefined,
                    storageSlotsCount: storageSlotsCount ? +storageSlotsCount : undefined,
                    storageType: formData.get('recorderSpecification-storageType') as string | undefined,
                    storageMaximumCapacityAmount: storageMaximumCapacityAmount ? +storageMaximumCapacityAmount : undefined,
                    storageMaximumCapacityUnit: formData.get('recorderSpecification-storageMaximumCapacityUnit') as ByteUnitEnum | undefined,
                }
            }

            let hydrophoneSpecification: API.CreateEquipmentModelMutationVariables['input']['hydrophoneSpecification'] | null = null
            if (formData.get('hydrophoneSpecification') === 'true') {
                const minBandwidth = formData.get('hydrophoneSpecification-minBandwidth') as string | undefined
                const maxBandwidth = formData.get('hydrophoneSpecification-maxBandwidth') as string | undefined
                const minDynamicRange = formData.get('hydrophoneSpecification-minDynamicRange') as string | undefined
                const maxDynamicRange = formData.get('hydrophoneSpecification-maxDynamicRange') as string | undefined
                const minOperatingDepth = formData.get('hydrophoneSpecification-minOperatingDepth') as string | undefined
                const maxOperatingDepth = formData.get('hydrophoneSpecification-maxOperatingDepth') as string | undefined
                const operatingMinTemperature = formData.get('hydrophoneSpecification-operatingMinTemperature') as string | undefined
                const operatingMaxTemperature = formData.get('hydrophoneSpecification-operatingMaxTemperature') as string | undefined
                const noiseFloor = formData.get('hydrophoneSpecification-noiseFloor') as string | undefined
                hydrophoneSpecification = {
                    directivity: formData.get('hydrophoneSpecification-directivity') as HydrophoneDirectivityEnum | undefined,
                    minBandwidth: minBandwidth ? +minBandwidth : undefined,
                    maxBandwidth: maxBandwidth ? +maxBandwidth : undefined,
                    minDynamicRange: minDynamicRange ? +minDynamicRange : undefined,
                    maxDynamicRange: maxDynamicRange ? +maxDynamicRange : undefined,
                    minOperatingDepth: minOperatingDepth ? +minOperatingDepth : undefined,
                    maxOperatingDepth: maxOperatingDepth ? +maxOperatingDepth : undefined,
                    operatingMinTemperature: operatingMinTemperature ? +operatingMinTemperature : undefined,
                    operatingMaxTemperature: operatingMaxTemperature ? +operatingMaxTemperature : undefined,
                    noiseFloor: noiseFloor ? +noiseFloor : undefined,
                }
            }

            let acousticDetectorSpecification: API.CreateEquipmentModelMutationVariables['input']['acousticDetectorSpecification'] | null = null
            if (formData.get('acousticDetectorSpecification') === 'true') {
                const minFrequency = formData.get('acousticDetectorSpecification-minFrequency') as string | undefined
                const maxFrequency = formData.get('acousticDetectorSpecification-maxFrequency') as string | undefined
                acousticDetectorSpecification = {
                    algorithmName: formData.get('acousticDetectorSpecification-algorithmName') as string | undefined,
                    minFrequency: minFrequency ? +minFrequency : undefined,
                    maxFrequency: maxFrequency ? +maxFrequency : undefined,
                    detectedLabels: formData.getAll('acousticDetectorSpecification-detectedLabels') as string[],
                }
            }

            let storageSpecification: API.CreateEquipmentModelMutationVariables['input']['storageSpecification'] | null = null
            if (formData.get('storageSpecification') === 'true') {
                storageSpecification = {
                    capacityAmount: +(formData.get('storageSpecification-capacityAmount') as string),
                    capacityUnit: formData.get('storageSpecification-capacityUnit') as ByteUnitEnum,
                    type: formData.get('storageSpecification-type') as string | undefined,
                }
            }

            const batterySlotsCount = formData.get('batterySlotsCount') as string | undefined
            const data = await mutateAsync({
                name: formData.get('name') as string,
                provider: formData.get('provider') as string,
                batteryType: formData.get('batteryType') as string | undefined,
                batterySlotsCount: batterySlotsCount ? +batterySlotsCount : undefined,
                cables: formData.get('cables') as string | undefined,

                recorderSpecification,
                hydrophoneSpecification,
                acousticDetectorSpecification,
                storageSpecification,
            })
            if (data?.equipmentModel) {
                onCreate?.(data.equipmentModel)
            }
        } catch (error) {
            toastManager.addError({ error, title: 'Fail creating equipment model' })
        }
    }, [ mutateAsync, toastManager, onCreate ])

    return <Form onSubmit={ submit } gqlErrors={ data?.errors }>

        <Field.Root name="name">
            <Field.Label required>Name</Field.Label>
            <Field.Control required type="text" defaultValue={ input?.name || undefined }/>
            <Field.Error/>
        </Field.Root>

        <Field.Root name="provider">
            <Field.Label required>Provider institution</Field.Label>
            <InstitutionSelect required creatable fixedValueString={ input?.provider || undefined }/>
            <Field.Error/>
        </Field.Root>

        <Field.Root name="batteryType">
            <Field.Label>Battery type</Field.Label>
            <Field.Control type="text" defaultValue={ input?.batteryType || undefined }/>
            <Field.Error/>
        </Field.Root>

        <Field.Root name="batterySlotsCount">
            <Field.Label>Battery slots</Field.Label>
            <Field.Control type="number" defaultValue={ input?.batterySlotsCount || undefined }/>
            <Field.Error/>
        </Field.Root>

        <Field.Root name="cables">
            <Field.Label>Cables</Field.Label>
            <Field.Control type="textarea" defaultValue={ input?.cables || undefined }/>
            <Field.Error/>
        </Field.Root>

        <RecorderSpecificationFieldset name="recorderSpecification" input={ input?.recorderSpecification }/>
        <HydrophoneSpecificationFieldset name="hydrophoneSpecification" input={ input?.hydrophoneSpecification }/>
        <StorageSpecificationFieldset name="storageSpecification" input={ input?.storageSpecification }/>
        <AcousticDetectorSpecificationFieldset name="acousticDetectorSpecification"
                                               input={ input?.acousticDetectorSpecification }/>

        <ButtonGroup end>
            { isPending && <Spinner/> }
            <Button color="primary" type="submit">Submit</Button>
        </ButtonGroup>
    </Form>
}
