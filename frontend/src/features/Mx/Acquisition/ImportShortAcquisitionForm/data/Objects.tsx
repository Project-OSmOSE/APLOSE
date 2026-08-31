import { useCallback, useMemo, useState } from 'react';
import { useImportShortAcquisitionContext } from '../Root';
import type { DataControlParams } from './type';
import type { ComboboxSelectProps } from '@/components/base';

export const useObjectSelect = ({ header, rowIndex, data, name }: DataControlParams) => {
    const {
        getDefaultValue,
        setDefaultValue,
    } = useImportShortAcquisitionContext()

    const defaultValue = useMemo(() => {
        return getDefaultValue(header, data)
    }, [ getDefaultValue, header, data, rowIndex ])

    const [ value, _setValue ] = useState<any | null | undefined>(undefined);
    const setValue = useCallback((value: any | null) => {
        _setValue(value)
        if (value !== null) setDefaultValue(header, data, value)
    }, [ setDefaultValue, _setValue, header, data, rowIndex ])

    return useMemo(() => ({
        value: value === undefined ? defaultValue : value,
        defaultStringLabel: data,
        onValueChange: setValue,
        creatable: true,
        valuePopover: true,
        name,
    } satisfies Partial<ComboboxSelectProps<any>>), [ value, defaultValue, data, setValue, name ])
}
