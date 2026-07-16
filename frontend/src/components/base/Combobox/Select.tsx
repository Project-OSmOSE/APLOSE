import React, {
    Fragment,
    type FunctionComponent,
    type ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import type { ComboboxRootProps } from '@base-ui/react/combobox'
import { Combobox } from './index';
import { CreateDialog } from '../CreateDialog'
import styles from './Combobox.module.scss'
import { Spinner } from '@/components/base';

export type CreateValue = {
    __create: string,
    label: string,
    id: `create:${ string }`
}

export type ComboboxSelectProps<Value, Multiple extends boolean | undefined = false> =
    ComboboxRootProps<Value, Multiple> & {
    itemName: string
    id?: string
    loading?: boolean
    placeholder?: string
    'data-testid'?: string,
    itemToElementLabel?: (item: Value) => ReactNode,
}

type PortalProps<Value, Multiple extends boolean | undefined = false> = Pick<ComboboxSelectProps<Value, Multiple>, 'itemName' | 'itemToElementLabel' | 'itemToStringLabel'>

function Portal<Value, Multiple extends boolean | undefined = false>({
                                                                         itemName,
                                                                         itemToElementLabel,
                                                                         itemToStringLabel,
                                                                     }: PortalProps<Value, Multiple>) {
    return <Combobox.Portal>
        <Combobox.Positioner>
            <Combobox.Popup data-testid={ `${ itemName.replace(' ', '-') }-select-popup` }>
                <Combobox.Empty>No { itemName } found.</Combobox.Empty>
                <Combobox.List>
                    { (item, k) => (
                        <Combobox.Item key={ k } value={ item }>
                            <Combobox.ItemIndicator/>
                            { itemToElementLabel ? itemToElementLabel(item) :
                                <span>{ itemToStringLabel ? itemToStringLabel(item) : item }</span> }
                        </Combobox.Item>
                    ) }
                </Combobox.List>
            </Combobox.Popup>
        </Combobox.Positioner>
    </Combobox.Portal>
}

export type ComboboxCreatableProps<Data, InputData extends Record<string, any>> =
    Omit<ComboboxSelectProps<Data, false>, 'multiple' | 'inputValue' | 'onInputValueChange' | 'onValueChange'> & {
    createDialog: FunctionComponent<CreateDialog.Props<Data, InputData>>
    inputKey: keyof InputData,
    additionalInput?: Partial<InputData>
    onValueChange?: (value: Data | null) => void
}

export function ComboboxCreatableSelect<Value, InputData extends Record<string, any>>({
                                                                                          itemName,
                                                                                          id,
                                                                                          placeholder,
                                                                                          itemToStringLabel,
                                                                                          itemToElementLabel,
                                                                                          disabled,
                                                                                          items,
                                                                                          value,
                                                                                          createDialog,
                                                                                          onValueChange,
                                                                                          inputKey,
                                                                                          loading,
                                                                                          additionalInput,
                                                                                          readOnly,
                                                                                          ...props
                                                                                      }: ComboboxCreatableProps<Value, InputData>): React.JSX.Element {
    const createDialogManager = CreateDialog.useManager()
    const [ query, setQuery ] = useState<string>('');
    const [ selected, _setSelected ] = useState<Value | null>(value || null);
    const setSelected = useCallback((data: Value | null) => {
        onValueChange?.(data)
        _setSelected(data)
    }, [ onValueChange ]);
    useEffect(() => {
        setSelected(value || null)
    }, [ value ]);

    const itemsForView: readonly (Value | CreateValue)[] = useMemo(() => {
        if (!items) return []
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
    }, [ items, itemToStringLabel, query ]);

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

    const _onValueChange = useCallback((data: Value | CreateValue | null) => {
        if (!data) setSelected(data)
        else if ((data as CreateValue).__create) {
            createDialogManager.create<Value, InputData>(createDialog, {
                ...additionalInput,
                [inputKey]: (data as CreateValue).__create,
            } as InputData).then(setSelected)
            setQuery('');
        } else setSelected(data as Value | null)
    }, [ createDialogManager, createDialog, query, setSelected, inputKey, additionalInput ])

    return (
        <Combobox.Root itemToStringLabel={ _itemToStringLabel }
                       disabled={ disabled }
                       items={ itemsForView }
                       inputValue={ query }
                       value={ selected }
                       onInputValueChange={ setQuery }
                       onValueChange={ _onValueChange }
                       readOnly={ readOnly }
                       { ...props }>

            <Combobox.InputGroup>
                <Combobox.Input placeholder={ placeholder ? placeholder : `Select or create ${ itemName }` }
                                id={ id }/>
                { loading && <Spinner size={ 16 } className={ styles.Spinner }/> }
                { !disabled && !readOnly && <Combobox.Clear/> }
                { !readOnly && <Combobox.Trigger/> }
                <span className={ styles.Value }>
                    <Combobox.Value children={ item => _itemToElementLabel(item) }/>
                </span>
            </Combobox.InputGroup>

            <Portal itemName={ itemName }
                    itemToElementLabel={ _itemToElementLabel }
                    itemToStringLabel={ itemToStringLabel }/>
        </Combobox.Root>
    )
}


export function ComboboxSelect<Value>({
                                          itemName,
                                          id,
                                          placeholder,
                                          itemToStringLabel,
                                          itemToElementLabel,
                                          disabled,
                                          ...props
                                      }: Omit<ComboboxSelectProps<Value, false>, 'multiple'>): React.JSX.Element {

    return (
        <Combobox.Root disabled={ disabled }
                       itemToStringLabel={ itemToStringLabel }
                       { ...props }>

            <Combobox.InputGroup>
                <Combobox.Input placeholder={ placeholder ? placeholder : `Select ${ itemName }` }
                                id={ id }/>
                { !disabled && <Fragment>
                    <Combobox.Clear/>
                </Fragment> }
                <Combobox.Trigger/>
                { itemToElementLabel && <Combobox.Value children={ item => itemToElementLabel(item) }/> }
            </Combobox.InputGroup>

            <Portal itemName={ itemName }
                    itemToElementLabel={ itemToElementLabel }
                    itemToStringLabel={ itemToStringLabel }/>
        </Combobox.Root>
    )
}

export function ComboboxMultiSelect<Value>({
                                               itemName,
                                               id,
                                               itemToStringLabel,
                                               itemToElementLabel,
                                               disabled,
                                               ...props
                                           }: Omit<ComboboxSelectProps<Value, true>, 'multiple' | 'placeholder'>): React.JSX.Element {
    return (
        <Combobox.Root multiple
                       itemToStringLabel={ itemToStringLabel }
                       disabled={ disabled }
                       { ...props }>

            <Combobox.InputGroup>
                <Combobox.Chips>
                    <Combobox.Value>
                        { (value: Value[]) => (
                            <Fragment>
                                <Combobox.Input id={ id }
                                                placeholder={ value.length > 0 ? '' : 'Select analysis' }/>
                                { value.map((item, index) => (
                                    <Combobox.Chip key={ index }>
                                        { itemToElementLabel?.(item) ?? itemToStringLabel?.(item) ?? item as string }
                                    </Combobox.Chip>
                                )) }
                            </Fragment>
                        ) }
                    </Combobox.Value>
                </Combobox.Chips>
            </Combobox.InputGroup>

            <Portal itemName={ itemName }
                    itemToElementLabel={ itemToElementLabel }
                    itemToStringLabel={ itemToStringLabel }/>
        </Combobox.Root>
    )
}