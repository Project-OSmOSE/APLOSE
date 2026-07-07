import React, { Fragment, useCallback, useState } from 'react';
import { queryOptions, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/api/queryKeys';
import { Combobox } from '@/components/base'

import * as API from '../api'

type N<T> = NonNullable<T>
export type ComboboxSelectValue = N<N<API.AllSpectrogramAnalysisForDatasetQuery['allSpectrogramAnalysis']>['results'][number]>

type RootProps = Combobox.ComboboxRootProps<ComboboxSelectValue, true>
const ComboboxRoot: React.FC<RootProps> = (props) => <Combobox.Root multiple { ...props }/>

function toStr(value: ComboboxSelectValue) {
    return `${ value.name } (${ value.colormap.name })`
}

type AnalysisSelectProps =
    Omit<RootProps, 'items' | 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue'>
    & {
    datasetID?: string, id?: string, fillOnLoad?: boolean,
    onValueChange?: ((value: ComboboxSelectValue[]) => void);
}
export const ComboboxSelectMultiple: React.FC<AnalysisSelectProps> = ({
                                                          datasetID,
                                                          id,
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
                      isItemEqualToValue={ (itemValue: ComboboxSelectValue, value: ComboboxSelectValue) => itemValue.id == value.id }
                      { ...props }>

            <Combobox.InputGroup>
                <Combobox.Chips>
                    <Combobox.Value>
                        { (value: ComboboxSelectValue[]) => (
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
                            { (item: ComboboxSelectValue) => (
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