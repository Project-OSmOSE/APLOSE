import React, { Fragment } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Combobox, ComboboxRootProps } from '@/components/base/Combobox'

import * as API from '../api'
import { type AllSpectrogramAnalysisForDatasetQuery } from '../api'

type N<T> = NonNullable<T>
export type SelectValue = N<N<AllSpectrogramAnalysisForDatasetQuery['allSpectrogramAnalysis']>['results'][number]>
type RootProps = ComboboxRootProps<SelectValue, true>
const ComboboxRoot: React.FC<RootProps> = (props) => <Combobox.Root multiple { ...props }/>

function toStr(value: SelectValue) {
    return `${value.name} (${value.colormap.name})`
}

type AnalysisSelectProps =
    Omit<RootProps, 'items' | 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue'>
    & { datasetID?: string, id?: string }
export const Select: React.FC<AnalysisSelectProps> = ({ datasetID, id, ...props }) => {
    const {
        data: analysis,
        isPending,
        isSuccess,
    } = useQuery({
        ...API.allForDatasetQuery({ datasetID: datasetID ?? '' }),
        enabled: !!datasetID,
    })

    return (
        <ComboboxRoot items={ analysis }
                      itemToStringValue={ toStr }
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
                <Combobox.Positioner>
                    <Combobox.Popup>
                        <Combobox.Empty>No dataset found.</Combobox.Empty>
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