import React, { Fragment, useCallback } from 'react';
import { Button, Modal, ModalHeader, useModalOpenState } from '@/components/ui';
import { Annotation, focusAnnotation } from './slice'
import { AnnotationType } from '@/api';
import { useInvalidateAnnotation, useUpdateAnnotation } from './hooks';
import { UpdateLabelModal } from '@/features/Labels';
import { createPortal } from 'react-dom';
import { useAppDispatch } from '@/features/App';

export const InvalidateAnnotationModal: React.FC<{
  isOpen: boolean,
  onClose: () => void;
  annotation: Annotation
}> = ({ onClose, annotation, isOpen }) => {
  const updateAnnotation = useUpdateAnnotation()
  const invalidate = useInvalidateAnnotation()
  const labelModal = useModalOpenState()
  const dispatch = useAppDispatch();

  const move = useCallback(() => {
    onClose();
    dispatch(focusAnnotation(annotation))
  }, [ onClose, dispatch, annotation ]);

  const askUpdateLabel = useCallback(() => {
    onClose();
    dispatch(focusAnnotation(annotation))
    labelModal.open()
  }, [ labelModal, dispatch, annotation ]);

  const updateLabel = useCallback((label: string) => {
    if (!annotation) return;
    updateAnnotation(annotation, { label })
  }, [ annotation, updateAnnotation ]);

  const remove = useCallback(() => {
    onClose()
    invalidate(annotation)
  }, [ onClose, invalidate, annotation ]);

  return <Fragment>
    { isOpen && createPortal(<Modal onClose={ onClose }>
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

    </Modal>, document.body) }

    <UpdateLabelModal isModalOpen={ labelModal.isOpen }
                      onClose={ labelModal.close }
                      selected={ annotation.label }
                      onUpdate={ updateLabel }/>
  </Fragment>
}