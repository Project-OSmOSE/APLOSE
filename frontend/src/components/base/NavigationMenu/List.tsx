import React from 'react';
import { NavigationMenu, type NavigationMenuListProps as BaseNavigationMenuListProps } from '@base-ui/react/navigation-menu';
import styles from './NavigationMenu.module.scss';

export type NavigationMenuListProps = Omit<BaseNavigationMenuListProps, 'style' | 'className'> & {
    horizontal?: boolean;
}

export const List: React.FC<NavigationMenuListProps> = React.memo(({ horizontal, ...props }) => {
    const classes = [styles.List]
    if (horizontal) classes.push(styles.horizontal);
    return <NavigationMenu.List className={ classes.join(' ') } { ...props } />
})
