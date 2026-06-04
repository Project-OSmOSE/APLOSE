import React, { type HTMLAttributes } from 'react';
import type { BaseColor } from '@/components/base/types';
import styles from './Note.module.scss'

export type NoteProps = HTMLAttributes<HTMLParagraphElement> & { color?: BaseColor };

export const Note: React.FC<NoteProps> = React.memo(({ className, color, children, ...props }) => (
    <p className={ [ className, styles.Note, color ? styles[color] : '' ].join(' ') }
       { ...props }>
        { children }
    </p>
))