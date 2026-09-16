import React from 'react';
import { CloseCircleBoldIcon } from '@solar-icons/react';
import styles from './Chip.module.scss'

export type ChipRemoveProps = {
    onClick?: () => void;
}

export const ChipRemove = React.forwardRef<SVGSVGElement, ChipRemoveProps>(({ onClick, ...props }, ref) => (
    <CloseCircleBoldIcon ref={ ref }
                         className={ styles.ChipRemove }
                         onClick={ onClick }
                         { ...props }/>
))