import React, { Fragment, ReactNode, useCallback, useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query';
import { IonButton, IonIcon } from '@ionic/react';
import { closeOutline, menuOutline } from 'ionicons/icons/index.js';

import { DocumentationButton, Link } from '@/components/ui';

import { User } from '@/features';

import logo from '/images/ode_logo_192x192.png';
import styles from './layout.module.scss'

export const Header: React.FC<{
    buttons?: ReactNode;
    children?: ReactNode;
    size?: 'small' | 'default';
    canNavigate?: () => Promise<boolean>;
}> = ({ children, buttons, size, canNavigate }) => {
    const { data: user } = useQuery(User.API.currentQuery)

    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    const navigate = useNavigate();

    const toggleOpening = useCallback(() => setIsOpen(previous => !previous), [])

    const onAPLOSEClick = useCallback(async () => {
        if (user) {
            if (!canNavigate || await canNavigate()) {
                await navigate({ to: `/annotation-campaign` });
            }
        } else {
            await navigate({ to: `/` });
        }
    }, [ user, navigate, canNavigate ])

    const onAPLOSEAuxClick = useCallback(() => {
        window.open('/', '_blank');
    }, [])

    return (
        <header
            className={ [ styles.header, isOpen ? styles.opened : styles.closed, size === 'small' ? styles.small : '', children ? styles.withInfo : '' ].join(' ') }>
            <div className={ styles.title } onClick={ onAPLOSEClick } onAuxClick={ onAPLOSEAuxClick }>
                <img src={ logo } alt="OSmOSE"/>
                <h1>APLOSE</h1>
            </div>

            <IonButton fill="outline" color="medium"
                       className={ styles.toggle } onClick={ toggleOpening }>
                <IonIcon icon={ isOpen ? closeOutline : menuOutline } slot="icon-only"/>
            </IonButton>

            { children && <div className={ styles.info }>{ children }</div> }

            <div className={ styles.links }>
                <DocumentationButton size={ size }/>

                { buttons }

            </div>
        </header>
    )
}

export const PublicHeader: React.FC = () => {
    const { data: user } = useQuery(User.API.currentQuery)

    return useMemo(() =>
            <Header buttons={ <Fragment>
                <Link size="large" to={ user ? '/annotation-campaign' : '/login' }>
                    { user ? 'APLOSE' : 'Login' }
                </Link>
                <Link href="/" size="large">OSmOSE</Link>
            </Fragment>
            }/>,
        [ user ],
    )
}
