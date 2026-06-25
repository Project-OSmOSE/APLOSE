import { type ReactNode } from 'react';
import { Select as BaseSelect, type SelectRootProps } from '@base-ui/react/select';
import { AltArrowDown, Unread } from '@solar-icons/react';
import styles from './Select.module.scss'

export type SelectProps<Value, Multiple extends boolean | undefined = false> =
    Omit<SelectRootProps<Value, Multiple>, 'items' | 'itemToStringValue'>
    & {
    items: any[],
    itemName: string
    itemToStringValue: (item: Value) => string,
    itemToElementLabel: (item: Value) => ReactNode,
}

export function Select<Value, Multiple extends boolean = false>({
                                                                    itemName,
                                                                    items,
                                                                    itemToStringValue,
                                                                    itemToElementLabel,
                                                                    ...props
                                                                }: SelectProps<Value, Multiple>) {

    return <BaseSelect.Root items={ items.map(i => ({ label: itemToElementLabel(i), value: itemToStringValue(i) })) }
                            { ...props }>
        <BaseSelect.Trigger className={ styles.Select }>
            <BaseSelect.Value className={ styles.Value } placeholder={ `Select ${ itemName }` }/>
            <BaseSelect.Icon className={ styles.ChevronIcon }>
                <AltArrowDown weight="Linear" size={ 20 }/>
            </BaseSelect.Icon>
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
            <BaseSelect.Positioner className={ styles.Positioner }>
                <BaseSelect.Popup className={ styles.Popup }>
                    <BaseSelect.List className={ styles.List }>
                        { items && items.map((item, key) => (
                            <BaseSelect.Item key={ key } value={ itemToStringValue(item) } className={ styles.Item }>
                                <BaseSelect.ItemIndicator className={ styles.ItemIndicator }>
                                    <Unread weight="Linear" size={ 24 }/>
                                </BaseSelect.ItemIndicator>
                                <BaseSelect.ItemText
                                    className={ styles.ItemText }>{ itemToElementLabel(item) }</BaseSelect.ItemText>
                            </BaseSelect.Item>
                        )) }
                    </BaseSelect.List>
                </BaseSelect.Popup>
            </BaseSelect.Positioner>
        </BaseSelect.Portal>

    </BaseSelect.Root>
}