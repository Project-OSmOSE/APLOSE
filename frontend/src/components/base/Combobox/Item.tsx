import React from 'react';
import { Combobox, type ComboboxItemProps as BaseComboboxItemProps } from '@base-ui/react/combobox';
import styles from './Combobox.module.scss';

export type ComboboxItemProps = Omit<BaseComboboxItemProps, 'style' | 'className'>

export const Item: React.FC<ComboboxItemProps> = React.memo((props) => (
    <Combobox.Item className={ styles.Item } { ...props } />
))
