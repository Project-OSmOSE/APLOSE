import React from 'react';
import { CloseCircle } from '@solar-icons/react';
import styles from './Chip.module.scss'

export type ChipRemoveProps = {
    onClick?: () => void;
}

export const ChipRemove: React.FC<ChipRemoveProps> = (props) => (
    <CloseCircle weight="Bold"
                 className={ styles.ChipRemove }
                 { ...props }/>
)