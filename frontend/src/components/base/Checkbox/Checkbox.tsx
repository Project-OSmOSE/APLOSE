import React from 'react';
import { Checkbox as BaseCheckbox } from '@base-ui/react'
import { Unread } from '@solar-icons/react';
import styles from './Checkbox.module.scss'

type Props = Omit<BaseCheckbox.Root.Props, 'children' | 'className' | 'render' | 'value' | 'uncheckedValue'>

export const Checkbox: React.FC<Props> = React.memo((props) => (
    <BaseCheckbox.Root className={ styles.Root }
                       render={ <div/> }
                       value='true' uncheckedValue='false'
                       { ...props } >
        <BaseCheckbox.Indicator keepMounted
                                className={ styles.Indicator }>
            <Unread weight="Linear" size={ 24 }/>
        </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
))
