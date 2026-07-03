import React, { Fragment, useCallback } from 'react';
import { Annotation, focusAnnotation } from './slice'
import { AnnotationType } from '@/api';
import { useInvalidateAnnotation } from './hooks';
import { useAppDispatch } from '@/features/App';
import { Dialog } from '@/components/base';

export type InvalidateAnnotationModalProps = {
    annotation: Annotation,
    onAskLabelChange: () => void
}
export const InvalidateAnnotationModal: React.FC<InvalidateAnnotationModalProps> = ({
                                                                                        annotation,
                                                                                        onAskLabelChange,
                                                                                    }) => {
    const invalidate = useInvalidateAnnotation()

    const dispatch = useAppDispatch();

    const move = useCallback(() => {
        dispatch(focusAnnotation(annotation))
    }, [ dispatch, annotation ]);

    const askUpdateLabel = useCallback(() => {
        dispatch(focusAnnotation(annotation))
        onAskLabelChange()
    }, [ dispatch, annotation, onAskLabelChange ]);

    const remove = useCallback(() => {
        invalidate(annotation)
    }, [ invalidate, annotation ]);

    return <Dialog.Content>
        <Dialog.Title>Invalidate a result</Dialog.Title>
        <Dialog.CloseIcon/>

        <p>Why do you want to invalidate this result?</p>

        <div>
            { annotation.type !== AnnotationType.Weak && <Fragment>
                <p>The position or dimension of the annotation is incorrect</p>
                <Dialog.Close color="primary" onClick={ move }>
                    Move or resize
                </Dialog.Close>
            </Fragment> }
        </div>
        <div>
            <p>The label is incorrect</p>
            <Dialog.Close color="primary" onClick={ askUpdateLabel }>
                Change the label
            </Dialog.Close>
        </div>
        <div>
            <p>The annotation shouldn't exist</p>
            <Dialog.Close color="primary" onClick={ remove }>
                Remove
            </Dialog.Close>
        </div>

    </Dialog.Content>
}