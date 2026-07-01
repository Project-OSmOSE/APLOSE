import React, { Fragment, useCallback } from 'react';
import { Alert as AlertType, AlertAction } from './type';
import styles from './style.module.scss';
import { createPortal } from 'react-dom';
import { Modal, ModalFooter } from '@/components/ui';
import { NON_FILTERED_KEY_DOWN_EVENT, useRegisterToEvent } from '@/components/ui/Event';
import { Button } from '@/components/base';

export const Alert: React.FC<{
    alert: AlertType
    hide: () => void;
}> = ({ alert, hide }) => {

    const onKbdEvent = useCallback((event: KeyboardEvent) => {
        if (event.code === 'Enter' || event.code === 'NumpadEnter') {
            switch (alert.type) {
                case 'Success':
                    hide();
                    break;
                case 'Warning':
                    if (alert.actions.length === 1) onAction(alert.actions[0]);
                    break;
                case 'Error':
                    // Do nothing
                    break;
            }
        }
    }, [ hide, alert ]);
    useRegisterToEvent(NON_FILTERED_KEY_DOWN_EVENT, onKbdEvent);

    const onAction = useCallback((action: AlertAction) => {
        if (alert.type === 'Success') return;
        hide();
        action.callback()
    }, [ alert, hide ])

    return createPortal(<Modal className={ styles.alert }>
        <p>{ alert.message }</p>

        <ModalFooter className={ styles.buttons }>
            { alert.type === 'Success' &&
                <Button color="success" onClick={ hide }>Ok</Button> }

            { alert.type === 'Warning' && <Fragment>
                <Button color="medium" onClick={ hide }>Cancel</Button>
                { alert.actions.map((action, key) =>
                    <Button color="warning" onClick={ () => onAction(action) }
                            key={ key }>{ action.label }</Button>) }
            </Fragment> }

            { alert.type === 'Error' && <Fragment>
                { alert.actions.map((action, key) =>
                    <Button color="danger" onClick={ () => onAction(action) }
                            key={ key }>{ action.label }</Button>) }
                <Button color="medium" onClick={ hide }>Cancel</Button>
            </Fragment> }
        </ModalFooter>
    </Modal>, document.body)
}