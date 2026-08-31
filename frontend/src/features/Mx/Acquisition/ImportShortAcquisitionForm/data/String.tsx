import React, { useCallback, useMemo, useState } from 'react';
import { Field } from '@/components/base';
import { useImportShortAcquisitionContext } from '../Root';
import type { FieldControlProps } from '@/components/base/Field/Control';
import type { DataControlParams } from './type';


export const StringInput: React.FC<DataControlParams & Partial<FieldControlProps>> = ({
                                                                                          header,
                                                                                          rowIndex,
                                                                                          data,
                                                                                          type = 'text',
                                                                                          ...controlParams
                                                                                      }) => {

    const {
        getDefaultValue,
        setDefaultValue,
        header: { getKeyForRaw },
    } = useImportShortAcquisitionContext()

    const defaultValue = useMemo(() => {
        const defaultValue = getDefaultValue(header, data) ?? data
        switch (getKeyForRaw(header)) {
            case 'extraInformation':
            case 'deployment-description':
            case 'visualObservations-additionalInformation':
                if (defaultValue) return `${ header }: ${ defaultValue }`
                return undefined
            default:
                return defaultValue
        }
    }, [ getDefaultValue, header, data, rowIndex ])

    const [ value, _setValue ] = useState<string | undefined>(undefined);
    const setValue = useCallback((value: string) => {
        _setValue(value)
        setDefaultValue(header, data, value)
    }, [ setDefaultValue, _setValue, header, data, rowIndex ])

    return <Field.Control type={ type }
                          value={ value === undefined ? defaultValue : value }
                          onValueChange={ setValue }
                          { ...controlParams }/>
}
