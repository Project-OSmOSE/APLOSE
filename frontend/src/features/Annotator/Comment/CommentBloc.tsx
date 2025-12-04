import React, { type ChangeEvent, useCallback } from 'react';
import { Bloc } from '@/components/ui';
import styles from './styles.module.scss'
import { Textarea } from '@/components/form';
import { IonButton, IonIcon } from '@ionic/react';
import { trashBinOutline } from 'ionicons/icons/index.js';
import { useAddComment, useRemoveComment, useUpdateComment } from './hooks';
import { swapHorizontalOutline } from 'ionicons/icons';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { selectFocusedComment } from './selectors';
import { blur, selectAnnotation } from '@/features/Annotator/Annotation';

export const CommentBloc: React.FC = () => {
  const focusedAnnotation = useAppSelector(selectAnnotation)
  const focusedComment = useAppSelector(selectFocusedComment)
  const add = useAddComment()
  const update = useUpdateComment()
  const remove = useRemoveComment()
  const dispatch = useAppDispatch()

  const updateComment = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    if (focusedComment) update({ ...focusedComment, comment: event.target.value })
    else add(event.target.value)
  }, [ focusedComment, dispatch, update, add ])

  const onSelectTask = useCallback(() => dispatch(blur()), [ dispatch ])

  return <Bloc className={ styles.comments }
               bodyClassName={ styles.body }
               smallSpaces vertical
               header="Comment">
    <Textarea maxLength={ 255 }
              rows={ 5 }
              placeholder="Enter your comment"
              style={ { resize: 'none' } }
              value={ focusedComment?.comment ?? '' }
              onInput={ updateComment }/>

    <IonButton color="danger" size="small"
               className={ styles.removeButton }
               disabled={ !focusedComment }
               onClick={ () => focusedComment && remove(focusedComment) }>
      Remove
      <IonIcon slot="end" icon={ trashBinOutline }/>
    </IonButton>

    <IonButton color="medium" fill="clear"
               size="small"
               className={ styles.taskCommentButton }
               disabled={ !focusedAnnotation }
               onClick={ onSelectTask }>
      <IonIcon slot="start" icon={ swapHorizontalOutline }/>
      Task comment
    </IonButton>
  </Bloc>
}