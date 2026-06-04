import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { closeOutline, menuOutline } from 'ionicons/icons/index.js';
import { useLogout } from '@/api';
import { ExternalLink, Link } from '@/components/base/Button';
import styles from './layout.module.scss';
import logo from '/images/ode_logo_192x192.png';
import { useQuery } from '@tanstack/react-query';
import { User } from '@/features';
import { useLocation } from '@tanstack/react-router';

export const Navbar: React.FC<{ className?: string }> = ({ className }) => {
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    const { logout } = useLogout()
    const { data: user } = useQuery(User.API.currentQuery)

    const toggleOpening = useCallback(() => {
        setIsOpen(previous => !previous);
    }, [ setIsOpen ])

    const close = useCallback(() => setIsOpen(false), [ setIsOpen ])

    // Close on navigation
    const location = useLocation()
    useEffect(() => {
        close()
    }, [ location ]);

    return (
        <div className={ [ styles.navbar, isOpen ? styles.opened : styles.closed, className ].join(' ') }>

            <div className={ styles.title }>
                <Link to="/annotation-campaign">
                    <img src={ logo } alt="APLOSE"/>
                    <h1>APLOSE</h1>
                </Link>

                <IonButton fill="outline" color="medium"
                           className={ styles.toggle } onClick={ toggleOpening }>
                    <IonIcon icon={ isOpen ? closeOutline : menuOutline } slot="icon-only"/>
                </IonButton>
            </div>

            <div className={ styles.navContent }>

                <div className={ styles.links }>
                    <Link to="/annotation-campaign">
                        Annotation campaigns
                    </Link>
                    { user?.isAdmin && <Fragment>
                        <Link to="/dataset">
                            Datasets
                        </Link>
                        <Link to="/storage">
                            Storage
                        </Link>
                    </Fragment> }
                </div>

                { user?.isAdmin && <Fragment>
                    <ExternalLink href="/backend/admin" target="_blank">Admin</ExternalLink>
                </Fragment> }

                { user?.isSuperuser && <Fragment>
                    <Link to="/ontology/$type"
                          params={ { type: 'source' } }>
                        Ontology
                    </Link>
                    <Link to="/sql">
                        SQL query
                    </Link>
                </Fragment> }

                <Link to="/account">Account</Link>

                <IonButton className={ styles.logoutButton }
                           color={ 'medium' }
                           onClick={ () => logout() }>
                    Logout
                </IonButton>
            </div>
        </div>)
}