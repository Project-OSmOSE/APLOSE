import React, { Fragment, type ReactNode, useEffect } from 'react';
import { Dialog } from '@base-ui/react/dialog'
import styles from './Dialog.module.scss';
import { useEvent } from '@/components/ui/Event';

export const Content: React.FC<{ children: ReactNode, alert?: boolean }> = ({ children, alert }) => {
    const { enableShortcuts, disableShortcuts } = useEvent()
    useEffect(() => {
        disableShortcuts()
        return () => {
            enableShortcuts()
        }
    }, []);
    return <Fragment>
        <Dialog.Backdrop className={ styles.Backdrop }/>
        <Dialog.Popup className={ [ styles.Popup, alert ? styles.Alert : '' ].join(' ') }>
            { children }
        </Dialog.Popup>
    </Fragment>
}
