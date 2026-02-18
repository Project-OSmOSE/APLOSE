import React, { Fragment, HTMLAttributeAnchorTarget, type MouseEvent, ReactNode, useCallback } from 'react';
import { To, useLocation, useNavigate } from 'react-router-dom';
import { IonButton, IonIcon } from '@ionic/react';
import { Color } from '@ionic/core';
import { openOutline } from 'ionicons/icons/index.js';
import { Button } from './Button';

export type LinkProps = {
    href?: string | undefined;
    appPath?: To | undefined;
    replace?: boolean;
    children: ReactNode;
    color?: Color;
    size?: 'small' | 'default' | 'large';
    fill?: 'clear' | 'outline' | 'solid' | 'default';
    className?: string;
    target?: HTMLAttributeAnchorTarget | undefined;
    onClick?: () => void;
} & React.ComponentProps<typeof IonButton>
export const Link: React.FC<LinkProps> = ({
                                              children,
                                              color = 'dark',
                                              href,
                                              size,
                                              target,
                                              fill = 'clear',
                                              appPath,
                                              className,
                                              onClick,
                                              replace = false,
                                              ...props
                                          }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const open = useCallback((event: MouseEvent) => {
        event.stopPropagation()
        if (appPath) navigate(appPath, { replace, state: { from: location.pathname } })
        if (onClick) onClick()
    }, [ appPath, location, navigate, onClick ])

    const openAux = useCallback(() => window.open(`/app${ appPath }`, '_blank'), [ appPath ])

    if (href !== undefined) return <a style={ { textDecoration: 'none' } } className={ className }
                                      target={ target } rel="noopener, noreferrer"
                                      href={ href }
                                      onClick={ onClick }>
        <Button color={ color } fill={ fill } size={ size } { ...props }>
            { children }
            { target === '_blank' && <IonIcon icon={ openOutline } slot="end"/> }
        </Button>
    </a>
    if (appPath !== undefined) return <Button color={ color } fill={ fill } size={ size }
                                              className={ className }
                                              onClick={ target === '_blank' ? openAux : open }
                                              onAuxClick={ target === '_blank' ? undefined : openAux }
                                              { ...props }>
        { children }
        { target === '_blank' && <IonIcon icon={ openOutline } slot="end"/> }
    </Button>
    return <Fragment/>
}
