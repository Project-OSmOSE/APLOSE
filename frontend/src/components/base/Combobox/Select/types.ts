import { ReactNode } from "react";
import { Combobox } from '@/components/base'


export type CreateValue = {
    __create: string,
    label: string,
    id: `create:${ string }`
}

export type BaseComboboxSelectProps<Value, Multiple extends boolean = false> =
    Omit<Combobox.RootProps<Value, Multiple>, 'onValueChange'> & {
    itemName: string
    id?: string
    loading?: boolean
    placeholder?: string
    'data-testid'?: string,
    itemToElementLabel?: (item: Value) => ReactNode,
    onValueChange?: (value: Multiple extends true ? Value[] : (Value | null)) => void
}


export type ComboboxValueType<Value, Multiple extends boolean | undefined> = Multiple extends true ? Value[] : Value;
export type FinalValue<Value, Multiple extends boolean = false> = Multiple extends true ? Value[] : (Value | null)

export type ComboboxSelectProps<Value, Multiple extends boolean = false> = // TODO: check there is no more InputData type precision
    Omit<Combobox.RootProps<Value, Multiple>, 'onValueChange'> & {
    itemName: string
    id?: string
    loading?: boolean
    placeholder?: string
    'data-testid'?: string,
    itemToElementLabel?: (item: Value) => ReactNode,
    className?: string,
    onValueChange?: (value: FinalValue<Value, Multiple>) => void,
    valuePopover?: boolean,
    fixedValue?: ComboboxValueType<Value, Multiple>,
    fixedValueString?: Multiple extends true ? string[] : string;
    defaultStringLabel?: Multiple extends true ? string[] : string;
    defaultValueString?: Multiple extends true ? string[] : string;
} & Creatable<Value>
    & Pick<Combobox.PositionerProps, 'side'>

type Creatable<Value> = {
    creatable?: boolean,
    create?: (input: string) => Promise<Value | null | undefined>
}

// TODO: input = (data as Value | CreateValue as CreateValue).__create