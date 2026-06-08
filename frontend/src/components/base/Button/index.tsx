import React, { type ReactNode, useCallback, useMemo } from 'react';
import { ExternalLink } from './ExternalLink';
import { Copy, Help } from '@solar-icons/react';
import { Button } from './Button';
import { Toast } from '@/components/base/Toast';

export * from './Button';
export * from './ButtonGroup';
export * from './ExternalLink';
export * from './Link';


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
    const toastManager = Toast.useToastManager();

    const copy = useCallback(async () => {
        await navigator.clipboard.writeText(typeof stack == 'string' ? stack : JSON.stringify(stack))
        toastManager.add({
            title: 'Copied!',
            description: `Error stack trace has been copied into the clipboard`,
            type: 'success',
        })
    }, [ toastManager, stack ])

    return useMemo(() =>
            <Button color="danger" onClick={ copy }>
                <Copy weight="Linear" size={ 24 }/>
                { withLabel && 'Copy error stack trace' }
            </Button>
        , [ copy, withLabel ])
}

