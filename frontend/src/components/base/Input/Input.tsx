import React, { type HTMLInputTypeAttribute } from 'react';
import { Input as BaseInput, type InputProps as BaseInputProps } from '@base-ui/react'
import styles from './Input.module.scss'

export type InputProps = Omit<BaseInputProps, 'type' | 'render'> & {
    type: HTMLInputTypeAttribute & ('text' | 'url' | 'date' | 'email' | 'textarea')
}

export const Input: React.FC<InputProps> = React.memo(({ className, type, ...props }) => (
    <BaseInput className={ [ className, styles.Input ].join(' ') }
               render={ type === 'textarea' ? <textarea/> : undefined }
               type={ type }
               { ...props }/>
))
