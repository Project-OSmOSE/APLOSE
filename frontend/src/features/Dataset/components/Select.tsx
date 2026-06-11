import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { Combobox, ComboboxRootProps } from '@/components/base/Combobox'

import type { AllDatasetsQuery } from '../api'
import * as API from '../api'

type N<T> = NonNullable<T>
export type SelectValue = N<N<AllDatasetsQuery['allDatasets']>['results'][number]>

type RootProps = ComboboxRootProps<SelectValue, false>
const ComboboxRoot: React.FC<RootProps> = (props) => <Combobox.Root { ...props }/>

type DatasetSelectProps =
    Omit<RootProps, 'items' | 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue'>
    & { id?: string }
export const Select: React.FC<DatasetSelectProps> = ({ id, ...props }) => {
    const { data: datasets } = useQuery(API.allQuery)

    return (
        <ComboboxRoot items={ datasets }
                      itemToStringValue={ (itemValue: SelectValue) => itemValue.id }
                      itemToStringLabel={ (itemValue: SelectValue) => itemValue.name }
                      isItemEqualToValue={ (itemValue: SelectValue, value: SelectValue) => itemValue.id == value.id }
                      { ...props }>

            <Combobox.InputGroup>
                <Combobox.Input placeholder="Select a dataset" id={ id }/>
                <Combobox.Clear/>
                <Combobox.Trigger/>
            </Combobox.InputGroup>

            <Combobox.Portal>
                <Combobox.Positioner>
                    <Combobox.Popup data-testid='dataset-select-popup'>
                        <Combobox.Empty>No dataset found.</Combobox.Empty>
                        <Combobox.List>
                            { (item: SelectValue) => (
                                <Combobox.Item key={ item.id } value={ item }>
                                    <Combobox.ItemIndicator/>
                                    <span>{ item.name }</span>
                                </Combobox.Item>
                            ) }
                        </Combobox.List>
                    </Combobox.Popup>
                </Combobox.Positioner>
            </Combobox.Portal>
        </ComboboxRoot>
    )
}