import React, { Fragment, useCallback } from 'react';
import { Button, Modal, ModalHeader, useModal } from '@/components/ui';
import { Annotation } from './slice'
import { AnnotationType } from '@/api';
import { useAnnotatorAnnotation } from './hooks';
import { UpdateLabelModal } from '@/features/Labels';

export const InvalidateAnnotationModal: React.FC<{
  onClose: () => void;
  annotation: Annotation
}> = ({ onClose, annotation }) => {
  const { focus, invalidate, updateAnnotation } = useAnnotatorAnnotation()
  const labelModal = useModal()

  const move = useCallback(() => {
    onClose();
    focus(annotation)
  }, [ onClose, focus, annotation ]);

  const askUpdateLabel = useCallback(() => {
    onClose();
    focus(annotation);
    labelModal.open()
  }, [ labelModal, focus, annotation ]);

  const updateLabel = useCallback((label: string) => {
    if (!annotation) return;
    updateAnnotation(annotation, { label })
  }, [ annotation, updateAnnotation ]);

  const remove = useCallback(() => {
    onClose()
    invalidate(annotation)
  }, [ onClose, invalidate, annotation ]);

  return <Fragment>
    createPortal(<Modal onClose={ onClose }>
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

  </Modal>, document.body)
    <UpdateLabelModal isModalOpen={ labelModal.isOpen }
                      onClose={ labelModal.close }
                      selected={ annotation.label }
                      onUpdate={ updateLabel }/>
  </Fragment>
}