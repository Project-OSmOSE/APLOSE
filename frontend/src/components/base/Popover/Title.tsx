import React from 'react';
import { Popover, type PopoverTitleProps as BaseProps } from '@base-ui/react/popover'
import styles from './Popover.module.scss';

export type PopoverTitleProps = Omit<BaseProps, 'className'>

export const Title: React.FC<PopoverTitleProps> = (props) => (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    <Popover.Title className={ styles.Title }
                   { ...props } />
)
