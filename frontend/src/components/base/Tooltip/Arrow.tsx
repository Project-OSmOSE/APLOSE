import React from 'react';
import { Tooltip, type TooltipArrowProps as BaseTooltipArrowProps } from '@base-ui/react'
import styles from './Tooltip.module.scss'

export type TooltipArrowProps = BaseTooltipArrowProps

export const Arrow: React.FC<TooltipArrowProps> = React.memo(({ className, ...props }) => (
    <Tooltip.Arrow className={ [ styles.Arrow, className ].join(' ') }
                   { ...props } />
))
