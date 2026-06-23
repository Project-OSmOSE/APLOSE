import React, { createElement } from 'react';
import { Checkbox as BaseCheckbox } from '@base-ui/react'
import { CheckSquare, Stop } from '@solar-icons/react';
import styles from './Checkbox.module.scss'

type Props = Omit<BaseCheckbox.Root.Props, 'children' | 'className' | 'render' | 'value' | 'uncheckedValue'>

export const Checkbox: React.FC<Props> = React.memo((props) => (
    <BaseCheckbox.Root className={ styles.Root }
                       render={ <div/> }
                       value="true" uncheckedValue="false"
                       { ...props } >
        <BaseCheckbox.Indicator keepMounted
                                render={ (props, state) => {
                                    return createElement(
                                        state.checked ? CheckSquare : Stop,
                                        {
                                            weight: 'LineDuotone',
                                            size: 24,
                                            className: styles.Indicator,
                                            color: state.checked ? 'primary' : 'medium',
                                            ...props,
                                        })
                                } }/>
    </BaseCheckbox.Root>
))
