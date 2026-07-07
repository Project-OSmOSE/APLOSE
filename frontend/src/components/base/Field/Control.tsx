import React from 'react';
import { Field, type FieldControlProps as BaseFieldControlProps } from '@base-ui/react'
import { Input, type InputProps } from '@/components/base/Input'

export type FieldControlProps = Omit<BaseFieldControlProps, 'type'> & {
    startIcon?: any,
    type: InputProps['type']
}

export const Control: React.FC<FieldControlProps> = React.memo(({ type, startIcon, ...props }) => (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    <Field.Control render={ ({ ref, ...props }) => <Input type={ type } startIcon={ startIcon } { ...props }/> }
                   { ...props } />
))
