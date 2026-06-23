import React from 'react';
import { RadioGroup, RadioGroupProps as BaseProps } from '@base-ui/react/radio-group';
import styles from './Toggle.module.scss'

export type RadioGroupProps<T extends string = any> = BaseProps<T>

export const Group: React.FC<RadioGroupProps> = ({ className, ...props }) => (
    <RadioGroup className={ [ styles.Group, className ].join(' ') }
                { ...props }/>
)
