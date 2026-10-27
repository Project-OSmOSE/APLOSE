import React from 'react';
import { Dialog, Note } from '@/components/base';
import { LabelFragment } from "@/features/Mx/Ontology/api";
import styles from './styles.module.scss';

export type UpdateProps = {
    availableLabels: LabelFragment[];
    selectedID?: string,
    onSelectID: (id: string) => void;
}
export const Update: React.FC<UpdateProps> = ({ availableLabels, selectedID, onSelectID }) => {
    return <Dialog.Content>
        <Dialog.Title>Update annotation label</Dialog.Title>
        <Dialog.CloseIcon/>
        <Note>Choose a new label</Note>

        <div className={ styles.flexWrap }>
            { availableLabels.map((label, index) => <Dialog.Close key={ label.id }
                                                                  disabled={ label.id === selectedID }
                                                                  annotationColorIndex={ index }
                                                                  onClick={ () => onSelectID(label.id) }>
                { label.displayName }
            </Dialog.Close>) }
        </div>
    </Dialog.Content>
}