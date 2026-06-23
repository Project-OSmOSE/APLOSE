import React from 'react';
import { Button as BaseButton, type ButtonProps as BaseButtonProps } from '@base-ui/react/button';
import styles from './Button.module.scss';
import type { BaseColor } from '@/components/base/types';

export type  ButtonProps = BaseButtonProps & { color?: BaseColor }

export const Button = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'ref'>>(({ className, ...props }, ref) => (
    <BaseButton ref={ ref }
                { ...props }
                className={ [ styles.Button, className ].join(' ') }/>
))