import React, { Fragment, useCallback } from 'react';
import { Button, Modal, ModalHeader, type ModalProps } from '@/components/ui';
import { Annotation, focusAnnotation } from './slice'
import { AnnotationType } from '@/api';
import { useInvalidateAnnotation } from './hooks';
import { useAppDispatch } from '@/features/App';

export const InvalidateAnnotationModal: React.FC<ModalProps & {
    annotation: Annotation,
    onAskLabelChange: () => void
}> = ({ onClose, annotation, onAskLabelChange }) => {
    const invalidate = useInvalidateAnnotation()

    const dispatch = useAppDispatch();

    const move = useCallback(() => {
        onClose();
        dispatch(focusAnnotation(annotation))
    }, [ onClose, dispatch, annotation ]);

    const askUpdateLabel = useCallback(() => {
        dispatch(focusAnnotation(annotation))
        onAskLabelChange()
        onClose();
    }, [ dispatch, annotation, onClose, onAskLabelChange ]);

    const remove = useCallback(() => {
        onClose()
        invalidate(annotation)
    }, [ onClose, invalidate, annotation ]);

    return <Modal onClose={ onClose }>
            <ModalHeader title="Invalidate a result" onClose={ onClose }/>
            <h5>Why do you want to invalidate this result?</h5>

            <div>
                { annotation.type !== AnnotationType.Weak && <Fragment>
                    <p>The position or dimension of the annotation is incorrect</p>
                    <Button fill="outline" onClick={ move }>
                        Move or resize
                    </Button>
                </Fragment> }
            </div>
            <div>
                <p>The label is incorrect</p>
                <Button fill="outline" onClick={ askUpdateLabel }>
                    Change the label
                </Button>
            </div>
            <div>
                <p>The annotation shouldn't exist</p>
                <Button fill="outline" onClick={ remove }>
                    Remove
                </Button>
            </div>

        </Modal>
}