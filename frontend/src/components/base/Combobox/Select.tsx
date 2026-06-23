import React, { type ReactNode } from 'react';
import type { ComboboxRootProps } from '@base-ui/react/combobox'
import { Combobox } from './index';


export type ComboboxSelectProps<Value, Multiple extends boolean | undefined = false> =
    ComboboxRootProps<Value, Multiple>
    & {
    itemName: string
    id?: string
    placeholder?: string
    'data-testid'?: string,
    itemToElementValue?: (item: Value) => ReactNode,
}

export function ComboboxSelect<Value, Multiple extends boolean | undefined = false>({
                                                                                        itemName,
                                                                                        id,
                                                                                        placeholder,
                                                                                        itemToStringLabel,
                                                                                        itemToElementValue,
                                                                                        ...props
                                                                                    }: ComboboxSelectProps<Value, Multiple>): React.JSX.Element {
    return (
        <Combobox.Root itemToStringLabel={ itemToStringLabel } { ...props }>

            <Combobox.InputGroup>
                <Combobox.Input placeholder={ placeholder ? placeholder : `Select a ${ itemName }` } id={ id }/>
                <Combobox.Clear/>
                <Combobox.Trigger/>
                { itemToElementValue && <Combobox.Value children={ item => itemToElementValue(item) }/> }
            </Combobox.InputGroup>

            <Combobox.Portal>
                <Combobox.Positioner>
                    <Combobox.Popup data-testid={ `${ itemName.replace(' ', '-') }-select-popup` }>
                        <Combobox.Empty>No { itemName } found.</Combobox.Empty>
                        <Combobox.List>
                            { (item, k) => (
                                <Combobox.Item key={ k } value={ item }>
                                    <Combobox.ItemIndicator/>
                                    { itemToElementValue ? itemToElementValue(item) :
                                        <span>{ itemToStringLabel ? itemToStringLabel(item) : item }</span> }
                                </Combobox.Item>
                            ) }
                        </Combobox.List>
                    </Combobox.Popup>
                </Combobox.Positioner>
            </Combobox.Portal>
        </Combobox.Root>
    )
}