import React, { useCallback } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { mailOutline } from 'ionicons/icons/index.js';
import { useToast } from '@/components/ui';
import { UserNode } from '@/api';

export const MailButton: React.FC<{ user: Pick<UserNode, 'email' | 'displayName'> }> = ({ user }) => {
  const toast = useToast();

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(user.email)
    toast.presentSuccess(`Successfully copy ${ user.displayName } email address into the clipboard`)
  }, [ user ])

  return <IonButton fill="clear" color="medium" size="small"
                    onClick={ copy } data-tooltip={ user.email }>
    <IonIcon icon={ mailOutline } slot="icon-only"/>
  </IonButton>
}
