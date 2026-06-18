import React from 'react';
import { Popover, type PopoverTriggerProps as BaseProps } from '@base-ui/react/popover';
import styles from './Popover.module.scss';

export type PopoverTriggerProps = BaseProps

export const Trigger: React.FC<PopoverTriggerProps> = React.memo(({ openOnHover, ...props }) => (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    <Popover.Trigger className={ styles.Trigger }
                     render={ props => <div { ...props }/> }
                     openOnHover={ openOnHover === undefined ? true : openOnHover }
                     { ...props } />
))
