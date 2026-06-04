import React from 'react';
import { Field, type FieldControlProps } from '@base-ui/react'
import { PasswordInput } from '@/components/base/Input'

export type { FieldControlProps } from '@base-ui/react/field'

export const PasswordControl: React.FC<FieldControlProps> = React.memo((props) => (
    <Field.Control render={ props => <PasswordInput { ...props }/> }
                   { ...props } />
))
