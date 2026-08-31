import React, { useCallback, useMemo, useState } from 'react';
import { Field, Note } from '@/components/base';
import { useImportShortAcquisitionContext } from '../Root';
import styles from '../styles.module.scss';
import type { FieldControlProps } from '@/components/base/Field/Control';
import type { DataControlParams } from './type';

function anyToNumber(data: any): number | undefined {
    const value = parseFloat(data)
    if (isNaN(value)) return undefined
    return value
}

export const NumberInput: React.FC<DataControlParams & { unit?: string } & Partial<FieldControlProps>> = ({
                                                                                                              header,
                                                                                                              rowIndex,
                                                                                                              data,
                                                                                                              unit,
                                                                                                              ...controlParams
                                                                                                          }) => {

    const {
        getDefaultValue,
        setDefaultValue,
    } = useImportShortAcquisitionContext()

    const defaultValue = useMemo(() => {
        return getDefaultValue(header, data) ?? anyToNumber(data)
    }, [ getDefaultValue, header, data, rowIndex ])

    const [ value, _setValue ] = useState<string | undefined>(undefined);
    const setValue = useCallback((value: string) => {
        _setValue(value)
        setDefaultValue(header, data, value)
    }, [ setDefaultValue, _setValue, header, data, rowIndex ])

    const control = useMemo(() =>
        <Field.Control type="number"
                       value={ (value === undefined ? defaultValue : value) ?? undefined }
                       onValueChange={ setValue }
                       { ...controlParams }/>, [ setValue, value, data, controlParams ])

    if (unit) {
        return <div className={ styles.Horizontal }>
            { control }
            <Note>{ unit }</Note>
        </div>
    }
    return control
}
