import React from 'react';
import { Combobox, type ComboboxPositionerProps as BaseComboboxPositionerProps } from '@base-ui/react/combobox';
import styles from './Combobox.module.scss';

export type ComboboxPositionerProps = Omit<BaseComboboxPositionerProps, 'side' | 'sideOffset' | 'style' | 'className'>

export const Positioner: React.FC<ComboboxPositionerProps> = React.memo((props) => (
    <Combobox.Positioner className={ styles.Positioner }
                         sideOffset={ 8 }
                         align='end'
                         { ...props } />
))
