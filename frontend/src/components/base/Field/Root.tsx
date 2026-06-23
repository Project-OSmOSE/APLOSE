import React from 'react';
import { Field, type FieldRootProps as BaseFieldRootProps } from '@base-ui/react'
import styles from './Field.module.scss'

export type FieldRootProps = BaseFieldRootProps & { horizontal?: boolean }

export const Root: React.FC<FieldRootProps> = React.memo(({ className, horizontal, ...props }) => (
    <Field.Root className={ [ styles.Root, horizontal ? styles.horizontal : '', className ].join(' ') } { ...props } />
))
