import React, { Fragment } from 'react';
import { Button, ExternalLink, Link } from '@/components/base/Button';

import { NavigationMenu } from '@/components/base/NavigationMenu';
import { UserComponent } from '@/features/User';
import styles from './Navigation.module.scss';
import logo from '/images/logo/x96.png';
import { useLogout } from '@/api';
import { useLoaderData } from '@tanstack/react-router';
import { Mx } from '@/features/Mx';

export const Authenticated: React.FC<{ className?: string }> = ({ className }) => {
    const { logout } = useLogout()
    const data = useLoaderData({ from: '/_authenticated' })

    return <NavigationMenu.Root className={ [ styles.Navigation, className ].join(' ') }>
        <NavigationMenu.List>
            <NavigationMenu.Item>
                <Link to="/annotation-campaign" className={ styles.Title }>
                    <img src={ logo } alt="APLOSE"/>
                    <h1>APLOSE</h1>
                </Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
                <Link to="/annotation-campaign">
                    Annotation campaigns
                </Link>
            </NavigationMenu.Item>

            { data?.user.isAdmin && <Fragment>
                <NavigationMenu.Item>
                    <Link to="/dataset">
                        Datasets
                    </Link>
                </NavigationMenu.Item>

                <NavigationMenu.Item>
                    <Link to="/storage">
                        Storage
                    </Link>
                </NavigationMenu.Item>
            </Fragment> }
        </NavigationMenu.List>

        <NavigationMenu.List>
            { data?.user.isSuperuser && <Fragment>
                <NavigationMenu.Item>
                    <Link to="/ontology/$type"
                          params={ { type: 'source' } }>
                        Ontology
                    </Link>
                </NavigationMenu.Item>

                <NavigationMenu.Item>
                    <Link to="/sql">
                        SQL query
                    </Link>
                </NavigationMenu.Item>
            </Fragment> }

            <NavigationMenu.Item>
                <NavigationMenu.Trigger>
                    { data && <UserComponent.Avatar user={ data?.user }/> }
                </NavigationMenu.Trigger>
                <NavigationMenu.Content>
                    <div className={ styles.Submenu }>

                        <Button color="warning" onClick={ logout }>Logout</Button>

                        { data?.user.isSuperuser &&
                            <Mx.Link/> }

                        { data?.user.isAdmin &&
                            <ExternalLink href="/backend/admin" target="_blank">Admin</ExternalLink> }


                        <Link to="/account">Account</Link>

                    </div>
                </NavigationMenu.Content>
            </NavigationMenu.Item>
        </NavigationMenu.List>

        <NavigationMenu.Portal/>
    </NavigationMenu.Root>
}
