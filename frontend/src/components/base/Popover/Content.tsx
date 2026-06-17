import React, { type ReactNode } from 'react';
import { Popover } from '@base-ui/react/popover'
import styles from './Popover.module.scss';

export const Content: React.FC<{children: ReactNode}> = ({ children }) => (
    <Popover.Portal>
        <Popover.Positioner sideOffset={ 8 }>
            <Popover.Popup className={ styles.Popup }>
                { children }
            </Popover.Popup>
        </Popover.Positioner>
    </Popover.Portal>
)
