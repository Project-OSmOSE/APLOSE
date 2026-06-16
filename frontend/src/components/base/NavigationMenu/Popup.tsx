import React from 'react';
import { NavigationMenu, type NavigationMenuPopupProps as BaseProps } from '@base-ui/react/navigation-menu';
import styles from './NavigationMenu.module.scss';

export type NavigationMenuPopupProps = Omit<BaseProps, 'className'>

export const Popup: React.FC<NavigationMenuPopupProps> = React.memo((props) => (
    <NavigationMenu.Popup className={ styles.Popup } { ...props } />
))
