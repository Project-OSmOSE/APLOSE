import React from 'react';
import { Drawer, type DrawerViewportProps as BaseProps } from '@base-ui/react/drawer';
import styles from './Drawer.module.scss';

export type DrawerViewportProps = Omit<BaseProps, 'className'>

export const Viewport: React.FC<DrawerViewportProps> = React.memo((props) => (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    <Drawer.Viewport className={ styles.Viewport }
                            { ...props } />
))
