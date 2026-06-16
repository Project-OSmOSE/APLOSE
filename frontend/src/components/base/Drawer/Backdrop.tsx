import React from 'react';
import { Drawer, type DrawerBackdropProps as BaseProps } from '@base-ui/react/drawer';
import styles from './Drawer.module.scss';

export type DrawerBackdropProps = Omit<BaseProps, 'className'>

export const Backdrop: React.FC<DrawerBackdropProps> = React.memo((props) => (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    <Drawer.Backdrop className={ styles.Backdrop }
                            { ...props } />
))
