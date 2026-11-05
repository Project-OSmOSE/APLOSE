import React from 'react';
import { Combobox, type ComboboxPositionerProps } from '@base-ui/react/combobox';
import styles from './Combobox.module.scss';

export type PositionerProps = Omit<ComboboxPositionerProps, 'sideOffset' | 'style' | 'className'>

export const Positioner: React.FC<PositionerProps> = React.memo((props) => (
    <Combobox.Positioner className={ styles.Positioner }
                         sideOffset={ 8 }
                         align='end'
                         { ...props } />
))
