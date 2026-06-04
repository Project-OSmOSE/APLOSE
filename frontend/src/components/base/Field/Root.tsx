import React from 'react';
import { Field, type FieldRootProps } from '@base-ui/react'
import styles from './Field.module.scss'

export type { FieldRootProps } from '@base-ui/react/field'

export const Root: React.FC<FieldRootProps> = React.memo(({ className, ...props }) => (
    <Field.Root className={ [ styles.Root, className ].join(' ') } { ...props } />
))
