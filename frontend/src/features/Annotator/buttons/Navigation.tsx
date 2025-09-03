import React, { useEffect, useRef } from "react";
import styles from '../styles.module.scss'
import { useNavigate } from "react-router-dom";
import { IonButton, IonIcon } from "@ionic/react";
import { caretBack, caretForward } from "ionicons/icons";
import { useToast } from "@/service/ui";
import { Kbd, TooltipOverlay } from "@/components/ui";
import { KEY_DOWN_EVENT, useEvent } from "@/service/events";
import { useRetrieveCurrentCampaign } from "@/service/api/campaign.ts";
import { useRetrieveCurrentPhase } from "@/service/api/campaign-phase.ts";
import { usePostAnnotator } from "@/service/api/annotator.ts";
import { useAnnotatorNavigation, useAnnotatorQuery, useAnnotatorUI } from "@/features/Annotator";


export const NavigationButtons: React.FC = () => {
  const { data, canEdit } = useAnnotatorQuery();
  const { campaignID } = useRetrieveCurrentCampaign()
  const { phaseType } = useRetrieveCurrentPhase()
  const { openAnnotator } = useAnnotatorNavigation()
  const { didSeeAllFile: _didSeeAllFile } = useAnnotatorUI()

  // Services
  const navigate = useNavigate();
  const post = usePostAnnotator();
  const toast = useToast();

  // Data

  const previous_file_id = useRef<string | undefined | null>(data?.spectrogramPrevNext?.previousId);
  const next_file_id = useRef<string | undefined | null>(data?.spectrogramPrevNext?.nextId);
  useEffect(() => {
    previous_file_id.current = data?.spectrogramPrevNext?.previousId;
    next_file_id.current = data?.spectrogramPrevNext?.nextId;
  }, [ data ]);
  const didSeeAllFile = useRef<boolean>(_didSeeAllFile);
  useEffect(() => {
    didSeeAllFile.current = _didSeeAllFile;
  }, [ _didSeeAllFile ]);

  const isSubmitting = useRef<boolean>(false);

  const { canNavigate } = useAnnotatorNavigation()

  function onKbdEvent(event: KeyboardEvent) {
    switch (event.code) {
      case 'Enter':
      case 'Tab':
      case 'NumpadEnter':
        event.preventDefault();
        submit();
        break;
      case 'ArrowLeft':
        navPrevious();
        break;
      case 'ArrowRight':
        navNext();
        break;
    }
  }

  useEvent(KEY_DOWN_EVENT, onKbdEvent);

  const submit = async () => {
    if (!didSeeAllFile.current) {
      const force = await toast.presentError('Be careful, you haven\' see all of the file yet. Try scrolling to the end or changing the zoom level', true, 'Force');
      if (!force) return;
    }
    isSubmitting.current = true;
    try {
      await post()
      if (next_file_id.current) {
        openAnnotator(next_file_id.current);
      } else {
        navigate(`/annotation-campaign/${ campaignID }/phase/${ phaseType }`)
      }
    } catch (e: any) {
      toast.presentError(e)
    } finally {
      isSubmitting.current = false;
    }
  }

  const navPrevious = async () => {
    if (!previous_file_id.current) return;
    if (await canNavigate()) openAnnotator(previous_file_id.current)
  }
  const navNext = async () => {
    if (!next_file_id.current) return;
    if (await canNavigate()) openAnnotator(next_file_id.current)
  }

  if (!canEdit) return <div/>
  return (
    <div className={ styles.navigation }>
      <TooltipOverlay title='Shortcut' tooltipContent={ <p><Kbd keys='left'/> : Load previous recording</p> }>
        <IonButton color='medium' fill='clear' size='small'
                   disabled={ isSubmitting.current || previous_file_id.current === null }
                   onClick={ navPrevious }>
          <IonIcon icon={ caretBack } slot='icon-only'/>
        </IonButton>
      </TooltipOverlay>
      <TooltipOverlay title='Shortcut' tooltipContent={ <p><Kbd keys='enter'/> : Submit & load next recording</p> }>
        <IonButton color='medium' fill='outline'
                   disabled={ isSubmitting.current }
                   onClick={ submit }>
          Submit &amp; load next recording
        </IonButton>
      </TooltipOverlay>
      <TooltipOverlay title='Shortcut' tooltipContent={ <p><Kbd keys='right'/> : Load next recording</p> }>
        <IonButton color='medium' fill='clear' size='small'
                   disabled={ isSubmitting.current || next_file_id.current === null }
                   onClick={ navNext }>
          <IonIcon icon={ caretForward } slot='icon-only'/>
        </IonButton>
      </TooltipOverlay>
    </div>
  )
}
