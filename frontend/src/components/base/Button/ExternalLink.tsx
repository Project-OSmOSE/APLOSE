import React, { type AnchorHTMLAttributes, Fragment } from 'react';
import { Button, type ButtonProps } from './Button';
import { SquareTopDown } from '@solar-icons/react';
import { NBSP } from '@/service/type';
import styles from './Button.module.scss';

export type ExternalLinkProps = Omit<ButtonProps, 'onClick'> & Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'href'>

export const ExternalLink: React.FC<ExternalLinkProps> = React.memo(({ href, target, children, ...props }) => (
    <a href={ href } target={ target } className={styles.ExternalLink}>
        <Button { ...props }>
            { children }{ target === '_blank' && <Fragment>{ NBSP }<SquareTopDown weight="Linear"/></Fragment> }
        </Button>
    </a>
))
