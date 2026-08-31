import React, { useCallback, useMemo, useState } from 'react';
import { Checkbox, Toggle } from '@/components/base';
import { useImportShortAcquisitionContext } from '../Root';
import type { DataControlParams } from './type';

function anyToBool(data: any): boolean | null {
    if (typeof data === 'boolean') return data
    if (typeof data === 'string') {
        if (data == 'true' || data == 'True') return true
        if (data == 'false' || data == 'False') return false
    }
    return null
}

export const BooleanCheckbox: React.FC<DataControlParams> = ({ header, rowIndex, data, name }) => {

    const {
        getDefaultValue,
        setDefaultValue,
    } = useImportShortAcquisitionContext()

    const [ value, _setValue ] = useState<boolean | undefined>(undefined);
    const setValue = useCallback((value: boolean) => {
        _setValue(value)
        setDefaultValue(header, data, value)
    }, [ setDefaultValue, _setValue, header, data, rowIndex ])

    const defaultValue = useMemo(() => {
        return getDefaultValue(header, data) ?? anyToBool(data) ?? false
    }, [ getDefaultValue, header, data, rowIndex ])

    return <Checkbox checked={ value === undefined ? defaultValue : value }
                     name={ name }
                     onCheckedChange={ setValue }/>
}

export const BooleanToggle: React.FC<DataControlParams> = ({ header, rowIndex, data, name }) => {

    const {
        getDefaultValue,
        setDefaultValue,
    } = useImportShortAcquisitionContext()

    const defaultValue = useMemo(() => {
        return getDefaultValue(header, data) ?? anyToBool(data)
    }, [ getDefaultValue, header, data, rowIndex ])

    const [ value, _setValue ] = useState<boolean | null | undefined>(undefined);
    const setValue = useCallback((value: boolean | null) => {
        _setValue(value)
        if (value !== null) setDefaultValue(header, data, value)
    }, [ setDefaultValue, _setValue, header, data, rowIndex ])

    return <Toggle.Group value={ value === undefined ? defaultValue : value }
                         name={ name }
                         onValueChange={ setValue }>
        <Toggle.Item value={ null }>I don't known</Toggle.Item>
        <Toggle.Item value={ false }>No</Toggle.Item>
        <Toggle.Item value={ true }>Yes</Toggle.Item>
    </Toggle.Group>
}
