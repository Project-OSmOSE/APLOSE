import React, { type HTMLAttributes } from 'react';
import styles from './Content.module.scss'

type TypesProps = { start?: boolean }
    & { oneContent?: boolean }
    & { inner?: boolean }
type ContentProps = Pick<HTMLAttributes<HTMLDivElement>, 'children' | 'className' | 'style'> & TypesProps

export const Content: React.FC<ContentProps> = ({ className, children, style, ...types }) => {
    const classes = [ styles.Content ]
    if (className) classes.push(className)
    for (const type of Object.keys(types)) {
        if (types[type as keyof TypesProps]) classes.push(styles[type])
    }
    return <div className={ classes.join(' ') } style={ style } children={ children }/>
}