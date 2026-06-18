import React, { type ReactNode } from 'react';
import { Popover, type PopoverPositionerProps } from '@base-ui/react/popover'
import styles from './Popover.module.scss';

export const Content: React.FC<{
    children: ReactNode
} & Pick<PopoverPositionerProps, 'side'>> = ({ children, side }) => (
    <Popover.Portal>
        <Popover.Positioner sideOffset={ 8 } side={ side }>
            <Popover.Popup className={ styles.Popup }>
                { children }
            </Popover.Popup>
        </Popover.Positioner>
    </Popover.Portal>
)
