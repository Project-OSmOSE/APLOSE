import React from 'react';
import { CloseCircle } from '@solar-icons/react';
import styles from './Chip.module.scss'

export type ChipRemoveProps = {
    onClick?: () => void;
}

export const ChipRemove = React.forwardRef<SVGSVGElement, ChipRemoveProps>(({ onClick, ...props }, ref) => (
    <CloseCircle ref={ ref }
                 weight="Bold"
                 className={ styles.ChipRemove }
                 onClick={ onClick }
                 { ...props }/>
))