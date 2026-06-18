import React from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { CloseSquare } from '@solar-icons/react';
import styles from './Dialog.module.scss';
import { Button } from '@/components/base/Button';

export const CloseIcon: React.FC = () => (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    <Dialog.Close render={ ({ color: _, ref, ...props }) => <Button { ...props }/> }
                  className={ styles.CloseIcon }>
        <CloseSquare weight="Linear" size={ 24 }/>
    </Dialog.Close>
)
