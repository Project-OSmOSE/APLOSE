import React from 'react';
import { Combobox, type ComboboxInputGroupProps as BaseComboboxInputGroupProps } from '@base-ui/react/combobox';
import styles from './Combobox.module.scss';

export type ComboboxInputGroupProps = Omit<BaseComboboxInputGroupProps, 'style' | 'className'>

export const InputGroup: React.FC<ComboboxInputGroupProps> = React.memo((props) => (
    <Combobox.InputGroup className={ styles.InputGroup } { ...props } />
))
