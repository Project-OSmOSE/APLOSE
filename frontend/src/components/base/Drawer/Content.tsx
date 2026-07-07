import React, { type ReactNode } from 'react';
import { Drawer } from '@base-ui/react/drawer'
import styles from './Drawer.module.scss';

export const Content: React.FC<{ children: ReactNode }> = ({ children }) => (
    <Drawer.Portal>
        <Drawer.Backdrop className={ styles.Backdrop }/>
        <Drawer.Viewport className={ styles.Viewport }>
            <Drawer.Popup className={ styles.Popup }>
                { children }
            </Drawer.Popup>
        </Drawer.Viewport>
    </Drawer.Portal>
)
