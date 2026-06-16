import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@/components/base/Button';

import { NavigationMenu } from '@/components/base/NavigationMenu';
import { UserAPI } from '@/features/User';
import styles from './Navigation.module.scss';
import logo from '/images/logo/x96.png';

export const Public: React.FC = () => {
    const { data: user } = useQuery(UserAPI.currentQuery)

    return <NavigationMenu.Root className={ [ styles.Navigation, styles.NavigationRoot, styles.Public ].join(' ') }>
        <NavigationMenu.List>
            <NavigationMenu.Item>
                <Link to="/" className={ styles.Title }>
                    <img src={ logo } alt="APLOSE"/>
                    <h1>APLOSE</h1>
                </Link>
            </NavigationMenu.Item>
        </NavigationMenu.List>

        <NavigationMenu.List>
            <NavigationMenu.Item>
                <Link color="primary" to={ user ? '/annotation-campaign' : '/login' }>
                    { user ? 'APLOSE' : 'Login' }
                </Link>
            </NavigationMenu.Item>
        </NavigationMenu.List>
    </NavigationMenu.Root>
}
