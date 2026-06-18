import React, { Fragment } from 'react';
import { Button, ExternalLink, Link } from '@/components/base/Button';

import { NavigationMenu } from '@/components/base/NavigationMenu';
import { Drawer } from '@/components/base/Drawer';
import styles from './Navigation.module.scss';
import logo from '/images/logo/x96.png';
import { useLogout } from '@/api';
import { useLoaderData } from '@tanstack/react-router';

export const AuthenticatedMobile: React.FC<{ className?: string }> = ({ className }) => {
    const { logout } = useLogout()
    const data = useLoaderData({ from: '/_authenticated' })

    return <NavigationMenu.Root className={ [ styles.Navigation, styles.Mobile, className ].join(' ') }>
        <NavigationMenu.List>
            <NavigationMenu.Item>
                <Link to="/annotation-campaign" className={ styles.Title }>
                    <img src={ logo } alt="APLOSE"/>
                    <h1>APLOSE</h1>
                </Link>
            </NavigationMenu.Item>
        </NavigationMenu.List>

        <NavigationMenu.List>
            <NavigationMenu.Item>
                <Drawer.Root>
                    <Drawer.Trigger>Menu</Drawer.Trigger>
                    <Drawer.Content>
                        <NavigationMenu.Root className={ styles.InnerNav }>
                            <NavigationMenu.List>
                                <NavigationMenu.Item>
                                    <Drawer.Close/>
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
                                    { data?.user.isAdmin && <ExternalLink href="/backend/admin"
                                                                    target="_blank">Admin</ExternalLink> }
                                </NavigationMenu.Item>

                                <NavigationMenu.Item>
                                    <Link to="/account">Account</Link>
                                </NavigationMenu.Item>

                                <NavigationMenu.Item>
                                    <Button color="warning" onClick={ logout }>Logout</Button>
                                </NavigationMenu.Item>
                            </NavigationMenu.List>
                        </NavigationMenu.Root>
                    </Drawer.Content>
                </Drawer.Root>
            </NavigationMenu.Item>
        </NavigationMenu.List>
    </NavigationMenu.Root>
}
