import React from 'react';
import { Tooltip, type TooltipPopupProps as BaseTooltipPopupProps } from '@base-ui/react'
import styles from './Tooltip.module.scss'

export type TooltipPopupProps = BaseTooltipPopupProps

export const Popup: React.FC<TooltipPopupProps> = React.memo(({ className, ...props }) => (
    <Tooltip.Popup className={ [ styles.Popup, className ].join(' ') }
                        { ...props } />
))
