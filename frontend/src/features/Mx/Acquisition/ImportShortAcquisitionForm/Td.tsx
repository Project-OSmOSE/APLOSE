import React, { Fragment, useMemo } from 'react';
import { Td } from '@/components/ui';
import { Field, Note } from '@/components/base';
import { useImportShortAcquisitionContext } from './Root';
import { MxCommon, MxData, MxEquipment, MxOntology } from '@/features/Mx';
import { Key } from './keys'
import styles from './styles.module.scss'
import { BooleanCheckbox, BooleanToggle } from './data/Boolean';
import { NumberInput } from './data/Number';
import { StringInput } from './data/String';
import { DatetimeInput } from './data/Date';
import { useObjectSelect } from './data/Objects';
import type { DataControlParams } from './data/type';


export const DeploymentTd: React.FC<{ header: string, rowIndex: number }> = ({ header, rowIndex }) => {

    const {
        rows,
        getContactTypeForRaw,
        getVisualObservationIndex,
        header: {
            getKeyForRaw,
        },
    } = useImportShortAcquisitionContext()

    const key = useMemo(() => {
        return getKeyForRaw(header)
    }, [ getKeyForRaw, header ])
    const data = useMemo(() => {
        if (!rows) return undefined
        return (rows[rowIndex] as any)[header]
    }, [ rows, header, rowIndex ])
    const fieldName = useMemo(() => {
        let name = rowIndex.toString()
        if (!key) return name
        name += `-${ key }`
        const keyIndex = getVisualObservationIndex(header, key)
        if (keyIndex !== null) name += `-${ keyIndex }`
        return name
    }, [ rowIndex, key, header, getVisualObservationIndex ])

    const objectSelect = useObjectSelect({ header, rowIndex, data, name: fieldName })

    const contactType = useMemo(() => {
        return getContactTypeForRaw(header)
    }, [ getContactTypeForRaw, header ])

    const control = useMemo(() => {
        const params: DataControlParams = { header, rowIndex, data, name: fieldName }
        const multipleDefaultStringLabel = objectSelect.defaultStringLabel?.split(',').map(d => d.trim())
        switch (key as Key) {
            case 'continuous':
            case 'isLost':
                return <BooleanCheckbox { ...params }/>
            case 'visualObservations-youngPresence':
            case 'visualObservations-otherHumanActivityPresence':
                return <BooleanToggle { ...params }/>
            case 'deployment-longitude':
            case 'deployment-latitude':
                return <NumberInput { ...params }/>
            case 'visualObservations-countMin':
            case 'visualObservations-countMax':
            case 'recorderSpec-sampleDepth':
                return <NumberInput { ...params } min={ 0 }/>
            case 'dutyCycleOff':
            case 'dutyCycleOn':
                return <NumberInput { ...params } min={ 0 } unit="s"/>
            case 'detectorSpec-minFrequency':
            case 'detectorSpec-maxFrequency':
            case 'recorderSpec-samplingFrequency':
                return <NumberInput { ...params } min={ 0 } unit="Hz"/>
            case 'instrumentDepth':
            case 'deployment-bathymetricDepth':
            case 'visualObservations-startDistanceMin':
            case 'visualObservations-startDistanceMax':
            case 'visualObservations-endDistanceMin':
            case 'visualObservations-endDistanceMax':
                return <NumberInput { ...params } min={ 0 } unit="m"/>
            case 'recorderSpec-gain':
                return <NumberInput { ...params } unit="dB"/>
            case 'timezone':
            case 'deployment-campaign':
            case 'deployment-site':
            case 'deployment-deploymentVessel':
            case 'deployment-recoveryVessel':
            case 'deployment-name':
            case 'recorderSpec-channelName':
                return <StringInput { ...params }/>
            case 'extraInformation':
            case 'deployment-description':
            case 'visualObservations-additionalInformation':
            case 'detectorSpec-configuration':
            case 'detectorSpec-filter':
                return <StringInput { ...params } type="textarea"/>
            case 'recordStartDate':
            case 'recordEndDate':
            case 'deployment-deploymentDate':
            case 'deployment-recoveryDate':
            case 'visualObservations-startDatetime':
            case 'visualObservations-endDatetime':
                return <DatetimeInput { ...params }/>
            case 'deployment-platform':
                return <MxEquipment.PlatformSelect { ...objectSelect }/>
            case 'storages':
                return <MxEquipment.EquipmentSelect { ...objectSelect } isStorage/>
            case 'detectorSpec-detector':
                return <MxEquipment.EquipmentSelect { ...objectSelect } isDetector/>
            case 'recorderSpec-recorder':
                return <MxEquipment.EquipmentSelect { ...objectSelect } isRecorder/>
            case 'recorderSpec-hydrophone':
                return <MxEquipment.EquipmentSelect { ...objectSelect } isHydrophone/>
            case 'recorderSpec-recorderAndHydrophone':
                return <Fragment>
                    <MxEquipment.EquipmentSelect { ...objectSelect } isHydrophone isRecorder
                                                 name={ `${ rowIndex }-recorderSpec-hydrophone` }/>
                    <MxEquipment.EquipmentSelect { ...objectSelect } isHydrophone isRecorder
                                                 className={ styles.Hidden }
                                                 name={ `${ rowIndex }-recorderSpec-recorder` }/>
                </Fragment>
            case 'contacts-contactId':
                switch (contactType) {
                    case 'person':
                        return <MxCommon.PersonSelect { ...objectSelect } required/>
                    case 'team':
                        return <MxCommon.TeamSelect { ...objectSelect } required/>
                    case 'institution':
                    default:
                        return <MxCommon.InstitutionSelect { ...objectSelect } required/>
                }
            case 'visualObservations-source':
                return <MxOntology.SourceSelect { ...objectSelect }/>
            case 'recorderSpec-recordingFormats':
            case 'detectorSpec-outputFormats':
                return <MxData.FormatSelect { ...objectSelect }
                                            multiple
                                            defaultStringLabel={ multipleDefaultStringLabel }/>
            case 'visualObservations-behaviors':
            case 'visualObservations-reactionsToBoat':
                return <MxOntology.BehaviorMultiCombobox { ...objectSelect }
                                                         defaultStringLabel={ multipleDefaultStringLabel }/>
            case 'detectorSpec-labels':
                return <MxOntology.LabelMultiCombobox { ...objectSelect }
                                                      defaultStringLabel={ multipleDefaultStringLabel }/>
            default:
                return <Note color="danger">Not implemented</Note>
        }
    }, [ header, rowIndex, key, data, objectSelect, contactType, fieldName ])

    if (key === undefined)
        return <Td top><p/></Td>

    return <Td top>
        <Field.Root>
            <Field.Label>{ data || <Note color="medium">Empty</Note> }</Field.Label>
            { control }
        </Field.Root>
    </Td>
}