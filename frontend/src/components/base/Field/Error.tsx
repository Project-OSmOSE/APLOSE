import React from 'react';
import { Field, type FieldErrorProps as BaseFieldErrorProps } from '@base-ui/react'
import { Note } from '@/components/base/Note';

export type FieldErrorProps = Omit<BaseFieldErrorProps, 'style' | 'className'>

export const Error: React.FC<FieldErrorProps> = React.memo((props) => (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    <Field.Error render={ ({ ref, color, ...props }) => <Note color="danger" { ...props }/> }
                 { ...props } />
))
