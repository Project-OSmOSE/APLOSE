import React, { type HTMLAttributes } from 'react';
import styles from './Content.module.scss'

type ContentProps = Pick<HTMLAttributes<HTMLDivElement>, 'children' | 'className' | 'style'> & (
    { start?: boolean }
    )

export const Content: React.FC<ContentProps> = ({ start, className, ...props }) => {
    const classes = [ styles.Content ]
    if (start) classes.push(styles.start)
    if (className) classes.push(className)
    return <div className={ classes.join(' ') } { ...props }/>
}