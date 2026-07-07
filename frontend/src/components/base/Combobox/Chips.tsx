import React from 'react';
import { Combobox, type ComboboxChipsProps as BaseComboboxChipsProps } from '@base-ui/react/combobox';
import styles from './Combobox.module.scss';

export type ComboboxChipsProps = Omit<BaseComboboxChipsProps, 'style' | 'className'>

export const Chips: React.FC<ComboboxChipsProps> = React.memo((props) => (
    <Combobox.Chips className={ styles.Chips } { ...props } />
))
