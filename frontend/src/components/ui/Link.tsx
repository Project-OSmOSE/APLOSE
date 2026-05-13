import React, { Fragment, HTMLAttributeAnchorTarget, useMemo } from 'react';
import { Link as RouterLink, type LinkComponentProps } from '@tanstack/react-router';
import { IonButton, IonIcon } from '@ionic/react';
import { openOutline } from 'ionicons/icons/index.js';

import { Button } from './Button';

export type LinkProps = {
    href?: string | undefined;
    replace?: boolean;
    target?: HTMLAttributeAnchorTarget | undefined;
    onClick?: () => void; // Override to avoir param type mismatch
} & React.ComponentProps<typeof IonButton> & Partial<Pick<LinkComponentProps, 'to' | 'params' | 'search'>>
export const Link: React.FC<LinkProps> = ({
                                              children,
                                              href,
                                              target,
                                              to, params, search,
                                              className,
                                              onClick,
                                              replace = false,
                                              ...props
                                          }) => {

    const button = useMemo(() => <Button { ...props }>
        { children }
        { target === '_blank' && <IonIcon icon={ openOutline } slot="end"/> }
    </Button>, [ props, target, children ])

    return useMemo(() => {
        if (href !== undefined) return <a style={ { textDecoration: 'none' } }
                                          className={ className }
                                          target={ target }
                                          rel="noopener, noreferrer"
                                          href={ href }
                                          onClick={ onClick }
                                          children={ button }/>
        if (to !== undefined) return <RouterLink to={ to } params={ params } search={search}
                                                 replace={ replace }
                                                 target={ target }
                                                 onClick={ onClick }
                                                 children={ button }/>
        return <Fragment/>
    }, [ button, className, target, href, onClick, to, replace, params ])
}
