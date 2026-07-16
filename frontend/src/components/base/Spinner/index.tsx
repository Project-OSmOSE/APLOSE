import React, { type CSSProperties, type HTMLProps, useMemo } from 'react';
import styles from './Spinner.module.scss'

export const Spinner: React.FC<Pick<HTMLProps<HTMLDivElement>, 'className' | 'size'>> = ({ className, size }) => {
    const style = useMemo(() => {
        const style: CSSProperties = {}
        if (size) {
            // @ts-expect-error: css custom property
            style['--size'] = `${size}px`
        }
        return style
    }, [size])
    return <span className={ [ styles.Spinner, className ].join(' ') } style={ style }/>
}


export const SkeletonText: React.FC<{ width: number }> = ({ width }) => (
    <span className={ styles.SkeletonText } style={ { width } }/>
)