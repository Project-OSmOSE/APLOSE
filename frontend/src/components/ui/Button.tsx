import React, { useCallback, useEffect, useState } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { chevronBackOutline } from 'ionicons/icons/index.js';
import { TooltipOverlay } from './Tooltip';
import { Link } from './Link';
import { helpOutline } from 'ionicons/icons';

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

  const [ from, setFrom ] = useState<string | undefined>();
  const [ isBackAsked, setIsBackAsked ] = useState<boolean>(false);

  useEffect(() => {
    if (location.state?.from) setFrom(location.state?.from)
  }, [location])

  useEffect(() => {
    if (isBackAsked && location.state?.from !== location.pathname) {
      navigate(-1)
    }
  }, [location, from, isBackAsked])

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

export const HelpButton: React.FC<{ url: string }> = ({ url }) => {
  const open = useCallback(() => window.open(url, '_blank'), [])
  return <Button fill="clear" color="warning" onClick={ open }>
    Help
    <IonIcon icon={ helpOutline } slot="end"/>
  </Button>
}
