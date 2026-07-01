import React, { type HTMLProps } from 'react';
import type { BaseColor } from '@/components/base/types';
import styles from './Chip.module.scss'

export type ChipProps = {
    color?: BaseColor;
    annotationColorIndex?: number;
} & HTMLProps<HTMLDivElement>;

export const Chip: React.FC<ChipProps> = ({
                                              children,
                                              color,
                                              annotationColorIndex,
                                              className,
                                              ...props
                                          }) => {
    const classes = [ styles.Chip, className ]
    if (annotationColorIndex !== undefined) classes.push(styles['index-' + annotationColorIndex%10])
    return <div className={ classes.join(' ') }
                data-color={ color }
                { ...props }>
        { children }
    </div>
}