import React from 'react';
import { Drawer, type DrawerPopupProps as BaseProps } from '@base-ui/react/drawer';
import styles from './Drawer.module.scss';

export type DrawerPopupProps = Omit<BaseProps, 'className'>

export const Popup: React.FC<DrawerPopupProps> = React.memo((props) => (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    <Drawer.Popup className={ styles.Popup }
                            { ...props } />
))
