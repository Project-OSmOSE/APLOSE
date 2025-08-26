import React, { useCallback } from "react";
import { IonButton, IonIcon } from "@ionic/react";
import { mailOutline } from "ionicons/icons";
import { User } from "@/service/types";
import { useToast } from "@/service/ui";

export const MailButton: React.FC<{ user: Pick<User, 'email' | 'display_name'> }> = ({ user }) => {
  const toast = useToast();

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(user.email)
    toast.presentSuccess(`Successfully copy ${ user.display_name } email address into the clipboard`)
  }, [ user ])

  return <IonButton fill='clear' color='medium' size='small'
                    onClick={ copy } data-tooltip={ user.email }>
    <IonIcon icon={ mailOutline } slot='icon-only'/>
  </IonButton>
}
