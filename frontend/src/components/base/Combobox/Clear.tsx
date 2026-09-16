import React from 'react';
import { BackspaceLinearIcon } from '@solar-icons/react';
import { Combobox, type ComboboxClearProps as BaseComboboxClearProps } from '@base-ui/react/combobox';
import styles from './Combobox.module.scss'

export type ComboboxClearProps = Omit<BaseComboboxClearProps, 'style' | 'className' | 'children' | 'aria-label'>

export const Clear: React.FC<ComboboxClearProps> = (props) => (
    <Combobox.Clear className={ styles.Clear } { ...props } aria-label="Clear selection">
        <BackspaceLinearIcon size={ 20 }/>
    </Combobox.Clear>
)
