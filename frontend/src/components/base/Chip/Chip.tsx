import React, { type HTMLProps } from 'react';
import type { BaseColor } from '@/components/base/types';
import styles from './Chip.module.scss'

export type ChipProps = {
    color?: BaseColor;
} & HTMLProps<HTMLDivElement>;

export const Chip: React.FC<ChipProps> = ({
                                              children,
                                              color,
                                              ...props
                                          }) => {

    return <div className={ styles.Chip }
                data-color={ color }
                { ...props }>
        { children }
    </div>
}