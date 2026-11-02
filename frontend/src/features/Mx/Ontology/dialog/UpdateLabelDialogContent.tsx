import React from 'react';
import { Dialog, Note } from '@/components/base';
import { LabelNode } from "@/api/types.gql-generated.ts";
import styles from './styles.module.scss';

export type UpdateProps = {
    availableLabels: Pick<LabelNode, 'id' | 'displayName'>[];
    selectedID?: string,
    onSelectID: (id: string) => void;
}
export const UpdateLabelDialogContent: React.FC<UpdateProps> = ({ availableLabels, selectedID, onSelectID }) => {
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