import React, { Fragment, type ReactNode } from 'react';
import { Dialog } from '@base-ui/react/dialog'
import styles from './Dialog.module.scss';

export const Content: React.FC<{ children: ReactNode, alert?: boolean }> = ({ children, alert }) => {
    return <Fragment>
        <Dialog.Backdrop className={ styles.Backdrop }/>
        <Dialog.Popup className={ [ styles.Popup, alert ? styles.Alert : '' ].join(' ') }>
            { children }
        </Dialog.Popup>
    </Fragment>
}
