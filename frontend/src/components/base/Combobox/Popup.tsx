import React from 'react';
import { Combobox, type ComboboxPopupProps as BaseComboboxPopupProps } from '@base-ui/react/combobox';
import styles from './Combobox.module.scss';

export type ComboboxPopupProps = Omit<BaseComboboxPopupProps, 'style' | 'className'>

export const Popup: React.FC<ComboboxPopupProps> = React.memo((props) => (
    <Combobox.Popup className={ styles.Popup } { ...props } />
))
