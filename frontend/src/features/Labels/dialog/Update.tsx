import React from 'react';
import { Dialog, Note } from '@/components/base';
import type { LabelFragment } from '../api';
import styles from './styles.module.scss';

export type UpdateProps = {
    availableLabels: LabelFragment[];
    selected?: LabelFragment,
    onSelect: (label: LabelFragment) => void;
}
export const Update: React.FC<UpdateProps> = ({ availableLabels, selected, onSelect }) => {
    return <Dialog.Content>
        <Dialog.Title>Update annotation label</Dialog.Title>
        <Dialog.CloseIcon/>
        <Note>Choose a new label</Note>

        <div className={ styles.flexWrap }>
            { availableLabels.map((label, index) => <Dialog.Close key={ label.id }
                                                                  disabled={ label.name === selected?.name }
                                                                  annotationColorIndex={ index }
                                                                  onClick={ () => onSelect(label) }>
                { label.name }
            </Dialog.Close>) }
        </div>
    </Dialog.Content>
}