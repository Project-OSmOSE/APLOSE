import React from 'react';
import { Button as BaseButton, type ButtonProps as BaseButtonProps } from '@base-ui/react/button';
import styles from './Button.module.scss';
import type { BaseColor } from '@/components/base/types';

export type  ButtonProps = BaseButtonProps & {
    color?: BaseColor,
    annotationColorIndex?: number;
}

export const Button = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'ref'>>(({
                                                                                         annotationColorIndex,
                                                                                         className,
                                                                                         ...props
                                                                                     }, ref) => {
    const classes = [styles.Button, className]
    if (annotationColorIndex !== undefined) classes.push(styles['index-' + annotationColorIndex%10])
    return <BaseButton ref={ ref }
                       { ...props }
                       className={ classes.join(' ') }/>
})