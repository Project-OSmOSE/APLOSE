import React from 'react';
import { UnreadLinearIcon } from '@solar-icons/react';
import { Combobox, type ComboboxItemIndicatorProps as BaseComboboxItemIndicatorProps } from '@base-ui/react/combobox';
import styles from './Combobox.module.scss'

export type ComboboxItemIndicatorProps = Omit<BaseComboboxItemIndicatorProps, 'style' | 'className' | 'children' | 'aria-label'>

export const ItemIndicator: React.FC<ComboboxItemIndicatorProps> = (props) => (
    <Combobox.ItemIndicator className={ styles.ItemIndicator } { ...props }>
        <UnreadLinearIcon size={ 24 }/>
    </Combobox.ItemIndicator>
)
