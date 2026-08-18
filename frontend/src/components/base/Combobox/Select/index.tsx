import type { ComboboxSelectProps, FinalValue } from '@/components/base/Combobox/Select/types';
import { Combobox } from '@/components/base';
import { MultipleInputGroup } from './MultipleInputGroup'
import { SingleInputGroup } from './SingleInputGroup'
import { Portal } from './Portal'
import { CreateValue } from './types'
import { useCallback, useEffect, useMemo, useState } from 'react';

export * from './types'

export function ComboboxSelect<Value, Multiple extends boolean = false>({
                                                                            id,
                                                                            items,
                                                                            itemName,
                                                                            itemToStringLabel,
                                                                            itemToElementLabel,
                                                                            multiple,
                                                                            loading,
                                                                            disabled,
                                                                            readOnly,
                                                                            placeholder,
                                                                            onValueChange,
                                                                            value,
                                                                            create,
                                                                            creatable,
                                                                            className,
                                                                            valuePopover,
                                                                            ...props
                                                                        }: ComboboxSelectProps<Value, Multiple>) {
    const [ query, setQuery ] = useState<string>('');
    const [ selected, _setSelected ] = useState<FinalValue<Value, Multiple>>(value || (multiple ? [] : null) as FinalValue<Value, Multiple>);
    const setSelected = useCallback((data: FinalValue<Value, Multiple>) => {
        onValueChange?.(data)
        _setSelected(data)
    }, [ onValueChange ]);
    useEffect(() => {
        if (value !== selected)
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelected(value || (multiple ? [] : null) as FinalValue<Value, Multiple>)
    }, [ value ]);

    const _itemToStringLabel = useCallback((data: Value | CreateValue | null) => {
        if (!data) return '-';
        if ((data as CreateValue).__create) return (data as CreateValue).label;
        return itemToStringLabel?.(data as Value) ?? JSON.stringify(data)
    }, [ itemToStringLabel ])

    const _itemToElementLabel = useCallback((data: Value | CreateValue | null) => {
        if (!data) return undefined;
        if ((data as CreateValue).__create) return (data as CreateValue).label;
        return itemToElementLabel?.(data as Value) ?? _itemToStringLabel(data)
    }, [ itemToElementLabel, _itemToStringLabel ])

    const itemsForView: readonly (Value | CreateValue)[] = useMemo(() => {
        if (!items) return []
        if (!creatable || !create) return items
        const trimmed = query.trim();
        if (trimmed === '') return items
        const lowered = trimmed.toLocaleLowerCase();
        const exactExists = items.some((l: Value) => (itemToStringLabel?.(l) ?? JSON.stringify(l)).trim().toLocaleLowerCase() === lowered);
        if (exactExists) return items
        return [ ...items, {
            __create: trimmed,
            id: `create:${ lowered }`,
            label: `Create "${ trimmed }"`,
        } as CreateValue ];
    }, [ items, itemToStringLabel, create, query, creatable ]);

    const _onValueChange = useCallback((data: FinalValue<Value | CreateValue, Multiple>) => {
        if (!data || create === undefined) return setSelected(data as FinalValue<Value, Multiple>)
        if (multiple) {
            const initialData = data as Value[]
            const createData = initialData.find(d => (d as CreateValue).__create)
            if ((createData as CreateValue).__create) {
                create((createData as CreateValue).__create).then(newData => {
                    if (!newData) return;
                    setSelected([ ...selected as Value[], newData ] as FinalValue<Value, Multiple>)
                })
                setQuery('');
                return
            }
        }

        if (!multiple && (data as Value | CreateValue as CreateValue).__create) {
            create((data as Value | CreateValue as CreateValue).__create).then(newData => {
                if (!newData) return;
                setSelected(newData as FinalValue<Value, Multiple>)
            })
            setQuery('');
            return
        }

        setSelected(data as FinalValue<Value, Multiple>)
    }, [ create, query, setSelected, itemName, multiple, selected ])

    return <Combobox.Root multiple={ multiple }
                          itemToStringLabel={ _itemToStringLabel }
                          readOnly={ readOnly }
                          disabled={ disabled }
                          items={ itemsForView }
                          inputValue={ query }
                          value={ selected as any }
                          onInputValueChange={ setQuery }
                          onValueChange={ _onValueChange }
                          { ...props as Partial<ComboboxSelectProps<Value | CreateValue, Multiple>> }>

        { multiple ? <MultipleInputGroup id={ id }
                                         className={ className }
                                         itemName={ itemName }
                                         itemToElementLabel={ _itemToElementLabel }/> :
            <SingleInputGroup id={ id }
                              className={ className }
                              loading={ loading }
                              itemToElementLabel={ _itemToElementLabel }
                              disabled={ disabled }
                              readOnly={ readOnly }
                              itemName={ itemName }
                              valuePopover={ valuePopover }
                              placeholder={ placeholder }/> }

        <Portal itemName={ itemName }
                itemToElementLabel={ _itemToElementLabel }/>
    </Combobox.Root>
}