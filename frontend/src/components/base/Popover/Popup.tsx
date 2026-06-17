import React from 'react';
import { Popover, type PopoverPopupProps as BaseProps } from '@base-ui/react/popover';
import styles from './Popover.module.scss';

export type PopoverPopupProps = Omit<BaseProps, 'className'>

export const Popup: React.FC<PopoverPopupProps> = React.memo((props) => (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    <Popover.Popup className={ styles.Popup }
                            { ...props } />
))
