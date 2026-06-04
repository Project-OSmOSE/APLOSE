import React, { type HTMLAttributes } from 'react';
import styles from './Button.module.scss';


export type ButtonGroupProps = HTMLAttributes<HTMLDivElement> & (
    { spaceBetween: true, end?: never } |
    { spaceBetween?: never, end: true } |
    { spaceBetween?: never, end?: never }
    )

export const ButtonGroup: React.FC<ButtonGroupProps> = React.memo(({ className, spaceBetween, end, ...props }) => {
    const classes = [ className, styles.ButtonGroup ]
    if (spaceBetween) classes.push(styles.spaceBetween)
    if (end) classes.push(styles.end)

    return <div { ...props }
                className={ classes.join(' ') }/>
})
