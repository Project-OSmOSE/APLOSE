import { useIonToast } from '@ionic/react';
import { closeCircle } from 'ionicons/icons/index.js';
import { ToastButton } from '@ionic/core/dist/types/components/toast/toast-interface';
import { getErrorMessage } from '@/service/function';
import { useLocation } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import type { Color } from '@ionic/core';
import type { GqlError } from '@/api/baseGqlApi';

export const useToast = () => {
  const [ present, dismiss ] = useIonToast();
  const location = useLocation();

  useEffect(() => {
    // Dismiss on navigation
    dismiss()
  }, [ location ]);
  useEffect(() => {
    return () => {
      // Dismiss when usage is done
      dismiss();
    }
  }, []);

  const raiseError = useCallback(({
                                    message,
                                    error,
                                    gqlError,
                                    canForce,
                                    forceText,
                                  }: {
    message?: string;
    error?: any,
    gqlError?: GqlError,
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
      const text = []
      if (message) text.push(message)
      if (error) text.push(getErrorMessage(error))
      if (gqlError?.statusErrorMessage) text.push(getErrorMessage(gqlError.statusErrorMessage))
      if (gqlError?.messages) text.push(getErrorMessage(gqlError.messages.join(' ')))
      present({
        message: text.join('\n'),
        color: 'danger',
        buttons,
      }).catch(console.warn);
    });
  }, [ present, dismiss ])

  const _present = useCallback((message: string, color: Color): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      present({
        message,
        color,
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
  }, [present, dismiss])

  return {
    raiseError,
    present: _present,
    dismiss: () => {
      dismiss().catch(console.warn)
    },
  }
}
