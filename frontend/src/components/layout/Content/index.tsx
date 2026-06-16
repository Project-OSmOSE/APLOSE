import React, { type ReactNode } from 'react';
import styles from './Content.module.scss'

type ContentProps = {
    children: ReactNode;
    className?: string;
} & (
    { start?: boolean }
    )

export const Content: React.FC<ContentProps> = ({ start, children, className }) => {
    const classes = [styles.Content]
    if (start) classes.push(styles.start)
    if (className) classes.push(className)
    return <div className={ classes.join(' ') } children={ children }/>
}