import React from 'react';
import { Field, type FieldControlProps } from '@base-ui/react'
import { Input } from '@/components/base/Input'

export type { FieldControlProps } from '@base-ui/react/field'

export const Control: React.FC<FieldControlProps> = React.memo((props) => (
    <Field.Control render={ props => <Input type="text" { ...props }/> }
                   { ...props } />
))
