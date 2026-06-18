import React, { type HTMLAttributes } from 'react';
import styles from './Content.module.scss'

type ContentProps = Pick<HTMLAttributes<HTMLDivElement>, 'children' | 'className' | 'style'> & (
    { start?: boolean, oneContent?: never } |
    { start?: never, oneContent?: boolean }
    )

export const Content: React.FC<ContentProps> = ({ start, oneContent, className, ...props }) => {
    const classes = [ styles.Content ]
    if (start) classes.push(styles.start)
    if (oneContent) classes.push(styles.oneContent)
    if (className) classes.push(className)
    return <div className={ classes.join(' ') } { ...props }/>
}