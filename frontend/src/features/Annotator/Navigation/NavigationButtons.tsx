import React, { useCallback, useEffect, useRef } from 'react';
import styles from './styles.module.scss';
import { Kbd, TooltipOverlay } from '@/components/ui';
import { IonButton, IonIcon } from '@ionic/react';
import { caretBack, caretForward } from 'ionicons/icons';
import { useAnnotationTask } from '@/api';
import { useAnnotatorCanNavigate, useOpenAnnotator } from './hooks';
import { KEY_DOWN_EVENT, useEvent } from '@/features/UX/Events';
import { useAnnotatorSubmit } from '@/features/Annotator';

export const NavigationButtons: React.FC = () => {
  const { isEditionAuthorized, navigationInfo } = useAnnotationTask()
  const { canNavigate } = useAnnotatorCanNavigate()
  const { openAnnotator } = useOpenAnnotator()
  const { submit, isSubmitting } = useAnnotatorSubmit()
  const isFetchingRef = useRef<boolean>(isSubmitting)
  useEffect(() => {
    isFetchingRef.current = isSubmitting
  }, [ isSubmitting ]);

  const previousSpectrogramIdRef = useRef<string | undefined | null>(navigationInfo?.previousSpectrogramId);
  const nextSpectrogramIdRef = useRef<string | undefined | null>(navigationInfo?.nextSpectrogramId);
  useEffect(() => {
    previousSpectrogramIdRef.current = navigationInfo?.previousSpectrogramId;
    nextSpectrogramIdRef.current = navigationInfo?.nextSpectrogramId;
  }, [ navigationInfo ]);

  const navPrevious = useCallback(async () => {
    if (!previousSpectrogramIdRef.current) return;
    if (await canNavigate()) openAnnotator(previousSpectrogramIdRef.current)
  }, [ openAnnotator ])
  const navNext = useCallback(async () => {
    if (!nextSpectrogramIdRef.current) return;
    if (await canNavigate()) openAnnotator(nextSpectrogramIdRef.current)
  }, [ canNavigate, openAnnotator ])

  const onKbdEvent = useCallback((event: KeyboardEvent) => {
    if (isFetchingRef.current) return;
    switch (event.code) {
      case 'ArrowLeft':
        navPrevious();
        break;
      case 'ArrowRight':
        navNext();
        break;
    }
  }, [ navPrevious, navNext ])
  useEvent(KEY_DOWN_EVENT, onKbdEvent);

  if (!isEditionAuthorized) return <div/>
  return (
    <div className={ styles.navigation }>
      <TooltipOverlay title="Shortcut" tooltipContent={ <p><Kbd keys="left"/> : Load previous recording</p> }>
        <IonButton color="medium" fill="clear" size="small"
                   disabled={ isSubmitting || !navigationInfo?.previousSpectrogramId }
                   onClick={ navPrevious }>
          <IonIcon icon={ caretBack } slot="icon-only"/>
        </IonButton>
      </TooltipOverlay>
      <TooltipOverlay title="Shortcut" tooltipContent={ <p><Kbd keys="enter"/> : Submit & load next recording</p> }>
        <IonButton color="medium" fill="outline"
                   disabled={ isSubmitting }
                   onClick={ submit }>
          Submit &amp; load next recording
        </IonButton>
      </TooltipOverlay>
      <TooltipOverlay title="Shortcut" tooltipContent={ <p><Kbd keys="right"/> : Load next recording</p> }>
        <IonButton color="medium" fill="clear" size="small"
                   disabled={ isSubmitting || !navigationInfo?.nextSpectrogramId }
                   onClick={ navNext }>
          <IonIcon icon={ caretForward } slot="icon-only"/>
        </IonButton>
      </TooltipOverlay>
    </div>
  )
}