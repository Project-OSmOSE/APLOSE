import React from 'react';
import { Field, type FieldErrorProps as BaseFieldErrorProps } from '@base-ui/react'
import { Note } from '@/components/base/Note';

export type FieldErrorProps = Omit<BaseFieldErrorProps, 'style' | 'className'>

export const Error: React.FC<FieldErrorProps> = React.memo((props) => (
    // @ts-expect-error: don't know why it doesn't recognize "color" type
    <Field.Error render={ (props) => <Note color="danger" { ...props }/> }
                 { ...props } />
))
