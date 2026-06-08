import React from 'react';
import { Tooltip, type TooltipTriggerProps as BaseTooltipTriggerProps } from '@base-ui/react'
import type { BaseColor } from '@/components/base/types';
import styles from '@/components/base/Button/Button.module.scss';

export type TooltipTriggerProps = BaseTooltipTriggerProps & { color?: BaseColor }

export const Trigger: React.FC<TooltipTriggerProps> = React.memo(({ className, ...props }) => (
    <Tooltip.Trigger className={ [ styles.Button, className ].join(' ') }
                     { ...props } />
))
