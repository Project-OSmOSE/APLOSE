import React from 'react';
import { AltArrowDownLinearIcon } from '@solar-icons/react';
import { Combobox, type ComboboxTriggerProps as BaseComboboxTriggerProps } from '@base-ui/react/combobox';
import styles from './Combobox.module.scss'

export type ComboboxTriggerProps = Omit<BaseComboboxTriggerProps, 'style' | 'className' | 'children' | 'aria-label'>

export const Trigger: React.FC<ComboboxTriggerProps> = (props) => (
    <Combobox.Trigger className={ styles.Trigger } { ...props } aria-label="Open popup">
        <AltArrowDownLinearIcon size={ 20 }/>
    </Combobox.Trigger>
)
