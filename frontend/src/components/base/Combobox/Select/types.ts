import type { ComboboxRootProps } from '@base-ui/react/combobox';
import type { ReactNode } from 'react';


export type CreateValue = {
    __create: string,
    label: string,
    id: `create:${ string }`
}

export type BaseComboboxSelectProps<Value, Multiple extends boolean = false> =
    Omit<ComboboxRootProps<Value, Multiple>, 'onValueChange'> & {
    itemName: string
    id?: string
    loading?: boolean
    placeholder?: string
    'data-testid'?: string,
    itemToElementLabel?: (item: Value) => ReactNode,
    onValueChange?: (value: Multiple extends true ? Value[] : (Value | null)) => void
}


export type FinalValue<Value, Multiple extends boolean = false> = Multiple extends true ? Value[] : (Value | null)

export type ComboboxSelectProps<Value, Multiple extends boolean = false> = // TODO: check there is no more InputData type precision
    Omit<ComboboxRootProps<Value, Multiple>, 'onValueChange'> & {
    itemName: string
    id?: string
    loading?: boolean
    placeholder?: string
    'data-testid'?: string,
    itemToElementLabel?: (item: Value) => ReactNode,
    className?: string,
    onValueChange?: (value: FinalValue<Value, Multiple>) => void
} & Creatable<Value>

type Creatable<Value> = {
    creatable?: boolean,
    create?: (input: string) => Promise<Value | null | undefined>
}

// TODO: input = (data as Value | CreateValue as CreateValue).__create