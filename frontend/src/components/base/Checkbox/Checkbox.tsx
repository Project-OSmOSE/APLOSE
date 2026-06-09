import React from 'react';
import { Checkbox as BaseCheckbox } from '@base-ui/react'
import { Unread } from '@solar-icons/react';
import styles from './Checkbox.module.scss'

export const Checkbox: React.FC = React.memo(() => (
    <BaseCheckbox.Root className={ styles.Root } render={ <div/> }>
        <BaseCheckbox.Indicator keepMounted
                                className={ styles.Indicator }>
            <Unread weight="Linear" size={ 24 }/>
        </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
))
