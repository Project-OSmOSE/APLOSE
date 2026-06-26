import React, { type HTMLAttributes } from 'react';
import styles from './Button.module.scss';


export type ButtonGroupProps = HTMLAttributes<HTMLDivElement> & (
    { spaceBetween: true, end?: never, center?: never } |
    { spaceBetween?: never, end: true, center?: never } |
    { spaceBetween?: never, end?: never, center?: true } |
    { spaceBetween?: never, end?: never, center?: never }
    )

export const ButtonGroup: React.FC<ButtonGroupProps> = React.memo(({ className, spaceBetween, end, center, ...props }) => {
    const classes = [ className, styles.ButtonGroup ]
    if (spaceBetween) classes.push(styles.spaceBetween)
    if (end) classes.push(styles.end)
    if (center) classes.push(styles.center)

    return <div { ...props }
                className={ classes.join(' ') }/>
})
