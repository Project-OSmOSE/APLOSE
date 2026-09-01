import React, { type HTMLAttributes, useMemo } from 'react';
import type { BaseColor } from '@/components/base/types';
import styles from './Note.module.scss'

export type NoteProps = HTMLAttributes<HTMLParagraphElement> &
    { color?: BaseColor } & { flex?: boolean, small?: boolean };

export const Note: React.FC<NoteProps> = ({ className, color, flex, children, small, ...props }) => {
    const content = useMemo(() => {
        if (small) return <small>{ children }</small>
        return children
    }, [ small, children ])
    return <span className={ [ className, styles.Note, color ? styles[color] : '', flex ? styles.flex : '' ].join(' ') }
                 children={ content }
                 { ...props }/>
}
