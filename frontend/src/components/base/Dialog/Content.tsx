import React, { type ReactNode } from 'react';
import { Dialog } from '@base-ui/react/dialog'
import styles from './Dialog.module.scss';

export const Content: React.FC<{ children: ReactNode }> = ({ children }) => (
    <Dialog.Portal>
        <Dialog.Backdrop className={ styles.Backdrop }/>
        <Dialog.Popup className={ styles.Popup }>
            { children }
        </Dialog.Popup>
    </Dialog.Portal>
)
