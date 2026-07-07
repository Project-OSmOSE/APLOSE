import React from 'react';
import { Fieldset, type FieldsetLegendProps } from '@base-ui/react'
import styles from './Fieldset.module.scss'

export type { FieldsetLegendProps } from '@base-ui/react'

export const Legend: React.FC<FieldsetLegendProps> = React.memo(({ className, children, ...props }) => (
    <Fieldset.Legend className={ [ styles.Legend, className ].join(' ') } { ...props }>
        <div/>
        { children }
        <div/>
    </Fieldset.Legend>
))
