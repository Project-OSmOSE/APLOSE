import React from 'react';
import { NavigationMenu, type NavigationMenuTriggerProps as BaseProps } from '@base-ui/react/navigation-menu';
import styles from './NavigationMenu.module.scss';

export type NavigationMenuTriggerProps = Omit<BaseProps, 'className'>

export const Trigger: React.FC<NavigationMenuTriggerProps> = React.memo((props) => (
    <NavigationMenu.Trigger className={ styles.Trigger } { ...props } />
))
