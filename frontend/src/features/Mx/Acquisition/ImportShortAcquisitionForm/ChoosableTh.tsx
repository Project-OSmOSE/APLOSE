import React, { Fragment, useCallback, useMemo } from 'react';
import { Th } from '@/components/ui';
import { Button, ButtonGroup, ComboboxSelect, Field } from '@/components/base';
import { useImportShortAcquisitionContext } from './Root';
import { TrashBinTrash } from '@solar-icons/react';
import { type Key, useFormatKey } from './keys'
import { MxCommon } from '@/features/Mx';
import { ContactTypeEnum } from '@/api';
import styles from './styles.module.scss'


export const ChoosableTh: React.FC<{ header: string }> = ({ header }) => {
    const {
        getContactTypeForRaw,
        setContactTypeForRaw,
        getVisualObservationIndex,
        setVisualObservationIndex,
        header: {
            availableKeys,
            getKeyForRaw,
            setKeyForRaw,
            unselectRaw,
            mapRawToKey,
        },
    } = useImportShortAcquisitionContext()
    const formatKey = useFormatKey()

    const value = useMemo(() => {
        return (getKeyForRaw(header) as Key | undefined) ?? null
    }, [ getKeyForRaw, header ])

    const items = useMemo(() => {
        const all = [ ...availableKeys ]
        if (value) all.push(value)
        return [ ...new Set(all) ]
    }, [ availableKeys, value ])

    const contactType = useMemo(() => {
        return getContactTypeForRaw(header)
    }, [ getContactTypeForRaw, header ])

    const onValueChange = useCallback((value: Key | null) => {
        setKeyForRaw(header, value)

        // Visual Obs only
        if (value && getVisualObservationIndex(header, value) !== null) return;
        const index = [ ...mapRawToKey.entries() ]
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .filter(([ _raw, _key ]) => _key === value)
            .findIndex(([ _raw ]) => _raw === header)
        switch (value) {
            // These fields of visual obs are related to a specific source
            case 'visualObservations-startDistanceMin':
            case 'visualObservations-startDistanceMax':
            case 'visualObservations-endDistanceMin':
            case 'visualObservations-endDistanceMax':
            case 'visualObservations-countMin':
            case 'visualObservations-countMax':
            case 'visualObservations-behaviors':
            case 'visualObservations-reactionsToBoat':
            case 'visualObservations-startDatetime':
            case 'visualObservations-endDatetime':
            case 'visualObservations-source':
            case 'visualObservations-youngPresence':
                setVisualObservationIndex(header, index)
                break;
        }
    }, [ setKeyForRaw, setVisualObservationIndex, getVisualObservationIndex, mapRawToKey, header ])

    const onContactTypeChange = useCallback((value: ContactTypeEnum) => {
        setContactTypeForRaw(header, value)
    }, [ setContactTypeForRaw, header ])

    const remove = useCallback(() => {
        unselectRaw(header)
    }, [ unselectRaw, header ])

    const visualObsIndex = useMemo(() => {
        if (!value) return null
        return getVisualObservationIndex(header, value)
    }, [ value, getVisualObservationIndex, header ])

    const filterHeader = useCallback((itemValue: Key, query: string) => {
        return query.split(/[^A-Za-z]/)
            .reduce((previousValue, currentValue) => previousValue && formatKey(itemValue).includes(currentValue), true)
    }, [ formatKey ])

    return <Th scope="col" top>
        <Field.Root>
            <ButtonGroup spaceBetween>
                <Field.Label>{ header }</Field.Label>
                <Button color="warning" aria-label={ `Remove ${ header }` } onClick={ remove }>
                    <TrashBinTrash weight="Linear" size={ 20 }/>
                </Button>
            </ButtonGroup>
            <ComboboxSelect itemName={ `column` }
                            items={ items }
                            itemToStringLabel={ item => item }
                            itemToStringValue={ item => item }
                            itemToElementLabel={ formatKey }
                            isItemEqualToValue={ (a, b) => formatKey(a) === formatKey(b) }
                            filter={ filterHeader }
                            value={ value ?? null }
                            valuePopover
                            onValueChange={ onValueChange }/>
            { value === 'contacts-contactId' && <Fragment>
                <Field.Root name="contacts-role">
                    <MxCommon.RoleSelect required/>
                </Field.Root>
                <Field.Root name="contacts-contactType">
                    <MxCommon.ContactTypeToggle value={ contactType || ContactTypeEnum.Institution }
                                                onValueChange={ onContactTypeChange }/>
                </Field.Root>
            </Fragment> }
            { visualObsIndex !== null && <Field.Root horizontal className={ styles.Number }>
                <Field.Label>#</Field.Label>
                <Field.Control type="number"
                               min={ 1 }
                               value={ visualObsIndex + 1 }
                               onValueChange={ index => setVisualObservationIndex(header, +index - 1) }/>
            </Field.Root> }
        </Field.Root>
    </Th>
}