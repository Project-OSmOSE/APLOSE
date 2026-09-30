import React, { type HTMLAttributes } from 'react';
import type { BaseColor } from '@/components/base/types';
import styles from './Badge.module.scss'

export type BadgeProps = Pick<HTMLAttributes<HTMLDivElement>, 'children' | 'className'> & { color: BaseColor }
export const Badge: React.FC<BadgeProps> = ({ className, ...props }) => (
    <div className={ [ styles.Badge, className ].join(' ') }
         { ...props }/>
)