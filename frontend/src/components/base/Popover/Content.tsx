import React from 'react';
import { Popover, type PopoverPositionerProps } from '@base-ui/react/popover'
import styles from './Popover.module.scss';

export const Content: React.FC<Pick<PopoverPositionerProps, 'side' | 'align' | 'children' | 'className'>> = ({
                                                                                                                 children,
                                                                                                                 side,
                                                                                                                 align,
                                                                                                                 className,
                                                                                                             }) => (
    <Popover.Portal>
        <Popover.Positioner sideOffset={ 8 } side={ side } align={ align }>
            <Popover.Popup className={ [ styles.Popup, className ].join(' ') }>
                { children }
            </Popover.Popup>
        </Popover.Positioner>
    </Popover.Portal>
)
