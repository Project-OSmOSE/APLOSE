import React, { type HTMLInputTypeAttribute, useCallback, useMemo, useState } from 'react';
import { Input as BaseInput, type InputProps as BaseInputProps } from '@base-ui/react'
import styles from './Input.module.scss'
import { Eye, EyeClosed } from '@solar-icons/react';

export type PasswordInputProps = Omit<BaseInputProps, 'type'>

export const PasswordInput: React.FC<PasswordInputProps> = ({ className, ...props }) => {
    const [ type, setType ] = useState<HTMLInputTypeAttribute>('password');

    const toggle = useCallback(() => {
        setType(prev => prev === 'password' ? 'text' : 'password')
    }, [ setType ])

    const icon = useMemo(() => React.createElement(
        type === 'password' ? Eye : EyeClosed,
        {
            weight: 'Linear',
            className: styles.Icon,
            onClick: toggle,
        },
    ), [ type, toggle ]);

    return useMemo(() =>
            <div className={ styles.PasswordInput }>
                <BaseInput className={ [ className, styles.Input ].join(' ') }
                           type={ type }
                           { ...props }/>

                { icon }
            </div>,
        [ className, props, type, icon ])
}
