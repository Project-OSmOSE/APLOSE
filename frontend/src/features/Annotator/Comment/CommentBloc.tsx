import React, { type ChangeEvent, useCallback } from 'react';
import { Bloc } from '@/components/ui';
import styles from './styles.module.scss'
import { useAddComment, useRemoveComment, useUpdateComment } from './hooks';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { selectFocusedComment } from './selectors';
import { blur, selectAnnotation } from '@/features/Annotator/Annotation';
import { useLoaderData } from '@tanstack/react-router';
import { Button, Input } from '@/components/base';
import { SortHorizontal, TrashBinTrash } from '@solar-icons/react';

export const CommentBloc: React.FC = () => {
    const focusedAnnotation = useAppSelector(selectAnnotation)
    const focusedComment = useAppSelector(selectFocusedComment)
    const { user } = useLoaderData({ from: '/_authenticated' })
    const add = useAddComment()
    const update = useUpdateComment()
    const remove = useRemoveComment()
    const dispatch = useAppDispatch()

    const updateComment = useCallback((event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (focusedComment) update({ ...focusedComment, comment: event.target.value })
        else add(event.target.value)
    }, [ focusedComment, dispatch, update, add ])

    const onSelectTask = useCallback(() => dispatch(blur()), [ dispatch ])

    return <Bloc.Root className={ styles.comments }>
        <Bloc.Title>Comment</Bloc.Title>
        <Bloc.Content className={ styles.body } smallSpaces vertical>

            <Input type="textarea"
                   maxLength={ 255 }
                   rows={ 5 }
                   placeholder="Enter your comment"
                   style={ { resize: 'none' } }
                   disabled={ focusedAnnotation && focusedAnnotation?.annotator !== user.id }
                   value={ focusedComment?.comment ?? '' }
                   onChange={ updateComment }/>

            <Button color="danger"
                    className={ styles.removeButton }
                    disabled={ !focusedComment }
                    onClick={ () => focusedComment && remove(focusedComment) }>
                Remove
                <TrashBinTrash weight="Linear" size={ 20 }/>
            </Button>

            <Button color="medium"
                    className={ styles.taskCommentButton }
                    disabled={ !focusedAnnotation }
                    onClick={ onSelectTask }>
                <SortHorizontal weight="Linear" size={ 20 }/>
                Task comment
            </Button>
        </Bloc.Content>
    </Bloc.Root>
}