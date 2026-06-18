import React, { useCallback } from 'react';
import { UserNode } from '@/api';
import { Letter } from '@solar-icons/react';
import { Toast } from '@/components/base/Toast';
import { Popover } from '@/components/base/Popover';
import { Button } from '@/components/base/Button';

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

    return <Popover.Root>
        {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */ }
        <Popover.Trigger render={ ({ ref, color, ...props }) => <Button { ...props }/> }
                         aria-label={ `Copy ${ user.email }` }
                         onClick={ copy }>
            <Letter weight="Linear" size={ 20 }/>
        </Popover.Trigger>
        <Popover.Content>
            Copy { user.email }
        </Popover.Content>
    </Popover.Root>
}
