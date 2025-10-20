import { useIonToast } from '@ionic/react';
import { closeCircle } from 'ionicons/icons';
import { ToastButton } from '@ionic/core/dist/types/components/toast/toast-interface';
import { getErrorMessage } from '@/service/function';
import { useLocation } from 'react-router-dom';
import { useCallback, useEffect } from 'react';

export const useToast = () => {
  const [ present, dismiss ] = useIonToast();
  const location = useLocation();

  useEffect(() => {
    // Dismiss on navigation
    dismiss()
  }, [ location ]);

  const raiseError = useCallback(({
                                    message,
                                    error,
                                    canForce,
                                    forceText,
                                  }: {
    message?: string;
    error?: any,
  } & ({ canForce?: never, forceText?: never } | { canForce: true, forceText: string })) => {
    return new Promise<boolean>((resolve) => {
      const buttons: Array<ToastButton> = [];
      if (canForce) {
        buttons.push({ text: forceText, handler: () => resolve(true) })
      }
      buttons.push({
        icon: closeCircle, handler: () => {
          resolve(false)
          dismiss();
        },
      });
      let text = ''
      if (message) text += message;
      if (message && error) text += '\n'
      if (error) text += getErrorMessage(error)
      console.info('Raised error:', message, error)
      present({
        message: text,
        color: 'danger',
        buttons,
      }).catch(console.warn);
    });
  }, [ present ])

  const presentSuccess = useCallback((message: string): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      present({
        message,
        color: 'success',
        duration: 3_000,
        buttons: [
          {
            icon: closeCircle, handler: () => {
              resolve(false)
              dismiss();
            },
          },
        ],
      }).catch(console.warn);
    });
  }, [])

  return {
    raiseError,
    presentSuccess,
    dismiss: () => {
      dismiss().catch(console.warn)
    },
  }
}
