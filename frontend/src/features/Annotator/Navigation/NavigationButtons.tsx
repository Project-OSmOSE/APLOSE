import React, { useCallback } from 'react';
import styles from './styles.module.scss';
import { Kbd, TooltipOverlay } from '@/components/ui';
import { IonButton, IonIcon } from '@ionic/react';
import { caretBack, caretForward } from 'ionicons/icons/index.js';
import { useAnnotationTask } from '@/api';
import { useAnnotatorCanNavigate, useOpenAnnotator } from './hooks';
import { useKeyDownEvent } from '@/features/UX/Events';
import { useAnnotatorSubmit } from '@/features/Annotator';
import { useAppSelector } from '@/features/App';
import { selectTaskIsEditionAuthorized } from '@/features/Annotator/selectors';

export const NavigationButtons: React.FC = () => {
  const isEditionAuthorized = useAppSelector(selectTaskIsEditionAuthorized)
  const { navigationInfo } = useAnnotationTask()
  const canNavigate = useAnnotatorCanNavigate()
  const openAnnotator = useOpenAnnotator()
  const { submit, isLoading } = useAnnotatorSubmit()

  const navPrevious = useCallback(async () => {
    if (isLoading) return;
    if (!navigationInfo?.previousSpectrogramId) return;
    if (await canNavigate()) openAnnotator(navigationInfo.previousSpectrogramId)
  }, [ openAnnotator, isLoading, navigationInfo ])
  const navNext = useCallback(async () => {
    if (isLoading) return;
    if (!navigationInfo?.nextSpectrogramId) return;
    if (await canNavigate()) openAnnotator(navigationInfo.nextSpectrogramId)
  }, [ canNavigate, openAnnotator, isLoading, navigationInfo ])

  useKeyDownEvent([ 'ArrowLeft' ], navPrevious)
  useKeyDownEvent([ 'ArrowRight' ], navNext)

  if (!isEditionAuthorized) return <div/>
  return (
    <div className={ styles.navigation }>
      <TooltipOverlay title="Shortcut" tooltipContent={ <p><Kbd keys="left"/> : Load previous recording</p> }>
        <IonButton color="medium" fill="clear" size="small"
                   disabled={ isLoading || !navigationInfo?.previousSpectrogramId }
                   onClick={ navPrevious }>
          <IonIcon icon={ caretBack } slot="icon-only"/>
        </IonButton>
      </TooltipOverlay>
      <TooltipOverlay title="Shortcut" tooltipContent={ <p><Kbd keys="enter"/> : Submit & load next recording</p> }>
        <IonButton color="medium" fill="outline"
                   disabled={ isLoading }
                   onClick={ submit }>
          Submit &amp; load next recording
        </IonButton>
      </TooltipOverlay>
      <TooltipOverlay title="Shortcut" tooltipContent={ <p><Kbd keys="right"/> : Load next recording</p> }>
        <IonButton color="medium" fill="clear" size="small"
                   disabled={ isLoading || !navigationInfo?.nextSpectrogramId }
                   onClick={ navNext }>
          <IonIcon icon={ caretForward } slot="icon-only"/>
        </IonButton>
      </TooltipOverlay>
    </div>
  )
}