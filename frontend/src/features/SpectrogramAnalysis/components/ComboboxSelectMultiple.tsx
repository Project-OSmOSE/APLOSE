import React, { useCallback, useState } from 'react';
import { queryOptions, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/api/queryKeys';
import { ComboboxSelect, type ComboboxSelectProps } from '@/components/base'

import * as API from '../api'

type N<T> = NonNullable<T>
export type ComboboxSelectValue = N<N<API.AllSpectrogramAnalysisForDatasetQuery['allSpectrogramAnalysis']>['results'][number]>


type AnalysisSelectProps =
    Omit<ComboboxSelectProps<ComboboxSelectValue, true>, 'itemName' | 'items' | 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue'>
    & {
    datasetID?: string, id?: string, fillOnLoad?: boolean,
    onValueChange?: ((value: ComboboxSelectValue[]) => void);
}
export const ComboboxSelectMultiple: React.FC<AnalysisSelectProps> = ({
                                                                          datasetID,
                                                                          fillOnLoad,
                                                                          value,
                                                                          onValueChange,
                                                                          ...props
                                                                      }) => {

    const [ values, setValues ] = useState<ComboboxSelectValue[]>(value ?? []);
    const onChange = useCallback((values: ComboboxSelectValue[]) => {
        setValues(values);
        if (onValueChange) onValueChange(values);
    }, [ setValues, onValueChange ])
    const queryFn = useCallback(async () => {
        if (!datasetID) return;
        const analysis = await API.allForDatasetQueryFn({ datasetID })
        if (fillOnLoad) onChange(analysis)
        return analysis
    }, [ datasetID, onChange, fillOnLoad ])
    const { data: analysis, isFetching, isSuccess } = useQuery(queryOptions({
        queryKey: queryKeys.analysis.allForDataset({ datasetID: datasetID ?? '' }),
        queryFn,
        enabled: !!datasetID,
    }))

    return <ComboboxSelect itemName="spectrogram analysis"
                           multiple
                           loading={ isFetching }
                           value={ values }
                           onValueChange={ onChange }
                           items={ analysis }
                           itemToStringValue={ itemValue => itemValue.id }
                           itemToStringLabel={ itemValue => `${ itemValue.name } (${ itemValue.colormap.name })` }
                           disabled={ !datasetID || !isSuccess }
                           isItemEqualToValue={ (itemValue: ComboboxSelectValue, value: ComboboxSelectValue) => itemValue.id == value.id }
                           { ...props }/>
}