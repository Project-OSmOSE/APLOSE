import React from 'react';
import { Field, type FieldDescriptionProps as BaseFieldDescriptionProps } from '@base-ui/react'
import { Note } from '@/components/base/Note';

export type FieldDescriptionProps = Omit<BaseFieldDescriptionProps, 'style' | 'className'>

export const Description: React.FC<FieldDescriptionProps> = React.memo((props) => (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    <Field.Description render={ ({ ref, color, ...props }) => <Note color='medium' { ...props }/> }
                 { ...props } />
))
