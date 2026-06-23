import React, { type HTMLAttributes } from 'react';
import type { BaseColor } from '@/components/base/types';
import styles from './Note.module.scss'

export type NoteProps = HTMLAttributes<HTMLParagraphElement> &
    { color?: BaseColor } & {flex?: boolean};

export const Note: React.FC<NoteProps> = ({ className, color, flex, children, ...props }) => (
    <span className={ [ className, styles.Note, color ? styles[color] : '', flex ? styles.flex : '' ].join(' ') }
       { ...props }>
        { children }
    </span>
)
