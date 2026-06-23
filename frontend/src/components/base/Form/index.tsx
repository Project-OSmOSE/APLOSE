import React from 'react';
import { Form as BaseForm, type FormProps as BaseProps } from '@base-ui/react';
import styles from './Form.module.scss'

export type FormProps = BaseProps & {
    horizontal?: boolean
    center?: boolean
};

export const Form: React.FC<FormProps> = React.memo(({ className, horizontal, center, ...props }) => (
    <BaseForm className={ [
        styles.Form,
        horizontal ? styles.horizontal : '',
        center ? styles.center : '',
        className
    ].join(' ') }
              { ...props } />
))