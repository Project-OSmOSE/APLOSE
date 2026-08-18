import React, { Fragment, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Combobox } from '@/components/base';
import * as API from '../api';
import type { Maybe } from '@/api';

const ComboboxRoot: React.FC<Combobox.ComboboxRootProps<API.LabelFragment, true>> = (props) => <Combobox.Root
    multiple { ...props }/>

type Props =
    Omit<Combobox.ComboboxRootProps<API.LabelFragment, true>, 'items' | 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue'>
    & {
    id?: string,
    defaultValueIDs?: Maybe<string>[],
    valuePopover?: boolean,
}
export const LabelMultiCombobox: React.FC<Props> = ({ id, defaultValue, defaultValueIDs, valuePopover, ...props }) => {
    const {
        data: labels,
        isPending,
    } = useQuery(API.allLabels)

    const _defaultValue = useMemo(() => defaultValue || labels?.filter(l => defaultValueIDs?.includes(l.id)), [ defaultValue, defaultValueIDs, labels ])

    return (
        <ComboboxRoot items={ labels }
                      itemToStringValue={ itemValue => itemValue.id }
                      itemToStringLabel={ itemValue => itemValue.displayName }
                      disabled={ isPending }
                      defaultValue={ _defaultValue }
                      isItemEqualToValue={ (itemValue, value) => itemValue.id == value.id }
                      { ...props }>

            <Combobox.InputGroup>
                <Combobox.Chips>
                    <Combobox.Value popover={ valuePopover }>
                        { (value: API.LabelFragment[]) => (
                            <Fragment>
                                <Combobox.Input id={ id } placeholder={ value.length > 0 ? '' : 'Select label' }/>
                                { value.map((label) => (
                                    <Combobox.Chip key={ label.id } aria-label={ label.displayName }>
                                        { label.displayName }
                                    </Combobox.Chip>
                                )) }
                            </Fragment>
                        ) }
                    </Combobox.Value>
                </Combobox.Chips>

                { isPending && <Combobox.Loader/> }
            </Combobox.InputGroup>

            <Combobox.Portal>
                <Combobox.Positioner side="top">
                    <Combobox.Popup>
                        <Combobox.Empty>No analysis found.</Combobox.Empty>
                        <Combobox.List>
                            { (item: API.LabelFragment) => (
                                <Combobox.Item key={ item.id } value={ item }>
                                    <Combobox.ItemIndicator/>
                                    <span>{ item.displayName }</span>
                                </Combobox.Item>
                            ) }
                        </Combobox.List>
                    </Combobox.Popup>
                </Combobox.Positioner>
            </Combobox.Portal>
        </ComboboxRoot>
    )
}