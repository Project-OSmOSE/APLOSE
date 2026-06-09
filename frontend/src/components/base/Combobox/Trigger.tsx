import React from 'react';
import { Combobox, type ComboboxTriggerProps as BaseComboboxTriggerProps } from '@base-ui/react/combobox';
import { AltArrowDown } from '@solar-icons/react';
import styles from './Combobox.module.scss'

export type ComboboxTriggerProps = Omit<BaseComboboxTriggerProps, 'style' | 'className' | 'children' | 'aria-label'>

export const Trigger: React.FC<ComboboxTriggerProps> = (props) => (
    <Combobox.Trigger className={ styles.Trigger } { ...props } aria-label="Open popup">
        <AltArrowDown weight="Linear" size={ 20 }/>
    </Combobox.Trigger>
)
