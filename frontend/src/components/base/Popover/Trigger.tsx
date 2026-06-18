import React from 'react';
import { Popover, type PopoverTriggerProps as BaseProps } from '@base-ui/react/popover';
import styles from './Popover.module.scss';

export type PopoverTriggerProps = Omit<BaseProps, 'className'>

export const Trigger: React.FC<PopoverTriggerProps> = React.memo((props) => (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    <Popover.Trigger className={ styles.Trigger }
                            { ...props } />
))
