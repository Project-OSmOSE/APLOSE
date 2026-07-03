import { ButtonGroup, Dialog } from '@/components/base';
import { type ReactNode } from 'react';
import type { BaseColor } from '@/components/base/types';

export type AlertButton<Confirm> = {
    text?: string;
    color?: BaseColor,
} & ({
    type: 'Cancel';
} | {
    type: 'Confirm';
    confirmData: Confirm
})

export type Alert<Confirm> = {
    color?: BaseColor,
    title?: string,
    message: string | ReactNode,
    buttons?: AlertButton<Confirm>[],
    onCancel?: () => void,
    onConfirm?: (data: Confirm) => void,
}

export function Alert<Confirm>({
                                   title,
                                   color,
                                   message,
                                   buttons,
                                   onCancel,
                                   onConfirm,
                               }: Alert<Confirm>) {
    return <Dialog.Content alert>
        { title && <Dialog.Title color={ color }>{ title }</Dialog.Title> }
        <Dialog.Description>{ message }</Dialog.Description>

        { buttons && <ButtonGroup end>
            { buttons.map((button, key) =>
                <Dialog.Close autoFocus={ button.type === 'Confirm' }
                              key={ key }
                              color={ button.color ?? (button.type === 'Cancel' ? 'medium' : (color ?? 'primary')) }
                              children={ button.text ?? button.type }
                              onClick={ () => button.type === 'Cancel' ? onCancel?.() : onConfirm?.(button.confirmData) }/>) }
        </ButtonGroup> }
    </Dialog.Content>
}
