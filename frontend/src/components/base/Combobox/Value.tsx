import React from 'react';
import { Combobox, type ComboboxValueProps as BaseProps } from '@base-ui/react/combobox';
import { Popover } from '../Popover';


export type ComboboxValueProps = BaseProps

export const Value: React.FC<ComboboxValueProps> = React.memo(({ children, ...props }) => (
    <Combobox.Value { ...props }>
        { (value) => typeof children === 'function' ?
            <Popover.Root>
                <Popover.Trigger render={ <div/> } nativeButton={ false }>{ children(value) }</Popover.Trigger>
                <Popover.Content>{ children(value) }</Popover.Content>
            </Popover.Root>
            : children }
    </Combobox.Value>
))
