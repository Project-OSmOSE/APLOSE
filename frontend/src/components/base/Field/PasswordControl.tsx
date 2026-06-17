import React from 'react';
import { Field, type FieldControlProps } from '@base-ui/react'
import { Input } from '@/components/base/Input';

export type { FieldControlProps as FieldPasswordControlProps } from '@base-ui/react/field'

export const PasswordControl: React.FC<FieldControlProps> = React.memo((props) => (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    <Field.Control render={ ({ ref, ...props }) => <Input type="password" { ...props }/> }
                   { ...props } />
))
