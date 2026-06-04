import React, { type HTMLInputTypeAttribute } from 'react';
import { Input as BaseInput, type InputProps as BaseInputProps } from '@base-ui/react'
import styles from './Input.module.scss'

export type InputProps = Omit<BaseInputProps, 'type'> & {
    type: HTMLInputTypeAttribute & ('text' | 'url' | 'email')
}

export const Input: React.FC<InputProps> = React.memo(({ className, ...props }) => {
    return <BaseInput className={ [ className, styles.Input ].join(' ') }
                      { ...props }/>
})
