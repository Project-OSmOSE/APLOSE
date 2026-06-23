import React from 'react';
import type { ComboboxRootProps } from '@base-ui/react/combobox'
import { Combobox } from './index';


export type ComboboxSelectProps<Value> = ComboboxRootProps<Value, false> & {
    itemName: string
    id?: string
    placeholder?: string
    'data-testid'?: string
}

export function ComboboxSelect<Value>({
                                          itemName,
                                          id,
                                          itemToStringLabel,
                                          ...props
                                      }: ComboboxSelectProps<Value>): React.JSX.Element {
    return (
        <Combobox.Root itemToStringLabel={ itemToStringLabel } { ...props }>

            <Combobox.InputGroup>
                <Combobox.Input placeholder={ `Select a ${ itemName }` } id={ id }/>
                <Combobox.Clear/>
                <Combobox.Trigger/>
            </Combobox.InputGroup>

            <Combobox.Portal>
                <Combobox.Positioner>
                    <Combobox.Popup data-testid={ `${ itemName.replace(' ', '-') }-select-popup` }>
                        <Combobox.Empty>No { itemName } found.</Combobox.Empty>
                        <Combobox.List>
                            { (item, k) => (
                                <Combobox.Item key={ k } value={ item }>
                                    <Combobox.ItemIndicator/>
                                    <span>{ itemToStringLabel ? itemToStringLabel(item) : item }</span>
                                </Combobox.Item>
                            ) }
                        </Combobox.List>
                    </Combobox.Popup>
                </Combobox.Positioner>
            </Combobox.Portal>
        </Combobox.Root>
    )
}