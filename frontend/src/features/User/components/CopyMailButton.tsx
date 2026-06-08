import React, { useCallback } from 'react';
import { UserNode } from '@/api';
import { Letter } from '@solar-icons/react';
import { Tooltip } from '@/components/base/Tooltip';
import { Toast } from '@/components/base/Toast';

export type CopyMailButtonProps = { user: Pick<UserNode, 'email' | 'displayName'> }

export const CopyMailButton: React.FC<CopyMailButtonProps> = ({ user }) => {
    const toastManager = Toast.useToastManager()

    const copy = useCallback(async () => {
        await navigator.clipboard.writeText(user.email)
        toastManager.add({
            title: 'Copied!',
            description: `Successfully copied ${ user.displayName } email address into the clipboard`,
            type: 'success',
        })
    }, [ user, toastManager ])

    return <Tooltip.Root>
        <Tooltip.Trigger aria-label={ `Copy ${ user.email }` } onClick={ copy }>
            <Letter weight="Linear" size={ 20 }/>
        </Tooltip.Trigger>
        <Tooltip.Portal>
            <Tooltip.Positioner>
                <Tooltip.Popup>
                    <Tooltip.Arrow/>
                    Copy { user.email }
                </Tooltip.Popup>
            </Tooltip.Positioner>
        </Tooltip.Portal>
    </Tooltip.Root>
}
