import React, { type ChangeEvent, useCallback } from 'react';
import { Bloc } from '@/components/ui';
import styles from './styles.module.scss'
import { Textarea } from '@/components/form';
import { IonButton, IonIcon } from '@ionic/react';
import { trashBinOutline } from 'ionicons/icons';
import { useAnnotatorComment } from './hooks';

export const CommentBloc: React.FC = () => {
  const { focusedComment, add, update, remove } = useAnnotatorComment()

  const updateComment = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    if (focusedComment) update({ ...focusedComment, comment: event.target.value })
    else add(event.target.value)
  }, [ focusedComment, add, update ])

  return <Bloc className={ styles.comments }
               bodyClassName={ styles.body }
               smallSpaces vertical
               header="Comment">
    <Textarea maxLength={ 255 }
              rows={ 5 }
              placeholder="Enter your comment"
              style={ { resize: 'none' } }
              value={ focusedComment?.comment ?? '' }
              onChange={ updateComment }/>

    <IonButton color="danger" size="small"
               className={ styles.removeButton }
               disabled={ !focusedComment }
               onClick={ () => focusedComment && remove(focusedComment) }>
      Remove
      <IonIcon slot="end" icon={ trashBinOutline }/>
    </IonButton>
  </Bloc>
}