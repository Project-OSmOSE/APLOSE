import React, { Fragment, type ReactNode, useCallback, useMemo, useState } from 'react';
import styles from '../styles.module.scss';
import { IonNote } from '@ionic/react';
import { AltArrowDown, AltArrowRight } from '@solar-icons/react';
import { CopyErrorStackButton } from '@/components/ui';

export const Structure: React.FC<{
    openable?: boolean
    forceOpen?: boolean
    error?: any
    errorStack?: any
    itemClassName?: string
    children?: ReactNode
    icon: ReactNode
    name: ReactNode
    openIcon?: ReactNode
    otherInfo?: ReactNode
}> = ({ openable, forceOpen, error, errorStack, itemClassName, children, name, icon, openIcon, otherInfo }) => {
    const [ _isOpen, _setIsOpen ] = useState<boolean>(false);
    const isOpen = useMemo(() => openable && !error && (forceOpen || _isOpen), [ _isOpen, error ])
    const canToggle = useMemo(() => openable && !error && !forceOpen, [ forceOpen, error ])
    const toggleOpen = useCallback(() => {
        if (!canToggle) return;
        _setIsOpen(prev => !prev);
    }, [ _setIsOpen, canToggle ])

    return useMemo(() =>
            <div className={ styles.item }>
                <div onClick={ toggleOpen }
                     className={ itemClassName }>
                    { isOpen ? openIcon ?? icon : icon }

                    { name }

                    { canToggle && <IonNote>{ isOpen ? <AltArrowDown/> : <AltArrowRight/> }</IonNote> }

                    { otherInfo }

                    { error && <Fragment>
                        <IonNote color="danger">{ error }</IonNote>
                        { errorStack && <CopyErrorStackButton stack={ errorStack }/> }
                    </Fragment> }
                </div>

                { isOpen && children }
            </div>,
        [ toggleOpen, itemClassName, canToggle, isOpen, children, icon, openIcon, name, otherInfo, error, errorStack ],
    )
}