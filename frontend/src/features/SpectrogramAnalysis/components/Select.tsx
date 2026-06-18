import React, { Fragment, useCallback, useState } from 'react';
import { queryOptions, useQuery } from '@tanstack/react-query';

import { Combobox, ComboboxRootProps } from '@/components/base/Combobox'

import * as API from '../api'
import { type AllSpectrogramAnalysisForDatasetQuery } from '../api'
import { queryKeys } from '@/api/queryKeys';

type N<T> = NonNullable<T>
export type SelectValue = N<N<AllSpectrogramAnalysisForDatasetQuery['allSpectrogramAnalysis']>['results'][number]>
type RootProps = ComboboxRootProps<SelectValue, true>
const ComboboxRoot: React.FC<RootProps> = (props) => <Combobox.Root multiple { ...props }/>

function toStr(value: SelectValue) {
    return `${ value.name } (${ value.colormap.name })`
}

type AnalysisSelectProps =
    Omit<RootProps, 'items' | 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue'>
    & {
    datasetID?: string, id?: string, fillOnLoad?: boolean,
    onValueChange?: ((value: SelectValue[]) => void);
}
export const Select: React.FC<AnalysisSelectProps> = ({
                                                          datasetID,
                                                          id,
                                                          fillOnLoad,
                                                          value,
                                                          onValueChange,
                                                          ...props
                                                      }) => {

    const [ values, setValues ] = useState<SelectValue[]>(value ?? []);
    const onChange = useCallback((values: SelectValue[]) => {
        setValues(values);
        if (onValueChange) onValueChange(values);
    }, [ setValues, onValueChange ])
    const queryFn = useCallback(async () => {
        if (!datasetID) return;
        const analysis = await API.allForDatasetQueryFn({ datasetID })
        if (fillOnLoad) onChange(analysis)
        return analysis
    }, [ datasetID, onChange, fillOnLoad ])
    const {
        data: analysis,
        isPending,
        isSuccess,
    } = useQuery(queryOptions({
        queryKey: queryKeys.analysis.allForDataset({ datasetID: datasetID ?? '' }),
        queryFn,
        enabled: !!datasetID,
    }))

    return (
        <ComboboxRoot value={ values }
                      onValueChange={ onChange }
                      items={ analysis }
                      itemToStringValue={ itemValue => itemValue.id }
                      itemToStringLabel={ toStr }
                      disabled={ !datasetID || !isSuccess }
                      isItemEqualToValue={ (itemValue: SelectValue, value: SelectValue) => itemValue.id == value.id }
                      { ...props }>

            <Combobox.InputGroup>
                <Combobox.Chips>
                    <Combobox.Value>
                        { (value: SelectValue[]) => (
                            <Fragment>
                                <Combobox.Input id={ id } placeholder={ value.length > 0 ? '' : 'Select analysis' }/>
                                { value.map((analysis) => (
                                    <Combobox.Chip key={ analysis.id } aria-label={ toStr(analysis) }>
                                        { toStr(analysis) }
                                    </Combobox.Chip>
                                )) }
                            </Fragment>
                        ) }
                    </Combobox.Value>
                </Combobox.Chips>

                { datasetID && isPending && <Combobox.Loader/> }
            </Combobox.InputGroup>

            <Combobox.Portal>
                <Combobox.Positioner side="top">
                    <Combobox.Popup>
                        <Combobox.Empty>No analysis found.</Combobox.Empty>
                        <Combobox.List>
                            { (item: SelectValue) => (
                                <Combobox.Item key={ item.id } value={ item }>
                                    <Combobox.ItemIndicator/>
                                    <span>{ toStr(item) }</span>
                                </Combobox.Item>
                            ) }
                        </Combobox.List>
                    </Combobox.Popup>
                </Combobox.Positioner>
            </Combobox.Portal>
        </ComboboxRoot>
    )
}