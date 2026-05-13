import React, { Fragment, useCallback, useMemo } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { useCanGoBack, useRouter } from '@tanstack/react-router'
import { chevronBackOutline } from 'ionicons/icons/index.js';
import { copyOutline, helpBuoyOutline } from 'ionicons/icons';

import { useToast } from '@/components/ui/toast.hook';
import { TooltipOverlay } from './Tooltip';
import { Link } from './Link';


type Props = {
    disabledExplanation?: string;
} & React.ComponentProps<typeof IonButton>

export const Button: React.FC<Props> = ({ disabledExplanation, disabled, ...props }) => {

    if (disabled && disabledExplanation) return <TooltipOverlay tooltipContent={ <p>{ disabledExplanation }</p> }>
        <IonButton disabled={ disabled } { ...props }/>
    </TooltipOverlay>

    return <IonButton disabled={ disabled } { ...props }/>
}

export const DocumentationButton: React.FC<{
    size?: 'small' | 'default' | 'large';
}> = ({ size }) => (
    <Link color="medium" href="/doc/" size={ size } target="_blank">Documentation</Link>
)

export const BackButton: React.FC = () => {
    const router = useRouter()
    const canGoBack = useCanGoBack()

    return useMemo(() => {
        if (!canGoBack) return <Fragment/>
        return <IonButton fill="clear"
                   color="medium"
                   style={ {
                       position: 'absolute',
                       left: '1rem',
                       top: '50%',
                       transform: 'translateY(-50%)',
                   } }
                   onClick={ () => router.history.back() }>
            <IonIcon icon={ chevronBackOutline } slot="start"/>
            Back
        </IonButton>
    }, [canGoBack, router])
}

export const HelpButton: React.FC<{ url: string, label?: string }> = ({ url, label }) => {
    return <Button fill="clear" color="warning" onClick={ () => window.open(url, '_blank') }>
        { label ?? 'Help' }
        <IonIcon icon={ helpBuoyOutline } slot="end"/>
    </Button>
}

export const CopyErrorStackButton: React.FC<{ stack: any, withLabel?: boolean }> = ({ stack, withLabel }) => {
    const toast = useToast();

    const copy = useCallback(async () => {
        await navigator.clipboard.writeText(typeof stack == 'string' ? stack : JSON.stringify(stack))
        toast.present(`Error stack trace has been copied into the clipboard`, 'medium')
    }, [ toast, stack ])

    return useMemo(() =>
            <Button fill="clear" color="danger" size="small" onClick={ copy }>
                <IonIcon icon={ copyOutline } slot={ withLabel ? 'start' : 'icon-only' }/>
                { withLabel && 'Copy error stack trace' }
            </Button>
        , [ copy, withLabel ])
}
