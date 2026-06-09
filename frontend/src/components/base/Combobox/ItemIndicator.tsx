import React from 'react';
import { Combobox, type ComboboxItemIndicatorProps as BaseComboboxItemIndicatorProps } from '@base-ui/react/combobox';
import { Unread } from '@solar-icons/react';
import styles from './Combobox.module.scss'

export type ComboboxItemIndicatorProps = Omit<BaseComboboxItemIndicatorProps, 'style' | 'className' | 'children' | 'aria-label'>

export const ItemIndicator: React.FC<ComboboxItemIndicatorProps> = (props) => (
    <Combobox.ItemIndicator className={ styles.ItemIndicator } { ...props } aria-label="Open popup">
        <Unread weight="Linear" size={ 24 }/>
    </Combobox.ItemIndicator>
)
