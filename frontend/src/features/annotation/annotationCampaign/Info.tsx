import React, { Fragment, useCallback, useEffect } from "react";
import { dateToString } from "@/service/function.ts";
import { IonButton, IonIcon } from "@ionic/react";
import { mailOutline } from "ionicons/icons";
import { useToast } from "@/service/ui";
import { FadedText } from "@/components/ui";

export const AnnotationCampaignCreation: React.FC<{
  createdAt: string,
  owner: { displayName?: string | null, email: string },
}> = ({ createdAt, owner }) => {

  const toast = useToast();

  const copyOwnerMail = useCallback(async () => {
    await navigator.clipboard.writeText(owner.email)
    toast.presentSuccess(`Successfully copy ${ owner.displayName } email address into the clipboard`)
  }, [ owner.email ])

  useEffect(() => {
    return () => {
      toast.dismiss()
    }
  }, []);

  return <Fragment>
    Created on { dateToString(createdAt) } by { owner.displayName }
    { owner.email && <Fragment>
        &nbsp;
        <IonButton fill='clear' color='medium' size='small'
                   onClick={ copyOwnerMail } data-tooltip={ owner.email }>
            <IonIcon icon={ mailOutline } slot='icon-only'/>
        </IonButton>
    </Fragment> }
  </Fragment>
}

export const AnnotationCampaignDescription: React.FC<{ description?: string | null }> = ({ description }) => {
  if (!description) return <Fragment/>;
  return <div><FadedText>Description</FadedText><p>{ description }</p></div>
}

export const AnnotationCampaignDeadline: React.FC<{ deadline?: string | null }> = ({ deadline }) => {
  if (!deadline) return <Fragment/>;
  return <div><FadedText>Deadline</FadedText><p>{ dateToString(deadline) }</p></div>
}

export const AnnotationCampaignAnnotationType: React.FC<{
  allowPointAnnotation: boolean
}> = ({ allowPointAnnotation }) => (
  <div>
    <FadedText>Annotation types</FadedText>
    <p>Weak, box{ allowPointAnnotation ? ', point' : '' }</p>
  </div>
)
