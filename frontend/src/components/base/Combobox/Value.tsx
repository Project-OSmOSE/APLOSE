import React from 'react';
import { Combobox, type ComboboxValueProps as BaseProps } from '@base-ui/react/combobox';
import { Popover } from '../Popover';


export type ComboboxValueProps = BaseProps & { popover?: boolean }

export const Value: React.FC<ComboboxValueProps> = React.memo(({ children, popover, ...props }) => {
    if (popover && typeof children === 'function') {
        return <Combobox.Value { ...props }>
            { (value) => <Popover.Root>
                <Popover.Trigger render={ <div/> } nativeButton={ false }>{ children(value) }</Popover.Trigger>
                <Popover.Content>{ children(value) }</Popover.Content>
            </Popover.Root> }
        </Combobox.Value>
    }
    return <Combobox.Value { ...props } children={ children }/>

})
