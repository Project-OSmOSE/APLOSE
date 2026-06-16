import React from 'react';
import { NavigationMenu, type NavigationMenuListProps as BaseNavigationMenuListProps } from '@base-ui/react/navigation-menu';
import styles from './NavigationMenu.module.scss';

export type NavigationMenuListProps = Omit<BaseNavigationMenuListProps, 'style' | 'className'>

export const List: React.FC<NavigationMenuListProps> = React.memo((props) => (
    <NavigationMenu.List className={ styles.List } { ...props } />
))
