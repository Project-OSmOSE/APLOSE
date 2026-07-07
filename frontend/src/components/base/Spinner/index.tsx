import React, { type HTMLProps } from 'react';
import styles from './Spinner.module.scss'

export const Spinner: React.FC<Pick<HTMLProps<HTMLDivElement>, 'className'>> = ({ className }) => (
    <span className={ [ styles.Spinner, className ].join(' ') }/>
)


export const SkeletonText: React.FC<{ width: number }> = ({ width }) => (
    <span className={ styles.SkeletonText } style={ { width } }/>
)