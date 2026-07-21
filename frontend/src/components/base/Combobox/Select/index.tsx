import type { ComboboxSelectProps, FinalValue } from '@/components/base/Combobox/Select/types';
import { Combobox, CreateDialog } from '@/components/base';
import { MultipleInputGroup } from './MultipleInputGroup'
import { SingleInputGroup } from './SingleInputGroup'
import { Portal } from './Portal'
import { CreateValue } from './types'
import { useCallback, useEffect, useMemo, useState } from 'react';

export * from './types'

export function ComboboxSelect<Value, InputData extends Record<string, any> = Record<string, any>, Multiple extends boolean = false>({
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
                                                                                                                                         createForm,
                                                                                                                                         additionalInput,
                                                                                                                                         inputKey,
                                                                                                                                         creatable,
                                                                                                                                         ...props
                                                                                                                                     }: ComboboxSelectProps<Value, InputData, Multiple>) {
    const createDialogManager = CreateDialog.useManager()
    const [ query, setQuery ] = useState<string>('');
    const [ selected, _setSelected ] = useState<FinalValue<Value, Multiple>>(value || (multiple ? [] : null) as FinalValue<Value, Multiple>);
    const setSelected = useCallback((data: FinalValue<Value, Multiple>) => {
        onValueChange?.(data)
        _setSelected(data)
    }, [ onValueChange ]);
    useEffect(() => {
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
        if (!creatable || !createForm || !inputKey) return items
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
    }, [ items, itemToStringLabel, createForm, inputKey, query, creatable ]);

    const _onValueChange = useCallback((data: FinalValue<Value | CreateValue, Multiple>) => {
        if (!data || inputKey === undefined) return setSelected(data as FinalValue<Value, Multiple>)
        if (multiple) {
            const initialData = data as Value[]
            const createData = initialData.find(d => (d as CreateValue).__create)
            if (createForm && (createData as CreateValue).__create) {
                createDialogManager.create<Value, InputData>({
                    title: `New ${ itemName }`,
                    form: createForm,
                    input: {
                        ...additionalInput,
                        [inputKey]: (createData as CreateValue).__create,
                    } as InputData,
                }).then(newData => setSelected([ ...selected as Value[], newData ] as FinalValue<Value, Multiple>))
                setQuery('');
                return
            }
        }

        if (!multiple && createForm && (data as Value | CreateValue as CreateValue).__create) {
            createDialogManager.create<Value, InputData>({
                title: `New ${ itemName }`,
                form: createForm,
                input: {
                    ...additionalInput,
                    [inputKey]: (data as Value | CreateValue as CreateValue).__create,
                } as InputData,
            }).then(newData => setSelected(newData as FinalValue<Value, Multiple>))
            setQuery('');
            return
        }

        setSelected(data as FinalValue<Value, Multiple>)
    }, [ createDialogManager, createForm, query, setSelected, itemName, inputKey, additionalInput, multiple, selected ])

    return <Combobox.Root multiple={ multiple }
                          itemToStringLabel={ _itemToStringLabel }
                          readOnly={ readOnly }
                          disabled={ disabled }
                          items={ itemsForView }
                          inputValue={ query }
                          value={ selected as any }
                          onInputValueChange={ setQuery }
                          onValueChange={ _onValueChange }
                          { ...props as Partial<ComboboxSelectProps<Value | CreateValue, InputData, Multiple>> }>

        { multiple ? <MultipleInputGroup id={ id }
                                         itemName={ itemName }
                                         itemToElementLabel={ _itemToElementLabel }/> :
            <SingleInputGroup id={ id }
                              loading={ loading }
                              itemToElementLabel={ _itemToElementLabel }
                              disabled={ disabled }
                              readOnly={ readOnly }
                              itemName={ itemName }
                              placeholder={ placeholder }/> }

        <Portal itemName={ itemName }
                itemToElementLabel={ _itemToElementLabel }/>
    </Combobox.Root>
}