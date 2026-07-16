import type { ComboboxRootProps } from '@base-ui/react/combobox';
import type { FunctionComponent, ReactNode } from 'react';
import { CreateDialog } from '@/components/base';


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

export type ComboboxSelectProps<Value, InputData extends Record<string, any> = Record<string, any>, Multiple extends boolean = false> =
    Omit<ComboboxRootProps<Value, Multiple>, 'onValueChange'> & {
    itemName: string
    id?: string
    loading?: boolean
    placeholder?: string
    'data-testid'?: string,
    itemToElementLabel?: (item: Value) => ReactNode,
    onValueChange?: (value: FinalValue<Value, Multiple>) => void
} & Creatable<Value, InputData>

type Creatable<Value, InputData extends Record<string, any> = Record<string, any>> = {
    creatable?: boolean,
    createDialog?: FunctionComponent<CreateDialog.Props<Value, InputData>>
    inputKey?: keyof InputData,
    additionalInput?: Partial<InputData>
}
