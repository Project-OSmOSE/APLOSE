import React from 'react';
import { Combobox, type ComboboxInputProps as BaseComboboxInputProps } from '@base-ui/react/combobox';
import styles from './Combobox.module.scss'

export type ComboboxInputProps = Omit<BaseComboboxInputProps, 'style' | 'className'>

export const Input: React.FC<ComboboxInputProps> = (props) => (
    <Combobox.Input className={ styles.Input }
                    { ...props } />
)
