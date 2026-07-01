import { useCallback } from 'react';
import type { Alert } from './Alert'
import { useAlertContext } from './Provider';

export { Provider } from './Provider'

export const useManager = () => {
    const { openAlert } = useAlertContext()

    const present = useCallback(<Confirm = true>(alert: Omit<Alert<Confirm>, 'onConfirm'>) => {
        return new Promise<Confirm | null>(resolve => {
            openAlert({ ...alert, onConfirm: resolve, onCancel: () => resolve(null) })
        })
    }, [ openAlert, alert ])

    return { present }
}