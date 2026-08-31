import React, { useCallback, useMemo, useState } from 'react';
import { Field, Note } from '@/components/base';
import { useImportShortAcquisitionContext } from '../Root';
import type { FieldControlProps } from '@/components/base/Field/Control';
import styles from '../styles.module.scss';
import type { DataControlParams } from './type';

function anyToDate(data: any): string | undefined {
    if (typeof data === 'string') return data.replaceAll('Z', '')
    return data
}

export const DatetimeInput: React.FC<DataControlParams & Partial<FieldControlProps>> = ({
                                                                                            header,
                                                                                            rowIndex,
                                                                                            data,
                                                                                            ...controlParams
                                                                                        }) => {

    const {
        getDefaultValue,
        setDefaultValue,
    } = useImportShortAcquisitionContext()

    const [ value, _setValue ] = useState<string | undefined>(undefined);
    const setValue = useCallback((value: string) => {
        _setValue(value)
        setDefaultValue(header, data, value)
    }, [ setDefaultValue, _setValue, header, data, rowIndex ])

    const defaultValue = useMemo(() => {
        return getDefaultValue(header, data) ?? anyToDate(data)
    }, [ getDefaultValue, header, data, rowIndex ])

    return <div className={ styles.Horizontal }>
        <Field.Control type="datetime-local"
                       value={ value === undefined ? defaultValue : value }
                       onValueChange={ setValue }
                       { ...controlParams }/>
        <Note>UTC</Note>
    </div>
}

