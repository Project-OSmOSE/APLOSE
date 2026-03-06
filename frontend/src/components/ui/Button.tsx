import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { chevronBackOutline } from 'ionicons/icons/index.js';
import { TooltipOverlay } from './Tooltip';
import { Link } from './Link';
import { copyOutline, helpBuoyOutline } from 'ionicons/icons';
import { useToast } from '@/components/ui/toast.hook';

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
    const navigate = useNavigate()
    const location = useLocation()

    const [ isBackAsked, setIsBackAsked ] = useState<boolean>(false);

    useEffect(() => {
        if (isBackAsked && location.state?.from !== location.pathname) {
            navigate(-1)
        }
    }, [ location, isBackAsked ])

    const onBack = useCallback(() => {
        setIsBackAsked(true)
    }, [ navigate ])

    return <IonButton fill="clear"
                      color="medium"
                      style={ {
                          position: 'absolute',
                          left: '1rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                      } }
                      onClick={ onBack }>
        <IonIcon icon={ chevronBackOutline } slot="start"/>
        Back
    </IonButton>
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
        toast.presentInfo(`Error stack trace has been copied into the clipboard`)
    }, [ toast, stack ])

    return useMemo(() =>
            <Button fill="clear" color="danger" size="small" onClick={ copy }>
                <IonIcon icon={ copyOutline } slot={ withLabel ? 'start' : 'icon-only' }/>
                { withLabel && 'Copy error stack trace' }
            </Button>
        , [ copy, withLabel ])
}
