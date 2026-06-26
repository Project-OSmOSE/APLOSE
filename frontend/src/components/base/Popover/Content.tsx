import React from 'react';
import { Popover, type PopoverPositionerProps } from '@base-ui/react/popover'
import styles from './Popover.module.scss';

export const Content: React.FC<Pick<PopoverPositionerProps, 'side' | 'children' | 'className'>> = ({
                                                                                                       children,
                                                                                                       side,
                                                                                                       className,
                                                                                                   }) => (
    <Popover.Portal>
        <Popover.Positioner sideOffset={ 8 } side={ side }>
            <Popover.Popup className={ [ styles.Popup, className ].join(' ') }>
                { children }
            </Popover.Popup>
        </Popover.Positioner>
    </Popover.Portal>
)
