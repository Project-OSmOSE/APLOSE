import React, { Fragment, type HTMLInputTypeAttribute, type HTMLProps, useCallback, useMemo, useState } from 'react';
import { Input as BaseInput, type InputProps as BaseInputProps } from '@base-ui/react'
import styles from './Input.module.scss'
import { Eye, EyeClosed } from '@solar-icons/react';

export type InputProps = Omit<BaseInputProps, 'type' | 'render'> & {
    startIcon?: any
}
    & ({
    type: HTMLInputTypeAttribute & ('text' | 'url' | 'date' | 'datetime-local' | 'email' | 'textarea' | 'password' | 'search' | 'number')
} | ({ type: 'textarea' } & HTMLProps<HTMLTextAreaElement>));

export const Input: React.FC<InputProps> = ({ className, type, startIcon: _startIcon, ...props }) => {

    const [ pwdType, setPwdType ] = useState<HTMLInputTypeAttribute>('password');
    const togglePwdType = useCallback(() => {
        setPwdType(prev => prev === 'password' ? 'text' : 'password')
    }, [ setPwdType ])

    const startIcon = useMemo(() => _startIcon ? React.createElement(
        _startIcon,
        {
            weight: 'Linear',
            className: [ styles.Icon, styles.start ].join(' '),
        },
    ) : <Fragment/>, [ _startIcon ]);
    const endIcon = useMemo(() => {
        if (type !== 'password') return <Fragment/>;
        return React.createElement(
            pwdType === 'password' ? Eye : EyeClosed,
            {
                weight: 'Linear',
                className: [ styles.Icon, styles.end ].join(' '),
                onClick: togglePwdType,
            },
        )
    }, [ pwdType, togglePwdType ]);

    return <div className={ [ styles.InputContainer, className ].join(' ') }>
        <BaseInput className={ styles.Input }
                   render={ type === 'textarea' ? <textarea/> : undefined }
                   type={ type === 'password' ? pwdType : type }
                   { ...props }/>

        { startIcon }
        { endIcon }
    </div>
}
