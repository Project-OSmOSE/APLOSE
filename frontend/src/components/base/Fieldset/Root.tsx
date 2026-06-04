import React from 'react';
import { Fieldset, type FieldsetRootProps } from '@base-ui/react'
import styles from './Fieldset.module.scss'

export type { FieldsetRootProps } from '@base-ui/react'

export const Root: React.FC<FieldsetRootProps> = React.memo(({ className, ...props }) => (
    <Fieldset.Root className={ [ styles.Root, className ].join(' ') } { ...props } />
))
