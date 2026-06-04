import React from 'react';
import { Field, type FieldLabelProps as BaseFieldLabelProps } from '@base-ui/react'
import styles from './Field.module.scss'
import { Note } from '@/components/base/Note';

export type FieldLabelProps = BaseFieldLabelProps & { required?: boolean }

export const Label: React.FC<FieldLabelProps> = React.memo(({ className, children, required, ...props }) => (
    <Field.Label className={ [ styles.Label, className ].join(' ') } { ...props }>
        { children }
        { required && <Note color="danger">*</Note> }
    </Field.Label>
))
