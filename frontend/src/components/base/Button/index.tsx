import React, { type ReactNode, useCallback, useMemo } from 'react';
import { ExternalLink } from './ExternalLink';
import { Copy, Help } from '@solar-icons/react';
import { useToast } from '@/components/ui';
import { Button } from './Button';

export { Button, type ButtonProps } from './Button';
export { ButtonGroup, type ButtonGroupProps } from './ButtonGroup';
export { ExternalLink, type ExternalLinkProps } from './ExternalLink';
export { Link, type LinkProps } from './Link';


export const DocumentationButton: React.FC = React.memo(() => (
    <ExternalLink href="/doc/" target="_blank">Documentation</ExternalLink>
))

export const HelpButton: React.FC<{ url: string, children?: ReactNode }> = ({ url, children }) => {
    return <ExternalLink color="warning" target="_blank" href={ url }>
        { children ?? 'Help' }
        <Help weight="Linear" size={ 20 }/>
    </ExternalLink>
}

export const CopyErrorStackButton: React.FC<{ stack: any, withLabel?: boolean }> = ({ stack, withLabel }) => {
    const toast = useToast();

    const copy = useCallback(async () => {
        await navigator.clipboard.writeText(typeof stack == 'string' ? stack : JSON.stringify(stack))
        toast.present(`Error stack trace has been copied into the clipboard`, 'medium')
    }, [ toast, stack ])

    return useMemo(() =>
            <Button color="danger" onClick={ copy }>
                <Copy weight="Linear" size={ 24 }/>
                { withLabel && 'Copy error stack trace' }
            </Button>
        , [ copy, withLabel ])
}

