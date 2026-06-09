import React, { type HTMLInputTypeAttribute } from 'react';
import { Field, type FieldControlProps as BaseFieldControlProps } from '@base-ui/react'
import { Input } from '@/components/base/Input'

export type FieldControlProps = Omit<BaseFieldControlProps, 'type'> & {
    type: HTMLInputTypeAttribute & ('text' | 'date' | 'url' | 'email' | 'textarea')
}

export const Control: React.FC<FieldControlProps> = React.memo((props) => (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    <Field.Control render={ ({ ref, ...props }) => <Input type="text" { ...props }/> }
                   { ...props } />
))
