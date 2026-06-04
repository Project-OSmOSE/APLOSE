import React from 'react';
import { Form as BaseForm, type FormProps } from '@base-ui/react';
import styles from './Form.module.scss'

export type { FormProps };

export const Form: React.FC<FormProps> = React.memo(({ className, ...props }) => (
    <BaseForm className={ [ styles.Form, className ].join(' ') } { ...props } />
))