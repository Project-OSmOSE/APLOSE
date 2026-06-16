import React, { Fragment } from 'react';
import { useLogout } from '@/api';
import { Button, ExternalLink, Link } from '@/components/base/Button';
import { NavigationMenu } from '@/components/base/NavigationMenu';
import styles from './layout.module.scss';
import logo from '/images/ode_logo_192x192.png';
import { UserComponents } from '@/features/User';
import { useLoaderData } from '@tanstack/react-router';

export const Navbar: React.FC = () => {
    const { logout } = useLogout()
    const { user } = useLoaderData({ from: '/_authenticated' })

    return <Fragment>
        <NavigationMenu.Root className={ [ styles.NavigationRoot, styles.large ].join(' ') }>
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

                { user.isAdmin && <Fragment>
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
                { user.isSuperuser && <Fragment>
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
                        <UserComponents.Avatar user={ user }/>
                    </NavigationMenu.Trigger>
                    <NavigationMenu.Content>
                        <div className={ styles.Submenu }>

                            <Button color="warning" onClick={ logout }>Logout</Button>

                            { user.isAdmin && <Fragment>
                                <ExternalLink href="/backend/admin" target="_blank">Admin</ExternalLink>
                            </Fragment> }

                            <Link to="/account">Account</Link>

                        </div>
                    </NavigationMenu.Content>
                </NavigationMenu.Item>
            </NavigationMenu.List>

            <NavigationMenu.Portal>
                <NavigationMenu.Positioner side="right"
                                           sideOffset={ 10 }
                                           collisionPadding={ { top: 5, bottom: 20, left: 20, right: 20 } }
                                           collisionAvoidance={ { side: 'none' } }>
                    <NavigationMenu.Popup>
                        <NavigationMenu.Arrow/>
                        <NavigationMenu.Viewport/>
                    </NavigationMenu.Popup>
                </NavigationMenu.Positioner>
            </NavigationMenu.Portal>
        </NavigationMenu.Root>
        <NavigationMenu.Root className={ [ styles.NavigationRoot, styles.phone ].join(' ') }>
            <NavigationMenu.List>
                <NavigationMenu.Item>
                    <Link to="/annotation-campaign" className={ styles.Title }>
                        <img src={ logo } alt="APLOSE"/>
                        <h1>APLOSE</h1>
                    </Link>
                </NavigationMenu.Item>
            </NavigationMenu.List>
        </NavigationMenu.Root>
        {/*<div className={ [ styles.navbar, isOpen ? styles.opened : styles.closed, className ].join(' ') }>*/}

        {/*    <div className={ styles.title }>*/}
        {/*        <Link to="/annotation-campaign">*/}
        {/*            <img src={ logo } alt="APLOSE"/>*/}
        {/*            <h1>APLOSE</h1>*/}
        {/*        </Link>*/}

        {/*        <IonButton fill="outline" color="medium"*/}
        {/*                   className={ styles.toggle } onClick={ toggleOpening }>*/}
        {/*            <IonIcon icon={ isOpen ? closeOutline : menuOutline } slot="icon-only"/>*/}
        {/*        </IonButton>*/}
        {/*    </div>*/}

        {/*</div>*/}
    </Fragment>
}